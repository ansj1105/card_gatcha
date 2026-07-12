import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.korion.wallet.holocard",
  appName: "KORION Wallet Holo Card",
  webDir: "dist",
  server: {
    androidScheme: "https"
  }
};

export default config;
