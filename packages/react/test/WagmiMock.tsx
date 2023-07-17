import { useMemo } from "react";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { publicProvider } from "wagmi/providers/public";
import { MockConnector } from "wagmi/connectors/mock";
import { PGNConfig } from "../src/types";

import { createPublicClient, createWalletClient, http } from "viem";
import { hardhat } from "viem/chains";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { ConnectWallet } from "../src/components/ConnectButton";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const getMockWalletClient = () =>
  createWalletClient({
    transport: http(hardhat.rpcUrls.default.http[0]),
    chain: hardhat,
    account: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    key: "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
    pollingInterval: 100,
  });

const testConnectors = [
  new MockConnector({ options: { walletClient: getMockWalletClient() } }),
];

const { chains, publicClient } = configureChains(
  [hardhat],
  [
    jsonRpcProvider({
      rpc: (chain: { id: number }) => {
        switch (chain.id) {
          case 31337:
            return {
              http: `http://localhost:8545`,
            };
          default:
            throw new Error("Unsupported network.");
        }
      },
    }),
  ]
);

const config = createConfig({
  autoConnect: true,
  connectors: testConnectors,
  publicClient,
});
export const WagmiMock = ({ children }: React.PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={config}>
        <RainbowKitProvider chains={chains}>
          <ConnectWallet chain={hardhat} />
          {children}
        </RainbowKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
};
