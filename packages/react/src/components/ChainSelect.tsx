import { Chain, useSwitchNetwork } from "wagmi";

import { Label } from "./ui/Form";
import { createComponent, themeComponent } from "./ui";
import { SwapButton } from "./ui/Button";
import { tv } from "tailwind-variants";

export function ChainSelect({
  chainIn,
  chainOut,
}: {
  chainIn: Chain;
  chainOut: Chain;
}) {
  const { switchNetwork } = useSwitchNetwork();
  return (
    <div className="flex items-end">
      <div className="flex-1">
        <Label>From</Label>
        <ChainItem data-testid="from">{chainIn.name}</ChainItem>
      </div>
      <SwapButton
        type="button"
        disabled={!switchNetwork}
        onClick={() => switchNetwork?.(chainOut.id)}
      >
        ⇌
      </SwapButton>

      <div className="flex-1">
        <Label>To</Label>
        <ChainItem className="justify-end">{chainOut.name}</ChainItem>
      </div>
    </div>
  );
}

const ChainItem = themeComponent(
  createComponent("div", tv({ base: "p-4 flex items-center gap-1" })),
  ["input"]
);
