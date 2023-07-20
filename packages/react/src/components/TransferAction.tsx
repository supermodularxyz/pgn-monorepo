import { parseEther } from "viem";
import { Chain, useAccount, useNetwork } from "wagmi";
import { useFormContext } from "react-hook-form";

import { Button, PrimaryButton } from "./ui/Button";
import { useTokenBalance } from "../hooks/useTokenBalance";
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
    amount && balance?.value >= parseEther(String(parseFloat(amount)));

  if (balanceOverAmount) {
    return (
      <PrimaryButton
        className="w-full"
        color="primary"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : action}
      </PrimaryButton>
    );
  }
  return (
    <Button className="w-full" disabled>
      Insufficient balance
    </Button>
  );
}
