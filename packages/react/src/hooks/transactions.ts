import { useAccount } from "wagmi";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCrossChainMessenger } from "./crossChainMessenger";
import { hashLowLevelMessage } from "@eth-optimism/sdk";

const ONE_MINUTE = 1000 * 60;
const ONE_HOUR = ONE_MINUTE * 60;
const ONE_DAY = ONE_HOUR * 24;

export function useWithdrawals() {
  const { address } = useAccount();

  const { data: crossChainMessenger } = useCrossChainMessenger({
    readonly: true,
  });
  return useQuery(
    ["withdrawals", address],
    async () =>
      crossChainMessenger?.getWithdrawalsByAddress(address as `0x${string}`),
    {
      enabled: Boolean(crossChainMessenger && address),
      staleTime: ONE_MINUTE * 5,
      cacheTime: ONE_DAY,
    }
  );
}

export function useWithdrawalReceipt(hash: string, status: number) {
  const { data: crossChainMessenger } = useCrossChainMessenger({
    readonly: true,
  });
  return useQuery(
    ["withdrawal-receipt", hash],
    async () => {
      // Get the message receipt (with L1 hash) only if it exists (status > 4)
      return status > 4 ? crossChainMessenger?.getMessageReceipt(hash) : null;
    },
    {
      enabled: Boolean(crossChainMessenger && hash),
      staleTime: ONE_MINUTE * 5,
      cacheTime: ONE_DAY,
    }
  );
}

export function useWithdrawalStatus(hash: string) {
  const { data: crossChainMessenger } = useCrossChainMessenger({
    readonly: true,
  });
  return useQuery(
    ["withdrawal-status", hash],
    async () => {
      return crossChainMessenger?.getMessageStatus(hash);
    },
    {
      enabled: Boolean(crossChainMessenger && hash),
      staleTime: ONE_MINUTE * 5,
      cacheTime: ONE_DAY,
    }
  );
}

export function useBlock(block: number) {
  const { data: crossChainMessenger } = useCrossChainMessenger({
    readonly: true,
  });
  return useQuery(
    ["block", block],
    () =>
      crossChainMessenger?.l2Provider
        .getBlock(block)
        .then((tx) => tx.timestamp * 1000),
    {
      enabled: Boolean(block && crossChainMessenger),
      cacheTime: ONE_DAY,
      staleTime: ONE_DAY,
    }
  );
}
export function useChallengePeriod() {
  const { data: crossChainMessenger } = useCrossChainMessenger({
    readonly: true,
  });
  return useQuery(
    ["challenge-period"],
    async () =>
      crossChainMessenger?.getChallengePeriodSeconds().then((n) => n * 1000),
    {
      enabled: Boolean(crossChainMessenger),
      staleTime: ONE_DAY,
      cacheTime: ONE_DAY,
    }
  );
}

export function useEstimateWait(hash: string) {
  const { data: crossChainMessenger } = useCrossChainMessenger({
    readonly: true,
  });
  return useQuery(
    ["wait", hash],
    () => {
      return crossChainMessenger
        ?.toCrossChainMessage(hash)
        .then((tx) => crossChainMessenger.toLowLevelMessage(tx))
        .then((withdrawal) =>
          crossChainMessenger.contracts.l1.OptimismPortal.provenWithdrawals(
            hashLowLevelMessage(withdrawal)
          )
        )
        .then((tx) => tx.timestamp * 1000);
    },
    {
      enabled: Boolean(hash && crossChainMessenger),
      cacheTime: ONE_DAY,
      staleTime: ONE_DAY,
    }
  );
}

export function useProve() {
  const { data: crossChainMessenger } = useCrossChainMessenger({
    l1AsSigner: true,
  });

  return useMutation(async (hash: string) =>
    crossChainMessenger?.proveMessage(hash).then((tx) => tx.wait())
  );
}
export function useFinalize() {
  const { data: crossChainMessenger } = useCrossChainMessenger({
    l1AsSigner: true,
  });
  return useMutation(async (hash: string) =>
    crossChainMessenger?.finalizeMessage(hash).then((tx) => tx.wait())
  );
}
