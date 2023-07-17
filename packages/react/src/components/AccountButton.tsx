import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ComponentPropsWithRef } from "react";

export function AccountButton(
  props: ComponentPropsWithRef<typeof ConnectButton>
) {
  return (
    <ConnectButton.Custom>
      {({ account }) => {
        return account ? (
          <ConnectButton
            chainStatus={"none"}
            accountStatus="address"
            showBalance={false}
            {...props}
          />
        ) : null;
      }}
    </ConnectButton.Custom>
  );
}
