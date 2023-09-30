// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Dispatch, useCallback, useRef, useMemo, useState, SetStateAction } from "react";
import { theme } from "antd";
import { EditOutlined } from "@ant-design/icons";

import { recognize } from "./recognition";
import { throttle } from "lodash-es";

import Debug from "debug";
const debug = Debug("kanjischool:hw-canvas");

/*
 * Based on https://github.com/ChenYuHo/handwriting.js
 * MIT Licensed
 */

const { useToken } = theme;

const LINE_WIDTH = 4;
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 200;
const RECOGNITION_THROTTLE = 300;

interface CanvasState {
  drawing: boolean;

  handwritingX: number[];
  handwritingY: number[];

  trace: number[][][]; // Sent to recognition service
  step: string[]; // Canvas data URIs of undo steps
  redoTrace: number[][][];
  redoStep: string[];
}

type HookRes = [
  JSX.Element, // Canvas container
  () => void, // Undo
  () => void, // Redo
  () => void // Clear
];

/// Map a mouse event to a canvas location
function getMousePos(
  canvas: HTMLCanvasElement,
  e: React.MouseEvent<HTMLCanvasElement>
): [number, number] {
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) * (CANVAS_WIDTH / rect.width);
  const y = (e.clientY - rect.top) * (CANVAS_HEIGHT / rect.height);
  return [x, y];
}

/// Map a touch event to a canvas location
function getTouchPos(
  canvas: HTMLCanvasElement,
  e: React.TouchEvent<HTMLCanvasElement>,
  target: boolean
): [number, number] {
  const de = document.documentElement;
  const rect = canvas.getBoundingClientRect();
  const baseX = (rect.left + window.pageXOffset - de.clientLeft);
  const baseY = (rect.top + window.pageYOffset - de.clientTop);

  // Use only the first available touch. For touchMove and touchEnd events, use
  // targetTouches. For touchStart, use changedTouches.
  const touch = target ? e.targetTouches[0] : e.changedTouches[0];
  const x = (touch.pageX - baseX) * (CANVAS_WIDTH / rect.width);
  const y = (touch.pageY - baseY) * (CANVAS_HEIGHT / rect.height);

  return [x, y];
}

/// Draw a canvas image from a data URI
function loadFromUrl(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  url: string
): void {
  const img = new Image();
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  };
  img.src = url;
}

/// Send the recognition API request and set the predictions when complete
async function recognizeAndSet(
  trace: number[][][],
  setPredictions: Dispatch<SetStateAction<string[]>>
) {
  const res = await recognize(trace, CANVAS_WIDTH, CANVAS_HEIGHT);
  setPredictions(res);
}
const throttledRecognizeAndSet = throttle(recognizeAndSet, RECOGNITION_THROTTLE);

export function useHwCanvas(
  setPredictions: Dispatch<SetStateAction<string[]>>
): HookRes {
  const { token } = useToken();
  const penColor = token.colorPrimary;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const getCtx = (): [CanvasRenderingContext2D | undefined, HTMLCanvasElement | undefined] =>
    ([canvasRef.current?.getContext("2d") || undefined, canvasRef.current || undefined]);

  // Whether the canvas is currently empty, used to show the pencil
  // background image to indicate a drawable area
  const [empty, setEmpty] = useState(true);

  // State is stored in a ref, so it can be used by all the callbacks without
  // re-rendering everything every single time something happens
  const stateRef = useRef<CanvasState>({
    drawing: false,

    handwritingX: [],
    handwritingY: [],

    trace: [],
    step: [],
    redoTrace: [],
    redoStep: []
  });

  const onCanvasInit = useCallback((canvas: HTMLCanvasElement) => {
    if (canvasRef.current === canvas) return;
    (canvasRef as any).current = canvas;
    const [ctx] = getCtx();
    if (!ctx) return;

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    ctx.lineWidth = LINE_WIDTH;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = penColor;

    debug("handwriting canvas init", canvas.width, canvas.height);
  }, [penColor]);

  /// Raw pen down event shared by mouse and touch
  const penDown = useCallback((x: number, y: number) => {
    const [ctx, canvas] = getCtx(); if (!ctx || !canvas) return;
    const state = stateRef.current;

    state.handwritingX = [];
    state.handwritingY = [];

    // Only respond to mouse/touch movement if the pen is down
    state.drawing = true;

    ctx.beginPath();
    ctx.moveTo(x, y);

    state.handwritingX.push(x);
    state.handwritingY.push(y);

    setEmpty(false);
  }, []);

  /// Raw pen movement event shared by mouse and touch
  const penMove = useCallback((x: number, y: number) => {
    const [ctx, canvas] = getCtx(); if (!ctx || !canvas) return;
    const state = stateRef.current;

    // Only respond to mouse/touch movement if the pen is down
    if (!state.drawing) return;

    ctx.lineTo(x, y);
    ctx.stroke();

    state.handwritingX.push(x);
    state.handwritingY.push(y);
  }, []);

  /// Raw pen up event shared by mouse and touch
  const penUp = useCallback((x: number, y: number) => {
    const [ctx, canvas] = getCtx(); if (!ctx || !canvas) return;
    const state = stateRef.current;

    // Finish the stroke
    ctx.lineTo(x, y);
    ctx.stroke();

    state.handwritingX.push(x);
    state.handwritingY.push(y);

    // Collate the x, y and timing positions into a trace/ink entry, and clear
    // the trace redo stack (to prevent nonsense)
    // TODO: timing positions
    const traceEntry = [state.handwritingX, state.handwritingY, []];
    state.trace.push(traceEntry);
    state.redoTrace = [];

    state.drawing = false;

    // Add an undo state and clear the step redo stack (to prevent nonsense)
    state.step.push(canvas.toDataURL());
    state.redoStep = [];

    // Perform the recognition async
    throttledRecognizeAndSet(state.trace, setPredictions);
  }, [setPredictions]);

  /// Undo button handler (returned by hook)
  const undo = useCallback(() => {
    const [ctx, canvas] = getCtx(); if (!ctx || !canvas) return;
    const state = stateRef.current;
    if (state.step.length <= 0) return; // Do nothing if there's no undo states

    state.drawing = false;

    // Move newest step to the redo stack; steps are the canvas URI snapshots
    const step = state.step.pop();
    if (step) state.redoStep.push(step);
    // Move newest trace to the redo stack; traces are the handwriting cursor
    // positions sent to the API
    const trace = state.trace.pop();
    if (trace) state.redoTrace.push(trace);

    if (state.step.length <= 0) {
      // Clear the canvas if this was the last step
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Clear the predictions and mark canvas as empty again
      setPredictions([]);
      setEmpty(true);
    } else {
      // Otherwise load the image from the stack's new top step into the canvas
      loadFromUrl(canvas, ctx, state.step.slice(-1)[0]);
      // Re-perform recognition
      throttledRecognizeAndSet(state.trace, setPredictions);
    }
  }, [setPredictions]);

  /// Redo button handler (returned by hook)
  const redo = useCallback(() => {
    const [ctx, canvas] = getCtx(); if (!ctx || !canvas) return;
    const state = stateRef.current;
    if (state.redoStep.length <= 0) return; // Do nothing if no redo states

    state.drawing = false;

    // Move the redo states back into the regular step/trace stacks
    const step = state.redoStep.pop();
    if (step) state.step.push(step);
    const trace = state.redoTrace.pop();
    if (trace) state.trace.push(trace);

    // Load the image from the stack's new top step back into the canvas
    loadFromUrl(canvas, ctx, state.step.slice(-1)[0]);

    // Re-perform recognition
    throttledRecognizeAndSet(state.trace, setPredictions);

    // Ensure the canvas is marked as non-empty again
    setEmpty(false);
  }, [setPredictions]);

  /// Clear canvas button handler (returned by hook)
  const clear = useCallback(() => {
    const [ctx, canvas] = getCtx(); if (!ctx || !canvas) return;
    const state = stateRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    state.drawing = false;

    state.trace = [];
    state.step = [];
    state.redoTrace = [];
    state.redoStep = [];

    setEmpty(true);
    setPredictions([]);
  }, [setPredictions]);

  // Canvas mouse event handlers
  const onMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const [, canvas] = getCtx(); if (!canvas) return;
    const [x, y] = getMousePos(canvas, e);
    penDown(x, y);
  }, [penDown]);
  const onMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const [, canvas] = getCtx(); if (!canvas) return;
    const [x, y] = getMousePos(canvas, e);
    penMove(x, y);
  }, [penMove]);
  const onMouseUp = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const [, canvas] = getCtx(); if (!canvas) return;
    const [x, y] = getMousePos(canvas, e);
    penUp(x, y);
  }, [penUp]);

  // Canvas touch event handlers
  const onTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    const [, canvas] = getCtx(); if (!canvas) return;
    const [x, y] = getTouchPos(canvas, e, false);
    penDown(x, y);
  }, [penDown]);
  const onTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    const [, canvas] = getCtx(); if (!canvas) return;
    const [x, y] = getTouchPos(canvas, e, true);
    penMove(x, y);
  }, [penMove]);
  const onTouchEnd = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    const [, canvas] = getCtx(); if (!canvas) return;
    const [x, y] = getTouchPos(canvas, e, true);
    penUp(x, y);
  }, [penUp]);

  // Canvas is cached so its ref doesn't change when `empty` state changes
  const canvasEl = useMemo(() => <canvas
    className="w-full aspect-2/1 cursor-pen light:cursor-pen-light touch-none select-none"

    ref={onCanvasInit}
    onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp}
    onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
  />, [onCanvasInit, onMouseDown, onMouseMove, onMouseUp, onTouchStart, onTouchMove, onTouchEnd]);

  const el = useMemo(() => <div className="relative">
    {/* Cached canvas */}
    {canvasEl}
    {/* Pencil background image shown when the canvas is empty, used to indicate
      * a drawable area to the user */}
    {empty && <EditOutlined
      className="w-full flex items-center justify-center absolute inset-0 pointer-events-none
        text-white/10 light:text-black/10
        [&_svg]:w-1/2 [&_svg]:h-1/2"
    />}
  </div>, [empty, canvasEl]);

  return [el, undo, redo, clear];
}
