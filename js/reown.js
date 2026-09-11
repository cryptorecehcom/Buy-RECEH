import { createAppKit } from "@reown/appkit";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { defineChain } from "@reown/appkit/networks";

const projectId =
  import.meta.env.VITE_REOWN_PROJECT_ID || "f75e0c5fbfa5a4349b83c28145f6d7dd";

const bsc = defineChain({
  id: 56,
  caipNetworkId: "eip155:56",
  chainNamespace: "eip155",
  name: "BNB Smart Chain",
  nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
  rpcUrls: { default: { http: ["https://bsc-dataseed1.binance.org/"] } },
  blockExplorers: { default: { name: "BscScan", url: "https://bscscan.com" } },
});

const metadata = {
  name: "Buy RECEH With BNB",
  description: "Official RECEH Token Sale on BNB Smart Chain",
  url: "https://cryptoreceh.com/buy/",
  icons: [
    "https://raw.githubusercontent.com/recehdex/token-logo/refs/heads/main/RECEH.webp",
  ],
};

const appKit = createAppKit({
  adapters: [new EthersAdapter()],
  networks: [bsc],
  defaultNetwork: bsc,
  projectId,
  metadata,
  enableNetworkSwitch: true,
  enableReconnect: true,
  enableMobileFullScreen: true,
  features: { analytics: true, email: false, socials: [] },
});

function getProvider() {
  try {
    return (
      appKit.getWalletProvider?.() || appKit.getProviders?.()?.eip155 || null
    );
  } catch {
    return null;
  }
}

function getAddress() {
  try {
    return appKit.getAddress?.() || null;
  } catch {
    return null;
  }
}
function getChainId() {
  try {
    return appKit.getChainId?.() || null;
  } catch {
    return null;
  }
}
function sync() {
  const provider = getProvider();
  window.dispatchEvent(
    new CustomEvent("receh:appkit-wallet", {
      detail: { provider, address: getAddress(), chainId: getChainId() },
    }),
  );
  return provider;
}

try {
  appKit.subscribeProvider?.(sync);
} catch (e) {
  console.warn("RECEH AppKit provider subscription unavailable", e);
}
try {
  appKit.subscribeState?.(sync);
} catch (e) {
  console.warn("RECEH AppKit state subscription unavailable", e);
}

window.__RECEH_REOWN__ = {
  appKit,
  getProvider,
  getAddress,
  getChainId,
  open: () => appKit.open(),
  disconnect: () => appKit.disconnect?.(),
  sync,
};

queueMicrotask(sync);
