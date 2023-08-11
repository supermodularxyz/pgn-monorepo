import "./styles.css";
import { createContext, memo, useContext, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

export * as chains from "./config/chain";
export * as tokens from "./config/tokens";
import * as networks from "./config/networks";
export * as networks from "./config/networks";

export * from "./components/AccountButton";
export * from "./components/BridgeTokens";
export * from "./components/DeployERC20";
export * from "./components/Transactions";
export * from "./providers/Wagmi";
export * from "./hooks/switchNetwork";

import { PGNConfig, Token } from "./types";
import { merge } from "./utils/merge";
import { WagmiProvider } from "./providers/Wagmi";
import { theme } from "./theme";

import * as Sentry from "@sentry/react";

Sentry.init({
  environment: process.env.NEXT_PUBLIC_SENRTY_ENVIRONMENT,
  dsn: "https://6963513d4f086ed223d419d151eb653b@o4505635739598848.ingest.sentry.io/4505635765944320",
  integrations: [
    new Sentry.BrowserTracing({
      // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: [
        "localhost",
        "^https://.*.g.alchemy.com",
        "^https://.*.publicgoods.network",
      ],
    }),
  ],
});

const defaultConfig = {
  tokens: [],
  theme: theme,
  networks: {
    l1: networks.supportedChains.sepolia,
    l2: networks.supportedChains.pgnTestnet,
  },
};
const Context = createContext<PGNConfig>(defaultConfig);

export const usePGN = () => useContext(Context);

type BridgeProps = { config: PGNConfig } & React.PropsWithChildren;

export const BridgeProvider = memo(({ config, children }: BridgeProps) => {
  const state = mergeConfig(config);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  return (
    <WagmiProvider pgnConfig={state}>
      <Toaster position="bottom-center" />
      <Context.Provider value={state}>{children}</Context.Provider>
    </WagmiProvider>
  );
});

function mergeConfig(config: PGNConfig) {
  let merged = merge(config, defaultConfig) as PGNConfig;
  const { networks } = merged;
  const tokens = merged.tokens.filter(
    (token: Token) =>
      token.tokens[networks.l1.network] && token.tokens[networks.l2.network]
  );
  return { ...merged, tokens };
}
