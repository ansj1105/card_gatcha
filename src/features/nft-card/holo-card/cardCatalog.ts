import type { HoloGrade } from "./types";
import { assetPath } from "./assetPath";

export type DemoCard = {
  id: string;
  grade: HoloGrade;
  name: string;
  edition: string;
  frontSrc: string;
};

export const demoCards: DemoCard[] = [
  {
    id: "signal-kitten",
    grade: "COM",
    name: "Signal Kitten",
    edition: "#000123 / 10000",
    frontSrc: assetPath("assets/nft-card/cards/front/korion-com-signal-kitten.png")
  },
  {
    id: "emerald-climber",
    grade: "MID",
    name: "Emerald Climber",
    edition: "#000077 / 5000",
    frontSrc: assetPath("assets/nft-card/cards/front/korion-mid-emerald-climber.png")
  },
  {
    id: "azure-watcher",
    grade: "ADV",
    name: "Azure Watcher",
    edition: "#000019 / 2000",
    frontSrc: assetPath("assets/nft-card/cards/front/korion-adv-azure-watcher.png")
  },
  {
    id: "violet-sentinel",
    grade: "RAR",
    name: "Violet Sentinel",
    edition: "#000008 / 500",
    frontSrc: assetPath("assets/nft-card/cards/front/korion-rar-violet-sentinel.png")
  },
  {
    id: "crimson-guardian",
    grade: "HER",
    name: "Crimson Guardian",
    edition: "#000003 / 150",
    frontSrc: assetPath("assets/nft-card/cards/front/korion-her-crimson-guardian.png")
  },
  {
    id: "golden-sovereign",
    grade: "LEG",
    name: "Golden Sovereign",
    edition: "#000001 / 50",
    frontSrc: assetPath("assets/nft-card/cards/front/korion-leg-golden-sovereign.png")
  },
  {
    id: "genesis-aura",
    grade: "MYT",
    name: "Genesis Aura",
    edition: "#000001 / 10",
    frontSrc: assetPath("assets/nft-card/cards/front/korion-rar-demo.webp")
  }
];
