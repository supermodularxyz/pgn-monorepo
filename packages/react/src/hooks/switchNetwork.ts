import { useSwitchNetwork } from "wagmi";
import { usePGN } from "..";

export function useSwitchToPGN() {
  const { networks } = usePGN();
  const { switchNetwork } = useSwitchNetwork();
  return () => {
    if (!switchNetwork) {
      alert("You must connect your wallet first.");
    } else {
      switchNetwork?.(networks.l2.id);
    }
  };
}
