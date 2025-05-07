// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Button } from "@comp/Button";
import { Tooltip } from "antd";
import classNames from "classnames";
import { Loader, LoaderCircle, Volume2 } from "lucide-react";
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";

import { useAppSelector } from "@store";

import { ApiSubjectVocabulary, ApiSubjectVocabularyLike, getStoredAudio } from "@api";
import { getIntegerSetting, sample } from "@utils";

import { globalMessage, globalNotification } from "@global/AntInterface.tsx";

import { GlobalHotKeys } from "react-hotkeys";

import Debug from "debug";
const debug = Debug("kanjischool:audio-button");

let audioContext: AudioContext;

type VocabAudioHookRes = [
  (pronunciation: string) => void, // play(pronunciation)
  boolean, // loading
  boolean, // disabled
  boolean, // playing
];

function playSound(
  buffer: AudioBuffer | undefined,
  setPlaying: Dispatch<SetStateAction<boolean>>,
  volume: number
) {
  try {
    if (!buffer) {
      debug("playSound: not playing sound, buffer was undefined");
      return;
    }

    if (volume === 0) {
      globalMessage.warning("Your volume is too low to hear anything!");
    }

    if (audioContext.state === "suspended") {
      debug("playSound: audioContext was suspended! attempting to resume");
      audioContext.resume();
    }

    const gainNode = audioContext.createGain();
    gainNode.gain.value = volume / 100;
    gainNode.connect(audioContext.destination);

    debug("playSound: audioContext state: %s; playing sound (length: %o, duration: %o, volume: %o)", audioContext.state, buffer.length, buffer.duration, gainNode.gain.value);

    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.onended = () => {
      source.disconnect();
      debug("playSound: buffer source disconnected");
      setPlaying(false);
    };

    source.connect(gainNode);
    source.start();
    setPlaying(true);
  } catch (e: any) {
    debug("error while playing audio", e);
    console.error(e);
    setPlaying(false);
  }
}

export function useVocabAudio(
  subject?: ApiSubjectVocabularyLike
): VocabAudioHookRes {
  const stillSyncing = useAppSelector(s => s.sync.syncingAudio);

  const [savedPronunciation, setSavedPronunciation] = useState<string>();
  const [buffers, setBuffers] = useState<AudioBuffer[]>();
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [playing, setPlaying] = useState(false);

  const finalLoading = !subject || (!disabled && (loading || stillSyncing));
  const finalDisabled = !subject || disabled;

  const play = useCallback(async (pronunciation: string) => {
    if (!audioContext) {
      debug("useVocabAudio.play: no audio context yet, creating now");
      audioContext = new AudioContext();
    }

    debug("useVocabAudio.play called %o %s %o %o", subject, pronunciation, finalLoading, finalDisabled);
    if (!subject || finalLoading || finalDisabled) return;

    const audioVolume = getIntegerSetting("audioVolume");

    // If we've already loaded the sounds, play a random one
    if (buffers && savedPronunciation === pronunciation) {
      debug("useVocabAudio.play: playing saved pronunciation %s: %o (volume: %o)", pronunciation, buffers, audioVolume);
      playSound(sample(buffers), setPlaying, audioVolume);
      return;
    }

    debug("useVocabAudio.play: fetching audio");
    setLoading(true);

    // Find all the voice actors for this subject + pronunciation
    const subjectId = subject.id;
    const pronunciations = subject.data.pronunciation_audios
      .filter(a => a.metadata.pronunciation === pronunciation);
    const actors = [...new Set(pronunciations.map(p => p.metadata.voice_actor_id))];
    const newBuffers: AudioBuffer[] = [];

    // Decode the audio for each voice actor
    for (const actor of actors) {
      const storedAudio = await getStoredAudio(subjectId, actor, pronunciation);
      if (!storedAudio) {
        debug("useVocabAudio.play: missing audio for subject id %o, actor %o, pronunciation %s",
          subjectId, actor, pronunciation);
        globalNotification.error({ message: "Missing audio, see console for details." });
        setDisabled(true);
        return;
      }

      const [blob, contentType] = storedAudio;
      const audioData = await blob.arrayBuffer();

      debug("useVocabAudio.play: new sound: subject id %o, actor %o, pronunciation %s, contentType %s",
        subjectId, actor, pronunciation, contentType);
      try {
        const buffer = await audioContext.decodeAudioData(audioData);
        newBuffers.push(buffer);
      } catch (e: any) {
        debug("error while decoding audio", e);

        const audioEl = document.createElement("audio");
        const canPlay = audioEl.canPlayType(contentType) || "NO";
        audioEl.remove();
        debug("canPlayType %s? %s", contentType, canPlay);

        console.error(e, { contexts: { audio: {
          "subject_id": subjectId,
          "actor_id": actor,
          "content_type": contentType,
          "can_play": canPlay
        }}});

        // globalNotification.error({ message: "Failed to decode audio, see console for details." });
        setDisabled(true);
        return;
      }
    }

    debug("useVocabAudio.play: now playing fresh sound (volume: %o)", audioVolume);
    playSound(sample(newBuffers), setPlaying, audioVolume);
    setBuffers(newBuffers);
    setSavedPronunciation(pronunciation);
    setLoading(false);
  }, [subject, savedPronunciation, buffers, finalLoading, finalDisabled]);

  return [play, finalLoading, finalDisabled, playing];
}

const KEY_MAP = {
  PLAY_AUDIO: ["p", "j", "shift+j"]
};

interface Props {
  subject: ApiSubjectVocabulary;
  pronunciation: string;
  autoPlay?: boolean;
  hasShortcut?: boolean;
}

export function AudioButton({
  subject,
  pronunciation,
  autoPlay, hasShortcut
}: Props): React.ReactElement {
  const [play, loading, disabled, playing] = useVocabAudio(subject);
  const triggerPlay = useCallback(() => play(pronunciation), [play, pronunciation]);

  const [hasAutoPlayed, setHasAutoPlayed] = useState(false);
  useEffect(() => {
    if (!autoPlay || hasAutoPlayed) return;
    debug("auto-playing audio");
    triggerPlay();
    setHasAutoPlayed(true);
  }, [triggerPlay, autoPlay, hasAutoPlayed]);

  const classes = classNames({
    "border-vocabulary text-vocabulary": playing
  });

  return <>
    {/* Wrap the button in a tooltip to help with keyboard shortcut
      * discoverability. */}
    <Tooltip title={hasShortcut ? <>Play audio <b>(P)</b></> : undefined}>
      <Button
        disabled={loading || disabled}
        onClick={triggerPlay}
        className={classes}
      >
        {loading ? <LoaderCircle className="animate-spin" /> : <Volume2 />}
        {pronunciation}
      </Button>
    </Tooltip>

    {/* Keyboard shortcuts to play this audio, if allowed */}
    {hasShortcut && <GlobalHotKeys
      keyMap={KEY_MAP}
      handlers={{ PLAY_AUDIO: triggerPlay }}
      allowChanges
    />}
  </>;
}
