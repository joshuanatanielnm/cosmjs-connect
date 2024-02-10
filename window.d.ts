import { Cosmos } from "@cosmos-kit/cosmostation-extension/cjs/extension/types";
import { Window as KeplrWindow } from "@keplr-wallet/types";

declare global {
  interface Window {
    keplr: Window["keplr"];
  }
}
