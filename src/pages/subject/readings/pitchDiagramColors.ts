import { PitchPattern } from "@utils/pitchAccent.ts";

interface Colors {
  stroke: string;
  fill: string;
}

export const pitchDiagramColors: Record<PitchPattern, Colors> = {
  [PitchPattern.Heiban]: {
    stroke: "stroke-[#eb2f96]",
    fill: "fill-[#eb2f96]",
  },
  [PitchPattern.Atamadaka]: {
    stroke: "stroke-orange-5",
    fill: "fill-orange-5",
  },
  [PitchPattern.Nakadaka]: {
    stroke: "stroke-blue-5",
    fill: "fill-blue-5",
  },
  [PitchPattern.Odaka]: {
    stroke: "stroke-green-5",
    fill: "fill-green-5",
  }
};
