import { useState } from "react";
import type { CSSProperties } from "react";
import { demoCards } from "./cardCatalog";
import { HoloCard } from "./HoloCard";
import { holoPresets } from "./holoPresets";
import type { HoloEffect, HoloQuality } from "./types";

const effectOptions: { id: HoloEffect; label: string }[] = [
  { id: "premium", label: "Premium Real" },
  { id: "basic", label: "Basic" },
  { id: "reverseHolo", label: "Reverse Holo" },
  { id: "regularHolo", label: "Regular Holo" },
  { id: "exRegular", label: "EX Regular" },
  { id: "exFullArt", label: "EX Full Art" },
  { id: "illustrationRare", label: "Illustration" },
  { id: "pokeBall", label: "Poke Ball" },
  { id: "specialIllustration", label: "Special Art" },
  { id: "hyperRare", label: "Hyper Rare" },
  { id: "prism", label: "Prism" },
  { id: "galaxy", label: "Galaxy" },
  { id: "rainbow", label: "Rainbow" },
  { id: "shatter", label: "Shatter" }
];

export function HoloCardDemo() {
  const [cardId, setCardId] = useState("genesis-aura");
  const [openedCardIds, setOpenedCardIds] = useState<Set<string>>(() => new Set());
  const [focusedCardId, setFocusedCardId] = useState<string | null>(null);
  const [focusedVisible, setFocusedVisible] = useState(false);
  const [interactive, setInteractive] = useState(true);
  const [autoDemo, setAutoDemo] = useState(false);
  const [enableGyro, setEnableGyro] = useState(false);
  const [quality, setQuality] = useState<HoloQuality>("high");
  const [effect, setEffect] = useState<HoloEffect>("premium");
  const selectedCard = demoCards.find((card) => card.id === (focusedCardId ?? cardId)) ?? demoCards[0];
  const preset = holoPresets[selectedCard.grade];

  const handleSmallCardClick = (id: string) => {
    setCardId(id);
    if (!openedCardIds.has(id)) {
      setOpenedCardIds((current) => {
        const next = new Set(current);
        next.add(id);
        return next;
      });
      return;
    }

    setFocusedCardId(id);
    window.requestAnimationFrame(() => setFocusedVisible(true));
  };

  const closeCard = () => {
    setFocusedVisible(false);
    window.setTimeout(() => setFocusedCardId(null), 260);
  };

  const resetCards = () => {
    setOpenedCardIds(new Set());
    setFocusedVisible(false);
    setFocusedCardId(null);
  };

  return (
    <section className="holo-demo holo-showcase" aria-label="KORION holo card showcase">
      <div className="sealed-card-grid" aria-label="Sealed KORION cards">
        {demoCards.map((card, index) => (
          <div
            key={card.id}
            className={`sealed-card-slot ${openedCardIds.has(card.id) ? "is-opened" : ""}`}
            style={{ "--slot-index": index, "--slot-offset": Math.abs(index - 3) } as CSSProperties}
          >
            <HoloCard
              frontSrc={card.frontSrc}
              backSrc="/assets/nft-card/cards/back/korion-card-back.webp"
              grade={card.grade}
              alt={`Open ${card.grade} KORION card`}
              interactive
              autoDemo={false}
              flipped={!openedCardIds.has(card.id)}
              quality="low"
              effect={openedCardIds.has(card.id) ? effect : "premium"}
              foilMaskSrc="/assets/nft-card/masks/korion-foil-mask.png"
              frameMaskSrc="/assets/nft-card/masks/korion-frame-mask.png"
              artMaskSrc="/assets/nft-card/masks/korion-art-mask.png"
              onClick={() => handleSmallCardClick(card.id)}
            />
            <span>{card.grade}</span>
          </div>
        ))}
      </div>

      <div className="showcase-controls">
        <button type="button" className="cards-off-button" onClick={resetCards}>
          All Cards Off
        </button>

        <div className="holo-demo-effect-tabs" role="tablist" aria-label="Hologram effect">
          {effectOptions.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={effect === item.id}
              className={effect === item.id ? "is-selected" : ""}
              onClick={() => setEffect(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="holo-demo-switches">
          <button type="button" aria-pressed={interactive} onClick={() => setInteractive((value) => !value)}>
            Interaction {interactive ? "On" : "Off"}
          </button>
          <button type="button" aria-pressed={autoDemo} onClick={() => setAutoDemo((value) => !value)}>
            Auto {autoDemo ? "On" : "Off"}
          </button>
          <button type="button" aria-pressed={enableGyro} onClick={() => setEnableGyro((value) => !value)}>
            Gyro {enableGyro ? "On" : "Off"}
          </button>
          <button type="button" onClick={() => setQuality((value) => (value === "high" ? "low" : "high"))}>
            Quality {quality}
          </button>
        </div>
      </div>

      {focusedCardId && (
        <div className={`card-reveal-overlay ${focusedVisible ? "is-revealed" : ""}`} role="dialog" aria-modal="true" aria-label={`${selectedCard.name} reveal`}>
          <button className="reveal-backdrop" type="button" aria-label="Close card" onClick={closeCard} />
          <div className="reveal-card-panel">
            <div className="reveal-copy">
              <span>{selectedCard.grade}</span>
              <h2>{selectedCard.name}</h2>
              <p>{selectedCard.edition}</p>
              <output>{preset.label} / {effect} / intensity {preset.intensity.toFixed(2)} / {quality}</output>
            </div>
            <div className="reveal-card-wrap">
              <HoloCard
                frontSrc={selectedCard.frontSrc}
                backSrc="/assets/nft-card/cards/back/korion-card-back.webp"
                foilMaskSrc="/assets/nft-card/masks/korion-foil-mask.png"
                frameMaskSrc="/assets/nft-card/masks/korion-frame-mask.png"
                artMaskSrc="/assets/nft-card/masks/korion-art-mask.png"
                grade={selectedCard.grade}
                alt={`KORION ${selectedCard.grade} ${selectedCard.name} holographic card`}
                interactive={interactive}
                autoDemo={autoDemo || !interactive}
                enableGyro={enableGyro}
                flipped={false}
                quality={quality}
                effect={effect}
              />
            </div>
            <button className="reveal-close" type="button" onClick={closeCard}>Close</button>
          </div>
        </div>
      )}
    </section>
  );
}
