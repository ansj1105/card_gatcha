import type { CSSProperties, MouseEvent } from "react";
import { holoPresets } from "./holoPresets";
import type { HoloCardProps } from "./types";
import { useCardTilt } from "./useCardTilt";
import { useDeviceOrientation } from "./useDeviceOrientation";
import "./HoloCard.css";

export function HoloCard({
  frontSrc,
  backSrc,
  foilMaskSrc,
  frameMaskSrc,
  artMaskSrc,
  grade,
  alt,
  interactive = true,
  autoDemo = false,
  enableGyro = false,
  flipped = false,
  disabled = false,
  onClick,
  quality = "high",
  effect = "prism"
}: HoloCardProps) {
  const preset = holoPresets[grade];
  const gyro = useDeviceOrientation(Boolean(enableGyro && interactive && !disabled));
  const { active, cardRef, tiltStyle, pointerHandlers } = useCardTilt({
    disabled,
    interactive,
    autoDemo,
    gyroTilt: gyro.tilt
  });

  const handleClick = async (event: MouseEvent<HTMLButtonElement>) => {
    if (enableGyro && gyro.permission === "prompt") {
      await gyro.requestPermission();
    }
    onClick?.(event);
  };

  const style = {
    ...tiltStyle,
    "--holo-intensity": preset.intensity,
    "--holo-spectrum": preset.spectrum,
    "--holo-foil": preset.foil,
    "--holo-accent": preset.accent,
    "--holo-edge": preset.edge,
    "--holo-speed": preset.speed,
    "--foil-mask": foilMaskSrc ? `url("${foilMaskSrc}")` : "none",
    "--frame-mask": frameMaskSrc ? `url("${frameMaskSrc}")` : "none",
    "--art-mask": artMaskSrc ? `url("${artMaskSrc}")` : "none"
  } as CSSProperties;

  return (
    <button
      ref={cardRef}
      type="button"
      className={[
        "holo-card",
        "card-shell",
        preset.className,
        active ? "is-active" : "",
        flipped ? "is-flipped" : "",
        disabled ? "is-disabled" : "",
        `holo-effect-${effect}`,
        quality === "low" ? "is-low-quality" : "is-high-quality"
      ].filter(Boolean).join(" ")}
      style={style}
      aria-label={alt}
      disabled={disabled}
      onClick={handleClick}
      {...pointerHandlers}
    >
      <span className="card-translator">
        <span className="card-rotator">
          <span className="card-face card-back" aria-hidden={!flipped}>
            {backSrc ? <img className="base-card-image" src={backSrc} alt="" draggable={false} /> : <span className="holo-card-back-mark">K</span>}
          </span>

          <span className="card-face card-front" aria-hidden={flipped}>
            <img className="base-card-image" src={frontSrc} alt="" draggable={false} />
            <span className="art-foil-layer" />
            <span className="frame-foil-layer" />
            <span className="spectrum-layer" />
            <span className="glitter-layer" />
            <span className="glare-layer" />
            <span className="grain-layer" />
            <span className="edge-light-layer" />
          </span>
        </span>
      </span>
    </button>
  );
}
