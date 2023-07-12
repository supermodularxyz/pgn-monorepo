import "../styles/globals.css";
import "@pgn/react/styles.css";

import { type AppType } from "next/dist/shared/lib/utils";

import { BridgeProvider, chains, tokens } from "@pgn/react";

import { mainnet, sepolia } from "wagmi/chains";

const gitcoinTheme = {
  card: {
    padding: 24,
    minWidth: 500,
    borderRadius: 32,
    background: "#ece7d5",
  },
  buttons: {
    base: {
      fontSize: 16,
      fontFamily: "monospace",
      borderRadius: 12,
      padding: "12px 8px",
      background: "#fff",
    },
    primary: {
      color: "#fff",
      background: "#15322b",
    },
    secondary: {
      background: "transparent",
      boxShadow: "inset 0 0 0 2px #2c3330",
    },
    max: {
      borderRadius: 12,
      background: "rgb(251, 247, 243)",
    },
    swap: {
      color: "#fff",
      background: "#15322b",
    },
  },
  input: {
    fontFamily: "monospace",
    borderRadius: 4,
    fontSize: 16,
    background: "#fff",
    color: "#000",
  },

  label: {
    fontFamily: "monospace",
    fontSize: 12,
    color: "#000",
  },
};

const config = {
  // thene: {},
  // theme: gitcoinTheme,
  // Tokens to be shown in the UI
  tokens: [tokens.ETH, tokens.TestToken],
  // Configs with RPC url and chain IDs
  networks: {
    l1: sepolia,
    l2: chains.pgnTestnet,
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
