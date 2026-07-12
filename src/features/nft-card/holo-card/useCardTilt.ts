import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import type { TiltState } from "./types";

const maxRotation = 10;
const settle = 0.16;

const neutralTilt: TiltState = {
  pointerX: 0.5,
  pointerY: 0.5,
  fromCenter: 0,
  fromLeft: 0.5,
  fromTop: 0.5,
  rotateX: 0,
  rotateY: 0,
  backgroundX: 50,
  backgroundY: 50,
  opacity: 0,
  scale: 1,
  glareOpacity: 0
};

type UseCardTiltOptions = {
  disabled?: boolean;
  interactive?: boolean;
  autoDemo?: boolean;
};

export function useCardTilt({ disabled, interactive = true, autoDemo }: UseCardTiltOptions) {
  const nodeRef = useRef<HTMLButtonElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const targetRef = useRef<TiltState>(neutralTilt);
  const currentRef = useRef<TiltState>(neutralTilt);
  const leaveTimerRef = useRef<number | null>(null);
  const [active, setActive] = useState(false);
  const [style, setStyle] = useState<CSSProperties>(toCssVars(neutralTilt));

  const writeNextFrame = useCallback(() => {
    frameRef.current = null;
    const current = currentRef.current;
    const target = targetRef.current;
    const next = lerpTilt(current, target, settle);
    currentRef.current = next;
    setStyle(toCssVars(next));

    if (!isClose(next, target)) {
      frameRef.current = window.requestAnimationFrame(writeNextFrame);
    }
  }, []);

  const schedule = useCallback((next: TiltState) => {
    targetRef.current = next;
    if (frameRef.current === null) {
      frameRef.current = window.requestAnimationFrame(writeNextFrame);
    }
  }, [writeNextFrame]);

  const reset = useCallback(() => {
    setActive(false);
    schedule(neutralTilt);
  }, [schedule]);

  const updateFromPoint = useCallback((clientX: number, clientY: number, pointerActive = true) => {
    const node = nodeRef.current;
    if (!node || disabled || !interactive) return;
    const rect = node.getBoundingClientRect();
    const x = clamp((clientX - rect.left) / rect.width, 0, 1);
    const y = clamp((clientY - rect.top) / rect.height, 0, 1);
    if (leaveTimerRef.current) window.clearTimeout(leaveTimerRef.current);
    setActive(pointerActive);
    schedule(pointToTilt(x, y, pointerActive));
  }, [disabled, interactive, schedule]);

  const onPointerMove = useCallback((event: ReactPointerEvent<HTMLButtonElement>) => {
    updateFromPoint(event.clientX, event.clientY);
  }, [updateFromPoint]);

  const onPointerDown = useCallback((event: ReactPointerEvent<HTMLButtonElement>) => {
    event.currentTarget.setPointerCapture?.(event.pointerId);
    updateFromPoint(event.clientX, event.clientY);
  }, [updateFromPoint]);

  const onPointerLeave = useCallback(() => {
    if (leaveTimerRef.current) window.clearTimeout(leaveTimerRef.current);
    leaveTimerRef.current = window.setTimeout(reset, 80);
  }, [reset]);

  useEffect(() => {
    if (!autoDemo || active || disabled) return;
    let raf = 0;
    const start = performance.now();
    const tick = (time: number) => {
      const t = (time - start) / 1200;
      const x = 0.5 + Math.sin(t) * 0.26;
      const y = 0.5 + Math.cos(t * 0.82) * 0.2;
      schedule(pointToTilt(x, y, false));
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [active, autoDemo, disabled, schedule]);

  useEffect(() => {
    if (disabled || !interactive) reset();
  }, [disabled, interactive, reset]);

  useEffect(() => () => {
    if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    if (leaveTimerRef.current !== null) window.clearTimeout(leaveTimerRef.current);
  }, []);

  const pointerHandlers = useMemo(() => ({
    onPointerDown,
    onPointerMove,
    onPointerLeave,
    onPointerCancel: onPointerLeave
  }), [onPointerDown, onPointerLeave, onPointerMove]);

  return {
    active,
    cardRef: nodeRef,
    tiltStyle: style,
    pointerHandlers
  };
}

function pointToTilt(x: number, y: number, active: boolean): TiltState {
  const dx = x - 0.5;
  const dy = y - 0.5;
  const fromCenter = clamp(Math.hypot(dx, dy) * 2, 0, 1);
  return {
    pointerX: x,
    pointerY: y,
    fromCenter,
    fromLeft: x,
    fromTop: y,
    rotateX: clamp((0.5 - y) * 20, -maxRotation, maxRotation),
    rotateY: clamp((x - 0.5) * 20, -maxRotation, maxRotation),
    backgroundX: 40 + x * 20,
    backgroundY: 40 + y * 20,
    opacity: active ? 1 : 0.72,
    scale: active ? 1.018 : 1.01,
    glareOpacity: active ? Math.min(0.68, 0.16 + fromCenter * 0.52) : 0.22
  };
}

function toCssVars(state: TiltState): CSSProperties {
  return {
    "--pointer-x": `${state.pointerX * 100}%`,
    "--pointer-y": `${state.pointerY * 100}%`,
    "--pointer-from-center": state.fromCenter,
    "--pointer-from-left": state.fromLeft,
    "--pointer-from-top": state.fromTop,
    "--rotate-x": `${state.rotateX}deg`,
    "--rotate-y": `${state.rotateY}deg`,
    "--background-x": `${state.backgroundX}%`,
    "--background-y": `${state.backgroundY}%`,
    "--card-opacity": state.opacity,
    "--card-scale": state.scale,
    "--glare-opacity": state.glareOpacity
  } as CSSProperties;
}

function lerpTilt(from: TiltState, to: TiltState, amount: number): TiltState {
  return {
    pointerX: lerp(from.pointerX, to.pointerX, amount),
    pointerY: lerp(from.pointerY, to.pointerY, amount),
    fromCenter: lerp(from.fromCenter, to.fromCenter, amount),
    fromLeft: lerp(from.fromLeft, to.fromLeft, amount),
    fromTop: lerp(from.fromTop, to.fromTop, amount),
    rotateX: lerp(from.rotateX, to.rotateX, amount),
    rotateY: lerp(from.rotateY, to.rotateY, amount),
    backgroundX: lerp(from.backgroundX, to.backgroundX, amount),
    backgroundY: lerp(from.backgroundY, to.backgroundY, amount),
    opacity: lerp(from.opacity, to.opacity, amount),
    scale: lerp(from.scale, to.scale, amount),
    glareOpacity: lerp(from.glareOpacity, to.glareOpacity, amount)
  };
}

function isClose(from: TiltState, to: TiltState) {
  return Math.abs(from.rotateX - to.rotateX) < 0.02
    && Math.abs(from.rotateY - to.rotateY) < 0.02
    && Math.abs(from.pointerX - to.pointerX) < 0.002
    && Math.abs(from.pointerY - to.pointerY) < 0.002
    && Math.abs(from.opacity - to.opacity) < 0.002;
}

function lerp(from: number, to: number, amount: number) {
  return from + (to - from) * amount;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
