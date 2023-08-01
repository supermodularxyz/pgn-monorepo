import { useMemo, useState } from "react";
import { WagmiConfig, configureChains } from "wagmi";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import {
  RainbowKitProvider,
  connectorsForWallets,
  getDefaultWallets,
} from "@rainbow-me/rainbowkit";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import {
  safeWallet,
  argentWallet,
  trustWallet,
  ledgerWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";

import { PGNConfig } from "../types";
import { createClient } from "wagmi";

const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY;

export const WagmiProvider = ({
  children,
  pgnConfig,
}: { pgnConfig: PGNConfig } & React.PropsWithChildren) => {
  const [{ queryClient, persister }] = useState(() => {
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

    return { queryClient, persister };
  });

  const { client, chains } = useMemo(() => {
    const networks = Object.values(pgnConfig.networks);
    console.log(networks);
    const { chains, provider } = configureChains(networks, [
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

    const projectId = "4e43a05dd632c288318350b90b950400";
    const { wallets } = getDefaultWallets({
      appName: "PGN Bridge",
      projectId,
      chains,
    });

    const connectors = connectorsForWallets([
      ...wallets,
      {
        groupName: "Other",
        wallets: [
          safeWallet({ chains }),
          argentWallet({ projectId, chains }),
          trustWallet({ projectId, chains }),
          ledgerWallet({ projectId, chains }),
        ],
      },
    ]);

    const client = createClient({
      autoConnect: true,
      connectors,
      provider,
    });

    // const config = createConfig({
    //   autoConnect: true,
    //   connectors,
    //   publicClient,
    // });
    return { client, chains };
  }, []);

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <WagmiConfig client={client}>
        <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
      </WagmiConfig>
    </PersistQueryClientProvider>
  );
};
