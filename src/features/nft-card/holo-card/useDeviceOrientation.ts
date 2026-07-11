import { useCallback, useEffect, useMemo, useState } from "react";

type PermissionState = "unsupported" | "prompt" | "granted" | "denied";

type DeviceOrientationWithPermission = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<PermissionState>;
};

export function useDeviceOrientation(enabled: boolean) {
  const [permission, setPermission] = useState<PermissionState>(() => {
    if (typeof window === "undefined" || !("DeviceOrientationEvent" in window)) return "unsupported";
    const eventType = DeviceOrientationEvent as DeviceOrientationWithPermission;
    return typeof eventType.requestPermission === "function" ? "prompt" : "granted";
  });
  const [tilt, setTilt] = useState<{ rotateX: number; rotateY: number; pointerX: number; pointerY: number } | null>(null);

  const requestPermission = useCallback(async () => {
    if (typeof window === "undefined" || !("DeviceOrientationEvent" in window)) {
      setPermission("unsupported");
      return "unsupported" as const;
    }

    const eventType = DeviceOrientationEvent as DeviceOrientationWithPermission;
    if (typeof eventType.requestPermission !== "function") {
      setPermission("granted");
      return "granted" as const;
    }

    try {
      const result = await eventType.requestPermission();
      setPermission(result === "granted" ? "granted" : "denied");
      return result === "granted" ? "granted" as const : "denied" as const;
    } catch {
      setPermission("denied");
      return "denied" as const;
    }
  }, []);

  useEffect(() => {
    if (!enabled || permission !== "granted") {
      setTilt(null);
      return;
    }

    const onOrientation = (event: DeviceOrientationEvent) => {
      const gamma = clamp(event.gamma ?? 0, -28, 28);
      const beta = clamp(event.beta ?? 0, -28, 28);
      const rotateY = clamp(gamma / 2.8, -10, 10);
      const rotateX = clamp(-beta / 3.4, -10, 10);
      setTilt({
        rotateX,
        rotateY,
        pointerX: clamp(0.5 + rotateY / 20, 0, 1),
        pointerY: clamp(0.5 - rotateX / 20, 0, 1)
      });
    };

    window.addEventListener("deviceorientation", onOrientation, { passive: true });
    return () => window.removeEventListener("deviceorientation", onOrientation);
  }, [enabled, permission]);

  return useMemo(() => ({
    tilt,
    permission,
    requestPermission,
    supported: permission !== "unsupported"
  }), [permission, requestPermission, tilt]);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
