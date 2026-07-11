import type { MouseEvent } from "react";

export type HoloGrade = "COM" | "MID" | "ADV" | "RAR" | "HER" | "LEG" | "MYT";

export type HoloQuality = "low" | "high";

export type HoloEffect =
  | "basic"
  | "reverseHolo"
  | "regularHolo"
  | "exRegular"
  | "exFullArt"
  | "illustrationRare"
  | "pokeBall"
  | "specialIllustration"
  | "hyperRare"
  | "prism"
  | "galaxy"
  | "rainbow"
  | "shatter"
  | "premium";

export type HoloCardProps = {
  frontSrc: string;
  backSrc?: string;
  foilMaskSrc?: string;
  frameMaskSrc?: string;
  artMaskSrc?: string;
  grade: HoloGrade;
  alt: string;
  interactive?: boolean;
  autoDemo?: boolean;
  enableGyro?: boolean;
  flipped?: boolean;
  disabled?: boolean;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  quality?: HoloQuality;
  effect?: HoloEffect;
};

export type HoloPreset = {
  grade: HoloGrade;
  label: string;
  className: string;
  intensity: number;
  spectrum: string;
  foil: string;
  accent: string;
  edge: string;
  speed: number;
};

export type TiltState = {
  pointerX: number;
  pointerY: number;
  fromCenter: number;
  fromLeft: number;
  fromTop: number;
  rotateX: number;
  rotateY: number;
  backgroundX: number;
  backgroundY: number;
  opacity: number;
  scale: number;
  glareOpacity: number;
};
