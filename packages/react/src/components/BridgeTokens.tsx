import { Chain, useNetwork } from "wagmi";
import { z } from "zod";

import { usePGN } from "..";
import { TokenSelect } from "./TokenSelect";
import { Form } from "./ui/Form";
import { ChainSelect } from "./ChainSelect";
import { TokenAmount } from "./TokenAmount";
import { TransferAction } from "./TransferAction";
import { useDeposit, useWithdraw } from "../hooks/bridge";
import { TransferLog } from "./TransferLog";
import { ErrorMessage } from "./ErrorMessage";
import { useSelectedToken } from "../hooks/useSelectedToken";
import { Card } from "./ui/Card";
import { memo, useMemo } from "react";
import { parseEther } from "viem";

export const Actions = {
  Deposit: "Deposit",
  Withdraw: "Withdraw",
};

export const BridgeSchema = z.object({
  amount: z.number(),
  token: z.string(),
});

function useAction() {
  const network = useNetwork();
  const {
    networks: { l1, l2 },
  } = usePGN();

  const deposit = useDeposit();
  const withdraw = useWithdraw();

  return useMemo(() => {
    // Determine action based on current chain (if on L2 - withdraw)
    const action =
      network.chain?.network === l2?.network
        ? Actions.Withdraw
        : Actions.Deposit;

    // Create map of in/out chains mapped to deposit or withdraw
    const chainActionMap = {
      [Actions.Deposit]: { in: l1, out: l2, hook: deposit },
      [Actions.Withdraw]: { in: l2, out: l1, hook: withdraw },
    };

    return {
      action,
      chainIn: chainActionMap[action].in as Chain,
      chainOut: chainActionMap[action].out as Chain,
      hook: chainActionMap[action].hook,
    };
  }, [network, l1, l2]);
}

export const BridgeTokens = memo(() => {
  const getToken = useSelectedToken();

  const {
    action,
    chainIn,
    chainOut,
    hook: { isLoading, log, error, mutate },
  } = useAction();

  return (
    <Form
      schema={BridgeSchema}
      onSubmit={(values, form) => {
        console.log("Submit", values);
        const amount = parseEther(String(values.amount)).toString();
        const token = getToken(values.token);
        return mutate(
          { amount, token },
          { onSuccess: () => form.resetField("amount") }
        );
      }}
    >
      <Card>
        <TokenSelect />
        <ChainSelect chainIn={chainIn} chainOut={chainOut} />
        <TokenAmount chainIn={chainIn} chainOut={chainOut} />
        <TransferAction action={action} chain={chainIn} isLoading={isLoading} />
        <TransferLog log={log} />
        <ErrorMessage className="font-mono" error={error as any} />
      </Card>
    </Form>
  );
});
