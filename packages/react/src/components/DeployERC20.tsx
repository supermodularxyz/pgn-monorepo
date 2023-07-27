import { z } from "zod";

import { Form, Input, Select } from "./ui/Form";
import { TransferLog } from "./TransferLog";
import { ErrorMessage } from "./ErrorMessage";
import { Card } from "./ui/Card";
import { ChangeEvent, memo, useEffect, useState } from "react";
import { isAddress } from "viem";
import { Label } from "./ui/Form";
import { useFormContext } from "react-hook-form";
import { usePGN } from "..";
import {
  useAccount,
  useContractEvent,
  useContractWrite,
  useNetwork,
  useToken,
} from "wagmi";
import { Button, PrimaryButton } from "./ui/Button";
import { ConnectWallet } from "./ConnectButton";

export const TokenSchema = z.object({
  address: z.string(),
  name: z.string(),
  symbol: z.string(),
});

export const DeployERC20 = memo(() => {
  const { log, ...deploy } = useDeployERC20();

  return (
    <Form
      schema={TokenSchema}
      onSubmit={({ address, name, symbol }, form) => {
        console.log("depoy", address, name, symbol);
        deploy.write?.({
          args: [address, name, symbol],
        });
      }}
    >
      <Card>
        <div>
          <h3 className="font-semibold mb-1">Bridge token to PGN</h3>
          <p className="text-black/60 text-sm">
            Enter the address of the ERC20 you want to deploy.
          </p>
        </div>
        <TokenInput isLoading={deploy.isLoading} />
        <DeployButton isLoading={deploy.isLoading} />
        <TransferLog log={log} />
        <ErrorMessage className="font-mono" error={deploy.error as any} />
      </Card>
    </Form>
  );
});

const TokenInput = ({ isLoading = false }) => {
  const { networks } = usePGN();
  const form = useFormContext();

  const address = form.watch("address");

  const token = useToken({
    address,
    enabled: Boolean(isAddress(address)), // Only fetch token if valid address
    chainId: networks.l1.id,
  });

  useEffect(() => {
    // Update form so we can use these values in the submit handler
    if (token.data && !form.watch("symbol")) {
      const { name, symbol } = token.data;
      form.setValue("name", name);
      form.setValue("symbol", symbol);
    }
  }, [token, address]);

  useEffect(() => {
    // Reset form if empty to clear name and symbol
    if (!address) {
      form.reset();
    }
  }, [address]);

  const tokens = [
    {
      symbol: "DAI",
      l1address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      symbol: "GTC",
      l1address: "0xde30da39c46104798bb5aa3fe8b9e0e1f348163f",
    },
    {
      symbol: "USDC",
      l1address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    },
    {
      symbol: "USDT",
      l1address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between items-center">
          <Label htmlFor="address">L1 address</Label>
        </div>

        <div className="mb-1">
          <Input
            disabled={isLoading}
            placeholder="0x..."
            {...form.register("address")}
          />
        </div>
        <Select
          placeholder="Select a token"
          disabled={form.formState.isSubmitting}
          onChange={(e: any) => form.setValue("address", e.target.value)}
        >
          <option value="">Select token</option>
          {tokens.map((token) => {
            return (
              <option key={token.symbol} value={token.l1address}>
                {token.symbol}
              </option>
            );
          })}
        </Select>
      </div>
      <ErrorMessage
        className="font-mono"
        error={{
          message:
            token.error &&
            "Token not found. Make sure you enter a valid L1 token address.",
        }}
      />

      <div className="flex gap-1">
        <div>
          <Label htmlFor="address">Token name</Label>
          <Input disabled value={token.data?.name} />
        </div>
        <div>
          <Label htmlFor="address">Symbol</Label>
          <Input disabled value={token.data?.symbol} />
        </div>
      </div>
    </div>
  );
};

const DeployButton = ({ isLoading = false }) => {
  const {
    networks: { l2 },
  } = usePGN();
  const { address } = useAccount();
  const form = useFormContext();
  const { chain } = useNetwork();

  const isCorrectChain = chain?.network === l2.network;

  if (!address) {
    return <ConnectWallet chain={chain} />;
  }
  if (!isCorrectChain) {
    return <ConnectWallet chain={l2} />;
  }

  const symbol = form.watch("symbol");
  const canDeploy = !isLoading && symbol;

  if (!symbol) {
    return (
      <Button className="w-full" disabled>
        Enter a valid L1 address
      </Button>
    );
  }

  return (
    <PrimaryButton className="w-full" disabled={!canDeploy}>
      {isLoading ? "Deploying..." : `Deploy ${symbol} to ${l2.name}`}
    </PrimaryButton>
  );
};

import optimismMintableERC20FactoryData from "@eth-optimism/contracts-bedrock/artifacts/contracts/universal/OptimismMintableERC20Factory.sol/OptimismMintableERC20Factory.json";
import { useTransactionLog } from "../hooks/bridge";

function useDeployERC20() {
  const [l2Address, setL2Address] = useState("");
  const [log, pushLog, resetLog] = useTransactionLog();

  const write = useContractWrite({
    abi: optimismMintableERC20FactoryData.abi,
    address: "0x4200000000000000000000000000000000000012",
    functionName: "createOptimismMintableERC20",
    onMutate: () => pushLog("Deploying ERC20 to L2..."),
    onSuccess: () => pushLog("Transaction sent..."),
    onError: () => resetLog(),
  });

  const unwatch = useContractEvent({
    address: "0x4200000000000000000000000000000000000012",
    abi: optimismMintableERC20FactoryData.abi,
    eventName: "OptimismMintableERC20Created",
    listener: ([event]) => {
      if (event) {
        const { localToken } = (event as any).args || {};
        pushLog(`Token deployed to L2: ${localToken}`);
        setL2Address(localToken);
        unwatch?.();
      }
    },
  });

  return { ...write, log, l2Address };
}
