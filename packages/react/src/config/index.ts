export const config = {
  conduit: {
    pgn: "pgn-mainnet-0",
    pgnTestnet: "pgn-sepolia-i4td3ji6i0",
  },
} as const;

export const getConduitSlug = (network: keyof typeof config.conduit) =>
  config.conduit[network];
