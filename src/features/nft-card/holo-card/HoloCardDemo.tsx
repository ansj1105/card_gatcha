import { useEffect, useRef, useState } from "react";
import type { CSSProperties, MouseEvent } from "react";
import { gsap } from "gsap";
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

const hasOpenEffect = (card: (typeof demoCards)[number]) => !["COM", "MID"].includes(card.grade);
const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

const previewBackSrc = asset("assets/nft-card/cards/preview/korion-card-back-preview.jpg");
const fullBackSrc = asset("assets/nft-card/cards/back/korion-card-back.webp");
const foilMaskSrc = asset("assets/nft-card/masks/korion-foil-mask.png");
const frameMaskSrc = asset("assets/nft-card/masks/korion-frame-mask.png");
const artMaskSrc = asset("assets/nft-card/masks/korion-art-mask.png");
const revealTransitionSeconds = 1.72;

type RevealStart = {
  x: number;
  y: number;
  rotate: number;
  scale: number;
};

type OutgoingReveal = {
  cardId: string;
  start: RevealStart;
  current: RevealStart;
  mode: "zoom" | "flipZoom";
  closing: boolean;
};

export function HoloCardDemo() {
  const [cardId, setCardId] = useState("genesis-aura");
  const [openedCardIds, setOpenedCardIds] = useState<Set<string>>(() => new Set());
  const [openingCardIds, setOpeningCardIds] = useState<Set<string>>(() => new Set());
  const [focusedCardId, setFocusedCardId] = useState<string | null>(null);
  const [focusedVisible, setFocusedVisible] = useState(false);
  const [focusedClosing, setFocusedClosing] = useState(false);
  const [focusedSettled, setFocusedSettled] = useState(false);
  const [revealStart, setRevealStart] = useState<RevealStart>({ x: 0, y: 0, rotate: 0, scale: 0.28 });
  const [revealMode, setRevealMode] = useState<"zoom" | "flipZoom">("zoom");
  const [outgoingReveal, setOutgoingReveal] = useState<OutgoingReveal | null>(null);
  const [interactive, setInteractive] = useState(true);
  const [autoDemo, setAutoDemo] = useState(false);
  const [quality, setQuality] = useState<HoloQuality>("high");
  const [effect, setEffect] = useState<HoloEffect>("premium");
  const openTimelinesRef = useRef<Map<string, ReturnType<typeof gsap.timeline>>>(new Map());
  const revealSettledCallRef = useRef<ReturnType<typeof gsap.delayedCall> | null>(null);
  const revealCloseCallRef = useRef<ReturnType<typeof gsap.delayedCall> | null>(null);
  const outgoingClearCallRef = useRef<ReturnType<typeof gsap.delayedCall> | null>(null);
  const incomingStartFrameRef = useRef<number | null>(null);
  const selectedCard = demoCards.find((card) => card.id === (focusedCardId ?? cardId)) ?? demoCards[0];
  const preset = holoPresets[selectedCard.grade];

  const getRevealCardWidth = () => {
    const viewportWidth = window.innerWidth;
    const maxWidth = window.matchMedia("(max-width: 820px)").matches ? 340 : 430;
    return Math.min(viewportWidth * 0.78, maxWidth);
  };

  useEffect(() => () => {
    openTimelinesRef.current.forEach((timeline) => timeline.kill());
    revealSettledCallRef.current?.kill();
    revealCloseCallRef.current?.kill();
    outgoingClearCallRef.current?.kill();
    if (incomingStartFrameRef.current !== null) window.cancelAnimationFrame(incomingStartFrameRef.current);
  }, []);

  const runOpenTimeline = (card: (typeof demoCards)[number]) => {
    openTimelinesRef.current.get(card.id)?.kill();
    setOpeningCardIds((current) => {
      const next = new Set(current);
      next.add(card.id);
      return next;
    });

    const openingDuration = card.grade === "MYT" ? 1.12 : 0.98;
    const timeline = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => openTimelinesRef.current.delete(card.id)
    });

    timeline.call(() => {
      setOpeningCardIds((current) => {
        const next = new Set(current);
        next.delete(card.id);
        return next;
      });
    }, [], openingDuration);

    openTimelinesRef.current.set(card.id, timeline);
  };

  const revealCardFromRect = (id: string, rect: DOMRect, forcedMode?: "zoom" | "flipZoom") => {
    setCardId(id);
    const index = demoCards.findIndex((card) => card.id === id);
    const slotRotate = (index - 3) * 1.8;
    const revealWidth = getRevealCardWidth();
    revealCloseCallRef.current?.kill();
    setRevealStart({
      x: rect.left + rect.width / 2 - window.innerWidth / 2,
      y: rect.top + rect.height / 2 - window.innerHeight / 2,
      rotate: slotRotate,
      scale: Math.max(0.18, Math.min(0.5, rect.width / revealWidth))
    });
    setRevealMode(forcedMode ?? (Math.random() < 0.48 ? "flipZoom" : "zoom"));
    setFocusedClosing(false);
    setFocusedSettled(false);
    setFocusedVisible(false);
    setFocusedCardId(id);
    revealSettledCallRef.current?.kill();
    window.requestAnimationFrame(() => setFocusedVisible(true));
    revealSettledCallRef.current = gsap.delayedCall(revealTransitionSeconds, () => setFocusedSettled(true));
  };

  const getCurrentRevealFrame = (): RevealStart => {
    const wrap = document.querySelector<HTMLElement>(".card-reveal-overlay:not(.is-outgoing) .reveal-card-wrap");
    if (!wrap) return { x: 0, y: 0, rotate: 0, scale: 1 };

    const rect = wrap.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2 - window.innerWidth / 2,
      y: rect.top + rect.height / 2 - window.innerHeight / 2,
      rotate: 0,
      scale: Math.max(0.18, Math.min(1.05, rect.width / getRevealCardWidth()))
    };
  };

  const startOutgoingReveal = () => {
    if (!focusedCardId) return;
    outgoingClearCallRef.current?.kill();
    setOutgoingReveal({
      cardId: focusedCardId,
      start: revealStart,
      current: getCurrentRevealFrame(),
      mode: revealMode,
      closing: false
    });
    window.requestAnimationFrame(() => {
      setOutgoingReveal((current) => current ? { ...current, closing: true } : current);
    });
    outgoingClearCallRef.current = gsap.delayedCall(revealTransitionSeconds, () => setOutgoingReveal(null));
  };

  const closeFocusedCard = (afterClose?: () => void) => {
    setFocusedClosing(true);
    setFocusedSettled(false);
    setFocusedVisible(false);
    revealSettledCallRef.current?.kill();
    revealCloseCallRef.current?.kill();
    revealCloseCallRef.current = gsap.delayedCall(revealTransitionSeconds, () => {
      setFocusedCardId(null);
      setFocusedClosing(false);
      setFocusedSettled(false);
      afterClose?.();
    });
  };

  const handleSmallCardClick = (id: string, event: MouseEvent<HTMLButtonElement>) => {
    setCardId(id);
    const card = demoCards.find((item) => item.id === id);
    const rect = event.currentTarget.getBoundingClientRect();

    if (focusedCardId && focusedCardId !== id) {
      if (!openedCardIds.has(id)) {
        startOutgoingReveal();
        setFocusedCardId(null);
        setFocusedVisible(false);
        setFocusedClosing(false);
        setFocusedSettled(false);
        if (card && hasOpenEffect(card)) {
          runOpenTimeline(card);
        }
        setOpenedCardIds((current) => {
          const next = new Set(current);
          next.add(id);
          return next;
        });
        return;
      }

      startOutgoingReveal();
      setFocusedCardId(null);
      setFocusedVisible(false);
      setFocusedClosing(false);
      setFocusedSettled(false);
      if (incomingStartFrameRef.current !== null) window.cancelAnimationFrame(incomingStartFrameRef.current);
      incomingStartFrameRef.current = window.requestAnimationFrame(() => {
        incomingStartFrameRef.current = null;
        revealCardFromRect(id, rect, "flipZoom");
      });
      return;
    }

    if (!openedCardIds.has(id)) {
      if (card && hasOpenEffect(card)) {
        runOpenTimeline(card);
      }
      setOpenedCardIds((current) => {
        const next = new Set(current);
        next.add(id);
        return next;
      });
      return;
    }

    if (outgoingReveal || focusedClosing) {
      setFocusedClosing(false);
      setFocusedSettled(false);
      setFocusedCardId(null);
      setFocusedVisible(false);
    }

    revealCardFromRect(id, rect);
  };

  const closeCard = () => {
    closeFocusedCard();
  };

  const toggleFocusedCard = () => {
    if (focusedClosing) {
      revealCloseCallRef.current?.kill();
      revealSettledCallRef.current?.kill();
      setFocusedClosing(false);
      setFocusedVisible(true);
      setFocusedSettled(false);
      revealSettledCallRef.current = gsap.delayedCall(revealTransitionSeconds, () => setFocusedSettled(true));
      return;
    }

    closeFocusedCard();
  };

  const resetCards = () => {
    openTimelinesRef.current.forEach((timeline) => timeline.kill());
    openTimelinesRef.current.clear();
    if (incomingStartFrameRef.current !== null) {
      window.cancelAnimationFrame(incomingStartFrameRef.current);
      incomingStartFrameRef.current = null;
    }
    setOpenedCardIds(new Set());
    setOpeningCardIds(new Set());
    setOutgoingReveal(null);
    setFocusedVisible(false);
    setFocusedCardId(null);
    setFocusedClosing(false);
    setFocusedSettled(false);
  };

  const openAllCards = () => {
    demoCards.forEach((card) => {
      if (!openedCardIds.has(card.id) && hasOpenEffect(card)) {
        runOpenTimeline(card);
      }
    });
    setOpenedCardIds(new Set(demoCards.map((card) => card.id)));
  };

  return (
    <section className="holo-demo holo-showcase" aria-label="KORION holo card showcase">
      <div className="sealed-card-grid" aria-label="Sealed KORION cards">
        {demoCards.map((card, index) => (
          <div
            key={card.id}
            className={[
              "sealed-card-slot",
              openedCardIds.has(card.id) ? "is-opened" : "",
              openingCardIds.has(card.id) ? "is-opening" : "",
              focusedCardId === card.id || outgoingReveal?.cardId === card.id ? "is-focusing" : ""
            ].filter(Boolean).join(" ")}
            style={{ "--slot-index": index, "--slot-offset": Math.abs(index - 3) } as CSSProperties}
          >
            <HoloCard
              frontSrc={card.previewSrc}
              backSrc={previewBackSrc}
              grade={card.grade}
              alt={`Open ${card.grade} KORION card`}
              interactive={interactive}
              autoDemo={false}
              flipped={!openedCardIds.has(card.id)}
              quality="low"
              effect={openedCardIds.has(card.id) ? effect : "premium"}
              foilMaskSrc={foilMaskSrc}
              frameMaskSrc={frameMaskSrc}
              artMaskSrc={artMaskSrc}
              onClick={(event) => handleSmallCardClick(card.id, event)}
            />
            {openedCardIds.has(card.id) && (
              <span className={`card-name-label grade-${card.grade.toLowerCase()}`}>{card.name}</span>
            )}
          </div>
        ))}
      </div>

      <div className="showcase-controls">
        <div className="card-state-actions">
          <button type="button" className="cards-open-button" onClick={openAllCards}>
            All Cards Open
          </button>
          <button type="button" className="cards-off-button" onClick={resetCards}>
            All Cards Off
          </button>
        </div>

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
          <button type="button" onClick={() => setQuality((value) => (value === "high" ? "low" : "high"))}>
            Quality {quality}
          </button>
        </div>
      </div>

      {outgoingReveal && (() => {
        const outgoingCard = demoCards.find((card) => card.id === outgoingReveal.cardId);
        if (!outgoingCard) return null;

        return (
          <div
            key={`outgoing-${outgoingReveal.cardId}`}
            className={[
              "card-reveal-overlay",
              "is-revealed",
              outgoingReveal.closing ? "is-closing" : "",
              "is-outgoing",
              `reveal-mode-${outgoingReveal.mode}`
            ].filter(Boolean).join(" ")}
            aria-hidden="true"
          >
            <div
              className="reveal-card-panel"
              style={{
                "--reveal-start-x": `${outgoingReveal.start.x}px`,
                "--reveal-start-y": `${outgoingReveal.start.y}px`,
                "--reveal-start-rotate": `${outgoingReveal.start.rotate}deg`,
                "--reveal-start-scale": outgoingReveal.start.scale,
                "--reveal-current-x": `${outgoingReveal.current.x}px`,
                "--reveal-current-y": `${outgoingReveal.current.y}px`,
                "--reveal-current-rotate": `${outgoingReveal.current.rotate}deg`,
                "--reveal-current-scale": outgoingReveal.current.scale
              } as CSSProperties}
            >
              <div className="reveal-card-wrap">
                <HoloCard
                  frontSrc={outgoingCard.frontSrc}
                  backSrc={fullBackSrc}
                  foilMaskSrc={foilMaskSrc}
                  frameMaskSrc={frameMaskSrc}
                  artMaskSrc={artMaskSrc}
                  grade={outgoingCard.grade}
                  alt={`KORION ${outgoingCard.grade} ${outgoingCard.name} holographic card`}
                  interactive={false}
                  autoDemo={false}
                  flipped={false}
                  quality={quality}
                  effect={effect}
                />
              </div>
            </div>
          </div>
        );
      })()}

      {focusedCardId && (
        <div
          key={`focused-${focusedCardId}`}
          className={[
            "card-reveal-overlay",
            focusedVisible ? "is-revealed" : "",
            focusedClosing ? "is-closing" : "",
            focusedSettled ? "is-settled" : "",
            `reveal-mode-${revealMode}`
          ].filter(Boolean).join(" ")}
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedCard.name} reveal`}
        >
          <button className="reveal-backdrop" type="button" aria-label="Close card" onClick={closeCard} />
          <div
            className="reveal-card-panel"
            style={{
              "--reveal-start-x": `${revealStart.x}px`,
              "--reveal-start-y": `${revealStart.y}px`,
              "--reveal-start-rotate": `${revealStart.rotate}deg`,
              "--reveal-start-scale": revealStart.scale
            } as CSSProperties}
          >
            <div className="reveal-card-wrap">
              <HoloCard
                frontSrc={selectedCard.frontSrc}
                backSrc={fullBackSrc}
                foilMaskSrc={foilMaskSrc}
                frameMaskSrc={frameMaskSrc}
                artMaskSrc={artMaskSrc}
                grade={selectedCard.grade}
                alt={`KORION ${selectedCard.grade} ${selectedCard.name} holographic card`}
                interactive={interactive}
                autoDemo={autoDemo || !interactive}
                flipped={false}
                quality={quality}
                effect={effect}
                onClick={toggleFocusedCard}
              />
            </div>
            <div className="reveal-copy">
              <span>{selectedCard.grade}</span>
              <h2>{selectedCard.name}</h2>
              <p>{selectedCard.edition}</p>
              <output>{preset.label} / {effect} / intensity {preset.intensity.toFixed(2)} / {quality}</output>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
