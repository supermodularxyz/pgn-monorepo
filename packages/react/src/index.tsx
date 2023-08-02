import "./styles.css";
import { createContext, memo, useContext, useEffect } from "react";
import { Toaster } from "react-hot-toast";

export * as chains from "./config/chain";
export * as tokens from "./config/tokens";
import * as networks from "./config/networks";
export * as networks from "./config/networks";

export * from "./components/AccountButton";
export * from "./components/BridgeTokens";
export * from "./components/Transactions";
export * from "./providers/Wagmi";
export * from "./hooks/switchNetwork";

import { PGNConfig, Token } from "./types";
import { merge } from "./utils/merge";
import { WagmiProvider } from "./providers/Wagmi";
import { theme } from "./theme";

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

  useEffect(() => {
    const {
      networks: { l1, l2 },
    } = state;
    const validTokens = state.tokens.every(
      (token: Token) => token.tokens[l1.network] && token.tokens[l2.network]
    );

    if (!validTokens) {
      throw new Error("Tokens must have addresses for both L1 and L2 networks");
    }
  }, [state]);

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
