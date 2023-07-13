import { CrossChainMessenger } from "@eth-optimism/sdk";
import { getOptimismConfiguration } from "@conduitxyz/sdk";

import { useQuery } from "@tanstack/react-query";
import { Signer } from "ethers";
import { Provider } from "@ethersproject/providers";

import { usePGN } from "..";
import { getConduitSlug } from "../config";
import { useEthersProvider, useEthersSigner } from "./providers";

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
  const {
    networks: { l1, l2 },
  } = usePGN();
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
    l1SignerOrProvider = useEthersProvider({ chainId: l1?.id });
    l2SignerOrProvider = useEthersProvider({ chainId: l2?.id });
  }
  // Deposit, Prove, Finalize (L1 => L2)
  else if (l1AsSigner) {
    l1SignerOrProvider = useEthersSigner({ chainId: l1?.id });
    l2SignerOrProvider = useEthersProvider({ chainId: l2?.id });
  }
  // Withdraw                 (L2 => L1)
  else {
    l1SignerOrProvider = useEthersProvider({ chainId: l1?.id });
    l2SignerOrProvider = useEthersSigner({ chainId: l2?.id });
  }

  return useQuery(
    ["crosschain-messenger", { l1AsSigner, readonly }],
    async () => {
      console.log("create crosschainmessenger");

      return createCrossChainMessenger(
        { l1SignerOrProvider, l2SignerOrProvider },
        getConduitSlug(l2.network as any)
      );
    },
    { enabled: Boolean(l1SignerOrProvider && l2SignerOrProvider) }
  );
}
