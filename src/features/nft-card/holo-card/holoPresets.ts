import type { HoloGrade, HoloPreset } from "./types";

export const holoPresets: Record<HoloGrade, HoloPreset> = {
  COM: {
    grade: "COM",
    label: "Common",
    className: "holo-grade-com",
    intensity: 0.18,
    spectrum: "rgba(180, 196, 220, 0.34), rgba(255, 255, 255, 0.12), rgba(132, 152, 185, 0.24)",
    foil: "rgba(212, 222, 238, 0.26)",
    accent: "#cfd8e7",
    edge: "rgba(214, 226, 244, 0.26)",
    speed: 0.72
  },
  MID: {
    grade: "MID",
    label: "Middle",
    className: "holo-grade-mid",
    intensity: 0.28,
    spectrum: "rgba(72, 255, 180, 0.32), rgba(207, 255, 232, 0.12), rgba(33, 128, 102, 0.26)",
    foil: "rgba(104, 255, 201, 0.3)",
    accent: "#5effc4",
    edge: "rgba(94, 255, 196, 0.3)",
    speed: 0.84
  },
  ADV: {
    grade: "ADV",
    label: "Advanced",
    className: "holo-grade-adv",
    intensity: 0.38,
    spectrum: "rgba(56, 205, 255, 0.34), rgba(43, 101, 255, 0.18), rgba(177, 242, 255, 0.2)",
    foil: "rgba(84, 213, 255, 0.34)",
    accent: "#43d7ff",
    edge: "rgba(67, 215, 255, 0.36)",
    speed: 0.96
  },
  RAR: {
    grade: "RAR",
    label: "Rare",
    className: "holo-grade-rar",
    intensity: 0.52,
    spectrum: "rgba(160, 80, 255, 0.38), rgba(57, 203, 255, 0.22), rgba(245, 204, 255, 0.24)",
    foil: "rgba(171, 98, 255, 0.42)",
    accent: "#a45fff",
    edge: "rgba(171, 98, 255, 0.46)",
    speed: 1.08
  },
  HER: {
    grade: "HER",
    label: "Heroic",
    className: "holo-grade-her",
    intensity: 0.62,
    spectrum: "rgba(238, 242, 255, 0.38), rgba(255, 219, 132, 0.24), rgba(84, 207, 255, 0.24)",
    foil: "rgba(242, 247, 255, 0.44)",
    accent: "#f5f8ff",
    edge: "rgba(245, 248, 255, 0.5)",
    speed: 1.16
  },
  LEG: {
    grade: "LEG",
    label: "Legend",
    className: "holo-grade-leg",
    intensity: 0.72,
    spectrum: "rgba(255, 214, 93, 0.42), rgba(238, 246, 255, 0.26), rgba(126, 86, 255, 0.22)",
    foil: "rgba(255, 216, 112, 0.5)",
    accent: "#ffd86f",
    edge: "rgba(255, 216, 112, 0.56)",
    speed: 1.28
  },
  MYT: {
    grade: "MYT",
    label: "Mythic",
    className: "holo-grade-myt",
    intensity: 0.85,
    spectrum: "rgba(192, 91, 255, 0.46), rgba(54, 217, 255, 0.34), rgba(255, 88, 174, 0.26), rgba(255, 229, 130, 0.2)",
    foil: "rgba(186, 91, 255, 0.58)",
    accent: "#c25bff",
    edge: "rgba(194, 91, 255, 0.66)",
    speed: 1.42
  }
};

export const gradeOrder: HoloGrade[] = ["COM", "MID", "ADV", "RAR", "HER", "LEG", "MYT"];
