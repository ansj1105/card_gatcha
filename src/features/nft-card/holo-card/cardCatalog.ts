import type { HoloGrade } from "./types";

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

export type DemoCard = {
  id: string;
  grade: HoloGrade;
  name: string;
  edition: string;
  frontSrc: string;
  previewSrc: string;
};

export const demoCards: DemoCard[] = [
  {
    id: "signal-kitten",
    grade: "COM",
    name: "Signal Kitten",
    edition: "#000123 / 10000",
    frontSrc: asset("assets/nft-card/cards/front/korion-com-signal-kitten.png"),
    previewSrc: asset("assets/nft-card/cards/preview/korion-com-signal-kitten-preview.jpg")
  },
  {
    id: "emerald-climber",
    grade: "MID",
    name: "Emerald Climber",
    edition: "#000077 / 5000",
    frontSrc: asset("assets/nft-card/cards/front/korion-mid-emerald-climber.png"),
    previewSrc: asset("assets/nft-card/cards/preview/korion-mid-emerald-climber-preview.jpg")
  },
  {
    id: "azure-watcher",
    grade: "ADV",
    name: "Azure Watcher",
    edition: "#000019 / 2000",
    frontSrc: asset("assets/nft-card/cards/front/korion-adv-azure-watcher.png"),
    previewSrc: asset("assets/nft-card/cards/preview/korion-adv-azure-watcher-preview.jpg")
  },
  {
    id: "violet-sentinel",
    grade: "RAR",
    name: "Violet Sentinel",
    edition: "#000008 / 500",
    frontSrc: asset("assets/nft-card/cards/front/korion-rar-violet-sentinel.png"),
    previewSrc: asset("assets/nft-card/cards/preview/korion-rar-violet-sentinel-preview.jpg")
  },
  {
    id: "crimson-guardian",
    grade: "HER",
    name: "Crimson Guardian",
    edition: "#000003 / 150",
    frontSrc: asset("assets/nft-card/cards/front/korion-her-crimson-guardian.png"),
    previewSrc: asset("assets/nft-card/cards/preview/korion-her-crimson-guardian-preview.jpg")
  },
  {
    id: "golden-sovereign",
    grade: "LEG",
    name: "Golden Sovereign",
    edition: "#000001 / 50",
    frontSrc: asset("assets/nft-card/cards/front/korion-leg-golden-sovereign.png"),
    previewSrc: asset("assets/nft-card/cards/preview/korion-leg-golden-sovereign-preview.jpg")
  },
  {
    id: "genesis-aura",
    grade: "MYT",
    name: "Genesis Aura",
    edition: "#000001 / 10",
    frontSrc: asset("assets/nft-card/cards/front/korion-rar-demo.webp"),
    previewSrc: asset("assets/nft-card/cards/preview/korion-rar-demo-preview.jpg")
  }
];
