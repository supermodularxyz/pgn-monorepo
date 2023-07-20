import { useMemo } from "react";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, getDefaultWallets } from "@rainbow-me/rainbowkit";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { PGNConfig } from "../types";
import { MockConnector } from "wagmi/connectors/mock";
import { createWalletClient, http } from "viem";
import { hardhat } from "wagmi/chains";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: process.env.NODE_ENV === "production" },
  },
});

const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY;

export const isTest = process.env.NODE_ENV === "test";

const testConnectors = [
  new MockConnector({
    chains: [hardhat],
    options: {
      walletClient: createWalletClient({
        transport: http(hardhat.rpcUrls.default.http[0]),
        chain: hardhat,
        account: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        key: "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
        pollingInterval: 100,
      }),
    },
  }),
];
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
      connectors: isTest ? testConnectors : connectors,
      publicClient,
    });

    return { config, chains };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={config}>
        <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
};
