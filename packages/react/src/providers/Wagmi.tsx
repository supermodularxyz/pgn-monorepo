import { useMemo } from "react";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { RainbowKitProvider, getDefaultWallets } from "@rainbow-me/rainbowkit";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

import { PGNConfig } from "../types";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: process.env.NODE_ENV === "production",
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

const persister = createSyncStoragePersister({
  storage: typeof window !== "undefined" ? window.localStorage : undefined,
});

const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY;

export const WagmiProvider = ({
  children,
  pgnConfig,
}: { pgnConfig: PGNConfig } & React.PropsWithChildren) => {
  const { config, chains } = useMemo(() => {
    const networks = Object.values(pgnConfig.networks);
    const { chains, publicClient } = configureChains(networks, [
      jsonRpcProvider({
        rpc: (chain) => {
          const { alchemy, default: _default } = chain.rpcUrls;
          const http = alchemy
            ? `${alchemy.http[0]}/${alchemyKey}`
            : _default.http[0];

          return { http };
        },
      }),
    ]);

    const { connectors } = getDefaultWallets({
      appName: "PGN Bridge",
      projectId: "4e43a05dd632c288318350b90b950400",
      chains,
    });

    const config = createConfig({
      autoConnect: true,
      connectors,
      publicClient,
    });
    return { config, chains };
  }, []);

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <WagmiConfig config={config}>
        <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
      </WagmiConfig>
    </PersistQueryClientProvider>
  );
};
