import { CrossChainMessenger } from "@eth-optimism/sdk";
import { getOptimismConfiguration } from "@conduitxyz/sdk";
import { useAccount } from "wagmi";
import { getProvider, fetchSigner } from "@wagmi/core";
import { useQuery } from "@tanstack/react-query";
import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";

import { usePGN } from "..";
import { getConduitSlug } from "../config";

function createCrossChainMessenger(
  { l1SignerOrProvider, l2SignerOrProvider }: any,
  conduitSlug: string
) {
  return getOptimismConfiguration(`conduit:${conduitSlug}`).then(
    (config: any) =>
      new CrossChainMessenger({
        ...config,
        l1SignerOrProvider,
        l2SignerOrProvider,
      })
  );
}

export function useCrossChainMessenger({
  l1AsSigner = false,
  readonly = false,
} = {}) {
  const { address } = useAccount();
  const {
    networks: { l1, l2 },
  } = usePGN();

  return useQuery(
    ["crosschain-messenger", { l1AsSigner, readonly }],
    async () => {
      /*
      Needs to handle 3 use-cases:
      - Deposit           L1 => L2 (Signer is L1)
      - Withdraw          L2 => L1 (Signer is L2)
      - Query withdrawals L2

      The reason we need the readonly with 2 providers is:
      - To fetch withdrawals we need to be on PGN network
      - Prove and Finalize require signing an L1 transaction
      - Only 1 signer can be active at a time

      */

      let l1SignerOrProvider: Provider | Signer | null | undefined;
      let l2SignerOrProvider: Provider | Signer | null | undefined;

      if (readonly) {
        l1SignerOrProvider = getProvider({ chainId: l1?.id });
        l2SignerOrProvider = getProvider({ chainId: l2?.id });
      }
      // Deposit, Prove, Finalize
      else if (l1AsSigner) {
        l1SignerOrProvider = await fetchSigner({ chainId: l1?.id });
        l2SignerOrProvider = getProvider({ chainId: l2?.id });
      }
      // Withdraw
      else {
        l1SignerOrProvider = getProvider({ chainId: l1?.id });
        l2SignerOrProvider = await fetchSigner({ chainId: l2?.id });
      }

      return createCrossChainMessenger(
        { l1SignerOrProvider, l2SignerOrProvider },
        getConduitSlug(l2.network as any)
      );
    },
    { enabled: Boolean(address) }
  );
}
