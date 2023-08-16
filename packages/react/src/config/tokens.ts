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

export const TestToken = {
  name: "TestToken",
  symbol: "TestToken",
  decimals: 18,
  description: "",
  website: "",
  twitter: "",
  tokens: {
    sepolia: {
      address: "0x10246FE5Bf3b06Fc688eD4AA1445FF52358CE3A9",
    },
    pgnTestnet: {
      address: "0x7c6b91D9Be155A6Db01f749217d76fF02A7227F2",
    },
  },
};

export const USDC = {
  name: "USD Coin",
  symbol: "USDC",
  decimals: 6,
  description: "",
  website: "",
  twitter: "",
  tokens: {
    homestead: {
      address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    },
    pgn: {
      address: "0x688f3674e2c2F1895917CDd01831AB463D291Ba9",
    },
  },
};
