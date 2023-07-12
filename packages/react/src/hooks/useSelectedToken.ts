import { useNetwork } from "wagmi";
import { usePGN } from "..";
import { Token } from "../types";
import { useCallback } from "react";

export function useSelectedToken(network?: string) {
  const { chain } = useNetwork();
  const { tokens } = usePGN();

  return useCallback(
    (address: string) =>
      tokens.find((t) => {
        const networkId = network || (chain?.network as keyof typeof t.tokens);
        return address === t.tokens[networkId]?.address;
      }),
    [tokens, network, chain]
  );
}

export function useTokenAddresses() {
  const {
    networks: { l1, l2 },
  } = usePGN();
  return useCallback(
    (token?: Token) =>
      token
        ? [
            token.tokens[l1.network]?.address,
            token.tokens[l2?.network]?.address,
          ]
        : [],
    [l1, l2]
  );
}
