import { useSwitchNetwork } from "wagmi";
import { usePGN } from "..";

export function useSwitchToPGN() {
  const { networks } = usePGN();
  const { switchNetwork } = useSwitchNetwork();

  return () => switchNetwork?.(networks.l2.id);
}
