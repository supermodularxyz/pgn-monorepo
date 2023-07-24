import { usePGN } from "..";
import { Token } from "../types";
import { useCallback } from "react";

export function useSelectedToken() {
  const { tokens } = usePGN();

  return useCallback(
    (address: string) => getTokenFromL1Address(address, tokens),
    [tokens]
  );
}

const getTokenFromL1Address = (l1Address: string, tokens: Token[]) =>
  tokens.find((t) =>
    Object.values(t.tokens).find(({ address }) => address === l1Address)
  );

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
