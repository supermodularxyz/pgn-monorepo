import "../styles/globals.css";
import "@pgn/react/styles.css";

import { type AppType } from "next/dist/shared/lib/utils";

import { BridgeProvider, tokens, networks } from "@pgn/react";

const { mainnet, sepolia, pgn, pgnTestnet } = networks.supportedChains;

const config = {
  // Tokens to be shown in the UI
  tokens: [tokens.ETH, tokens.TestToken],
  // Configs with RPC url and chain IDs
  networks: {
    l1: sepolia,
    l2: pgnTestnet,
  },
};

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <BridgeProvider config={config}>
      <Component {...pageProps} />
    </BridgeProvider>
  );
};

export default MyApp;
