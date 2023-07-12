import { Address, Chain, useAccount, useBalance } from "wagmi";
import { usePGN } from "..";

import { useSelectedToken } from "./useSelectedToken";
import { useMemo } from "react";

export function useTokenBalance({
  chain,
  token,
}: {
  chain: Chain;
  token: Address;
}): any {
  const { address } = useAccount();
  const { networks } = usePGN();
  const getToken = useSelectedToken(networks.l1.network);

  const tokenAddress = useMemo(
    () => getToken(token)?.tokens[chain.network]?.address,
    [token]
  );
  return useBalance({
    address,
    chainId: chain?.id,
    token: tokenAddress,
    watch: true,
    enabled: Boolean(address && chain?.id),
  });
}
