import { Input, Label } from "./ui/Form";
import { useFormContext } from "react-hook-form";
import { Chain } from "wagmi";
import { useTokenBalance } from "../hooks/useTokenBalance";
import { MaxButton } from "./ui/Button";
import { useNetwork } from "wagmi";

export function TokenAmount({
  chainIn,
  chainOut,
}: {
  chainIn: Chain;
  chainOut: Chain;
}) {
  const form = useFormContext();
  const amount = form.watch("amount") || 0;
  const token = form.watch("token");

  const { chain } = useNetwork();

  const { data: balanceIn } = useTokenBalance({ chain: chainIn, token });
  const { data: balanceOut } = useTokenBalance({ chain: chainOut, token });

  const disabled = form.formState.isSubmitting || chain?.unsupported;
  return (
    <div>
      <div className="flex justify-between">
        <Label htmlFor="amount">Amount</Label>
        <div className="text-gray-500 text-sm tracking-wider">
          Balance: {balanceIn?.formatted?.slice(0, 6)} {balanceIn?.symbol}
        </div>
      </div>
      <div className="flex relative gap-2 mb-1">
        <Input
          autoComplete="off"
          type="number"
          step="0.00000001"
          min={0}
          id="amount"
          size="lg"
          placeholder="0.0"
          className="flex-1"
          disabled={disabled}
          {...form.register("amount", { valueAsNumber: true })}
        />
        <MaxButton
          disabled={disabled}
          onClick={() =>
            form.setValue("amount", balanceIn?.formatted.slice(0, 8))
          }
          type="button"
        >
          Max
        </MaxButton>
      </div>
      <div className="text-sm text-gray-500 tracking-wider">
        You will receive: {amount} {balanceOut?.symbol}
      </div>
    </div>
  );
}
