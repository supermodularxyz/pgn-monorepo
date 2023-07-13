// import { WagmiConfig, createClient, configureChains } from "wagmi";

// import {
//   connectorsForWallets,
//   getDefaultWallets,
//   RainbowKitProvider,
// } from "@rainbow-me/rainbowkit";
// import {
//   argentWallet,
//   trustWallet,
//   ledgerWallet,
// } from "@rainbow-me/rainbowkit/wallets";
// import { Chain, mainnet, sepolia } from "wagmi/chains";
// import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

// import * as React from "react";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { pgnTestnet } from "../config/chain";
// import { supportedChains } from "../config/networks";

// const projectId = "PGN";

// const alchemyKey = "vNYrS5PAIxpq4DdicH9A1Hr-4VAbHRjz";
// const infuraKey = "6e1792d6de8e49c497a05083e488691a";

// const networks = Object.values(supportedChains);

// const { chains, provider } = configureChains(networks, [
// jsonRpcProvider({
//   rpc: (chain) => {
//     const providers = networks.reduce(
//       (acc, x) => ({ ...acc, [x.network]: x }),
//       {} as { [chain: string]: Chain }
//     );

//     const current = chain.network as keyof typeof providers;
//     const { rpcUrls } = providers[current];

//     const http = rpcUrls.alchemy
//       ? `${rpcUrls.alchemy.http[0]}/${alchemyKey}`
//       : rpcUrls.public.http[0];

//     return { http };
//   },
// }),
// ]);

// const { wallets } = getDefaultWallets({
//   appName: projectId,
//   projectId,
//   chains,
// });

// const connectors = connectorsForWallets([
//   ...wallets,
//   {
//     groupName: "Other",
//     wallets: [
//       argentWallet({ projectId, chains }),
//       trustWallet({ projectId, chains }),
//       ledgerWallet({ projectId, chains }),
//     ],
//   },
// ]);

// const wagmiClient = createClient({
//   autoConnect: true,
//   connectors,
//   provider,
// });

import { WagmiConfig, configureChains, createConfig, mainnet } from "wagmi";
import { createPublicClient, http } from "viem";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, getDefaultWallets } from "@rainbow-me/rainbowkit";
import { supportedChains } from "../config/networks";
import { publicProvider } from "wagmi/providers/public";

const networks = Object.values(supportedChains);
const { chains, publicClient } = configureChains(networks, [publicProvider()]);

const { connectors } = getDefaultWallets({
  appName: "PGN Bridge",
  projectId: "PGN",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: process.env.NODE_ENV === "production" },
  },
});

export const WagmiProvider = ({ children }: React.PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
};
