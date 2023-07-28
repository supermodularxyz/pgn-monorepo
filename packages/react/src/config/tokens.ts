import { Token } from "../types";

export const ETH = {
  name: "ETH",
  symbol: "ETH",
  decimals: 18,
  description: "",
  website: "",
  twitter: "",
  tokens: {
    ethereum: { address: "" },
    homestead: { address: "" },
    sepolia: { address: "" },
    pgn: { address: "" },
    pgnTestnet: { address: "" },
  },
};

export const DAI = {
  name: "DAI",
  symbol: "DAI",
  tokens: {
    mainnet: {
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    pgnTestnet: {
      address: "",
    },
    pgn: {
      address: "",
    },
  },
};

export const GTC = {
  name: "GTC",
  symbol: "GTC",
  tokens: {
    mainnet: {
      address: "0xde30da39c46104798bb5aa3fe8b9e0e1f348163f",
    },
    homestead: {
      address: "0xde30da39c46104798bb5aa3fe8b9e0e1f348163f",
    },
    pgnTestnet: {
      address: "",
    },
    pgn: {
      address: "0x7c6b91D9Be155A6Db01f749217d76fF02A7227F2",
    },
  },
};

export const USDC = {
  name: "USDC",
  symbol: "USDC",
  tokens: {
    mainnet: {
      address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    },
    pgnTestnet: {
      address: "",
    },
    pgn: {
      address: "",
    },
  },
};

export const USDT = {
  name: "USDT",
  symbol: "USDT",
  tokens: {
    mainnet: {
      address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    },
    pgnTestnet: {
      address: "",
    },
    pgn: {
      address: "",
    },
  },
};
