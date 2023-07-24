import { Address, Chain, useAccount, useBalance } from "wagmi";

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
  const getToken = useSelectedToken();

  const tokenAddress = useMemo(
    () => getToken(token)?.tokens[chain.network]?.address,
    [token, chain]
  );

  return useBalance({
    address,
    chainId: chain?.id,
    token: tokenAddress,
    watch: true,
    enabled: Boolean(address && chain?.id),
  });
}
