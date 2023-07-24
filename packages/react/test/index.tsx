import { RenderOptions, render } from "@testing-library/react";
import { default as userEvent } from "@testing-library/user-event";
import * as React from "react";

import {
  useAccount,
  useConnect,
  usePublicClient,
  useTransaction,
  useWalletClient,
} from "wagmi";
import * as chains from "wagmi/chains";
import { BridgeProvider } from "../src";

const testTokens = [
  {
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
  },
  {
    name: "TestToken",
    symbol: "TOK",
    decimals: 18,
    description: "",
    website: "",
    twitter: "",
    tokens: {
      hardhat: { address: "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f" },
      l2hardhat: { address: "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f" },
    },
  },
];

const { hardhat } = chains;
const l2hardhat = {
  ...hardhat,
  id: 31338,
  name: "L2 Hardhat",
  network: "l2hardhat",
};
const pgnConfig = {
  tokens: testTokens,
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

import TestToken from "./TestToken.json";
import { parseEther } from "viem";
import { getTransaction } from "viem";

function Connect() {
  const { address: account, connector, isConnected } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();

  const tx = useTransaction();
  const { data: wallet } = useWalletClient();
  const client = usePublicClient();

  React.useEffect(() => {
    if (isConnected && wallet) {
      const { abi, bytecode } = TestToken;
      console.log("deploying");
      // wallet.deployContract({ abi, account, bytecode }).then(async (hash) => {
      //   console.log("deployed");
      //   const tx = await client.getTransaction({ hash });

      //   console.log(tx);
      //   // client.writeContract({
      //   //   address,
      //   //   abi,
      //   //   functionName: "mint",
      //   //   args: [account, parseEther("10")],
      //   // });
      // });
    }
  }, [isConnected, client]);
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
