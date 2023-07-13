import { WagmiConfig, configureChains, createConfig } from "wagmi";
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
