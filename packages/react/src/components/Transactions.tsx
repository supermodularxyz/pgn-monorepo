import { PropsWithChildren, memo, useMemo } from "react";
import { useAccount, useNetwork } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import { TokenBridgeMessage } from "@eth-optimism/sdk";
import toast from "react-hot-toast";
import { ConnectWallet } from "./ConnectButton";
import { Link } from "./ui/Link";
import { SecondaryButton } from "./ui/Button";
import { Alert, AlertTitle } from "./ui/Alert";
import { Table, Tbody, Td, Th, Thead, Tr } from "./ui/Table";

import { timeAgo } from "../utils/date";
import { truncate } from "../utils/truncate";

import {
  useBlock,
  useChallengePeriod,
  useFinalize,
  useProve,
  useWithdrawalReceipt,
  useWithdrawalStatus,
  useWithdrawals,
} from "../hooks/transactions";

import { usePGN } from "..";
import { Skeleton } from "./ui/Skeleton";
import { parseEthersError } from "../utils/revertReason";

export const Transactions = memo(() => {
  const {
    networks: { l1 },
  } = usePGN();
  const { address } = useAccount();
  const { chain } = useNetwork();

  const isCorrectChain = chain?.network === l1.network;

  if (!address) {
    return (
      <div className="flex justify-center">
        <Alert>
          <AlertTitle>Connect Wallet</AlertTitle>
          <p>Connect your wallet to see your transactions.</p>
          <ConnectWallet chain={chain} />
        </Alert>
      </div>
    );
  }
  if (!isCorrectChain) {
    return (
      <div className="flex justify-center">
        <Alert>
          <AlertTitle>Unsupported network</AlertTitle>
          <p>Please switch to a supported network.</p>
          <ConnectWallet chain={l1} />
        </Alert>
      </div>
    );
  }

  return <TransactionsTable />;
});

const getWindowWidth = () =>
  typeof window !== "undefined" ? window.innerWidth : 1280;
const TransactionsTable = memo(() => {
  // const { data, error, isLoading } = useWithdrawals();
  const { data: challengePeriod } = useChallengePeriod();
  const isLoading = false;
  // console.log(data);
  const data = [
    {
      direction: 1,
      from: "0xf66CcEDcD3f99C234cefA713Ab7399F5DD3a6770",
      to: "0xf66CcEDcD3f99C234cefA713Ab7399F5DD3a6770",
      l1Token: "0x0000000000000000000000000000000000000000",
      l2Token: "0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000",
      amount: {
        type: "BigNumber",
        hex: "0x2386f26fc10000",
      },
      data: "0x",
      logIndex: 0,
      blockNumber: 2609200,
      transactionHash:
        "0x5ea331ee147d04ecce0a20e0ffd7fdfe999f38fd0ec1f26e162847119a9db7f5",
    },
    {
      direction: 1,
      from: "0xf66CcEDcD3f99C234cefA713Ab7399F5DD3a6770",
      to: "0xf66CcEDcD3f99C234cefA713Ab7399F5DD3a6770",
      l1Token: "0x10246FE5Bf3b06Fc688eD4AA1445FF52358CE3A9",
      l2Token: "0x7c6b91D9Be155A6Db01f749217d76fF02A7227F2",
      amount: {
        type: "BigNumber",
        hex: "0x016345785d8a0000",
      },
      data: "0x",
      logIndex: 2,
      blockNumber: 2609151,
      transactionHash:
        "0xaa553a7953bd5c4ad11ca6260c2337bd6449fe83c249116817ccddf8751ba31d",
    },
    {
      direction: 1,
      from: "0xf66CcEDcD3f99C234cefA713Ab7399F5DD3a6770",
      to: "0xf66CcEDcD3f99C234cefA713Ab7399F5DD3a6770",
      l1Token: "0x10246FE5Bf3b06Fc688eD4AA1445FF52358CE3A9",
      l2Token: "0x7c6b91D9Be155A6Db01f749217d76fF02A7227F2",
      amount: {
        type: "BigNumber",
        hex: "0x2386f26fc10000",
      },
      data: "0x",
      logIndex: 2,
      blockNumber: 2242818,
      transactionHash:
        "0x07a7e66dabd3c81787478f11faa693497d7f887f024b0afb1cf227e0f08bf549",
    },
  ];

  return (
    <div className="overflow-x-auto relative">
      <Table>
        <Thead>
          <Tr>
            <Th>Hash</Th>
            <Th>Status</Th>
            <Th>Timestamp</Th>
            <Th>L1 hash</Th>
            <Th>Time left</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {isLoading ? (
            <Tr>
              {Array.from({ length: 6 }).map((_, i) => (
                <Td key={i}>
                  <Skeleton isLoading />
                </Td>
              ))}
            </Tr>
          ) : data?.length ? (
            data.map(({ transactionHash, blockNumber }) => (
              <TransactionRow
                key={transactionHash}
                challengePeriod={challengePeriod}
                transactionHash={transactionHash}
                blockNumber={blockNumber}
              />
            ))
          ) : (
            <Tr>
              <Td colSpan={6} className="text-center">
                No transactions found
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </div>
  );
});

const withdrawStatusMap = {
  2: "Waiting for state root",
  3: "Ready to prove",
  4: "In challenge period",
  5: "Ready to relay",
  6: "Relayed",
};
const TransactionRow = ({
  transactionHash,
  blockNumber,
  challengePeriod = 0,
}: {
  blockNumber: number;
  transactionHash: string;
  challengePeriod?: number;
}) => {
  const { data: timestamp = 0 } = useBlock(blockNumber);
  const {
    networks: { l1, l2 },
  } = usePGN();
  const status = useWithdrawalStatus(transactionHash);
  const receipt = useWithdrawalReceipt(transactionHash, status?.data as number);
  const l1hash = receipt.data?.transactionReceipt.transactionHash;

  const statusText =
    withdrawStatusMap[status.data as keyof typeof withdrawStatusMap] ||
    "<unknown>";

  const timeLeft = timestamp ? timeAgo(timestamp + challengePeriod) : null;
  return (
    <Tr>
      <Td>
        <Link
          className="font-mono"
          target="_blank"
          title={transactionHash}
          href={`${l2.blockExplorers?.default.url}/tx/${transactionHash}`}
        >
          {truncate(transactionHash)}
        </Link>
      </Td>
      <Td>
        <Skeleton isLoading={status.isLoading}>{statusText}</Skeleton>
      </Td>
      <Td>{timestamp ? <>{timeAgo(timestamp)}</> : null}</Td>
      <Td>
        <Skeleton isLoading={receipt.isLoading}>
          {l1hash ? (
            <Link
              className="font-mono"
              target="_blank"
              title={l1hash}
              href={`${l1.blockExplorers?.default.url}/tx/${l1hash}`}
            >
              {truncate(l1hash)}
            </Link>
          ) : (
            "N/A"
          )}
        </Skeleton>
      </Td>
      <Td>{timeLeft}</Td>
      <Td>
        {1 || status.data === 3 ? <ProveButton hash={transactionHash} /> : null}
        {status.data === 5 ? <FinalizeButton hash={transactionHash} /> : null}
      </Td>
    </Tr>
  );
};

const ProveButton = ({ hash }: { hash: string }) => {
  const prove = useProve();
  const queryClient = useQueryClient();
  return (
    <SecondaryButton
      className="w-32"
      onClick={() =>
        prove.mutate(hash, {
          onSuccess: () =>
            queryClient.setQueryData(["withdrawal-status", hash], 4),
          onError: (error) =>
            toast.error(parseEthersError(error as string) as string),
        })
      }
      disabled={prove.isLoading}
    >
      {prove.isLoading ? "Proving..." : "Prove"}
    </SecondaryButton>
  );
};

const FinalizeButton = ({ hash }: { hash: string }) => {
  const finalize = useFinalize();
  const queryClient = useQueryClient();
  return (
    <SecondaryButton
      className="w-32"
      onClick={() =>
        finalize.mutate(hash, {
          onSuccess: () =>
            queryClient.setQueryData(["withdrawal-status", hash], 6),
          onError: (error) =>
            toast.error(parseEthersError(error as string) as string),
        })
      }
      disabled={finalize.isLoading}
    >
      {finalize.isLoading ? "Finalizing..." : "Finalize"}
    </SecondaryButton>
  );
};
