import { Chain, useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { useFormContext } from "react-hook-form";
import { parseEther } from "ethers/lib/utils.js";

import { Button, PrimaryButton, SecondaryButton } from "./ui/Button";
import { useTokenBalance } from "../hooks/useTokenBalance";
import { usePGN } from "..";
import { ErrorMessage } from "./ErrorMessage";
import { ConnectWallet } from "./ConnectButton";

export function TransferAction({
  action,
  chain,
  isLoading,
}: {
  action: string;
  chain: Chain;
  isLoading?: boolean;
}) {
  const { watch } = useFormContext();
  const { address } = useAccount();
  const network = useNetwork();

  const { data: balance } = useTokenBalance({ chain, token: watch("token") });
  if (!address || network.chain?.unsupported) {
    return (
      <div>
        {network.chain?.unsupported ? (
          <ErrorMessage
            className="text-center mb-2"
            error={{ message: `Please switch to a supported network.` }}
          />
        ) : null}
        <ConnectWallet chain={chain} />
      </div>
    );
  }

  const amount = watch("amount");
  if (!amount || Number.isNaN(amount)) {
    return (
      <Button className="w-full" disabled>
        Enter an amount
      </Button>
    );
  }
  const balanceOverAmount =
    amount &&
    balance?.value?.gte(parseEther(String(parseFloat(amount).toFixed(18))));

  if (balanceOverAmount) {
    return (
      <PrimaryButton
        className="w-full"
        color="primary"
        type="submit"
        disabled={isLoading}
      >
        {action}
      </PrimaryButton>
    );
  }
  return (
    <Button className="w-full" disabled>
      Insufficient balance
    </Button>
  );
}
