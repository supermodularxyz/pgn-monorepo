import { RenderOptions, render } from "@testing-library/react";
import { default as userEvent } from "@testing-library/user-event";
import * as React from "react";

import { useAccount, useConnect } from "wagmi";
import * as chains from "wagmi/chains";
import { BridgeProvider } from "../src";

const ETH = {
  name: "ETH",
  symbol: "ETH",
  decimals: 18,
  description: "",
  website: "",
  twitter: "",
  tokens: {
    hardhat: { address: "" },
    l2hardhat: { address: "" },
  },
};

const { hardhat } = chains;
const l2hardhat = {
  ...hardhat,
  id: 31338,
  name: "L2 Hardhat",
  network: "l2hardhat",
};
const pgnConfig = {
  tokens: [ETH],
  networks: {
    l1: hardhat,
    l2: l2hardhat,
  },
};

export function Providers({ children }: React.PropsWithChildren) {
  return (
    <BridgeProvider config={pgnConfig}>
      <Connect />

      {children}
    </BridgeProvider>
  );
}

const customRender = (ui: React.ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: Providers, ...options });

export * from "@testing-library/react";
export { customRender as render };

export type UserEvent = ReturnType<typeof userEvent.setup>;
export { default as userEvent } from "@testing-library/user-event";

function Connect() {
  const { connector, isConnected } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();

  return (
    <div>
      <div>
        {isConnected ? "__connected__" : ""}
        {connectors
          .filter((x) => x.ready && x.id !== connector?.id)
          .map((x) => (
            <button
              key={x.id}
              role="button"
              onClick={() => {
                console.log("CONNECTING...");
                connect({ connector: x, chainId: hardhat.id });
              }}
            >
              {isLoading && x.id === pendingConnector?.id && "Connecting to "}
              {x.name}
            </button>
          ))}
      </div>

      {error && <div role="alert">{error.message}</div>}
    </div>
  );
}
