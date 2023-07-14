import { useMemo } from "react";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, getDefaultWallets } from "@rainbow-me/rainbowkit";
import { publicProvider } from "wagmi/providers/public";
import { PGNConfig } from "../types";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: process.env.NODE_ENV === "production" },
  },
});

export const WagmiProvider = ({
  children,
  pgnConfig,
}: { pgnConfig: PGNConfig } & React.PropsWithChildren) => {
  const { config, chains } = useMemo(() => {
    const networks = Object.values(pgnConfig.networks);
    const { chains, publicClient } = configureChains(networks, [
      publicProvider(),
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
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={config}>
        <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
};
