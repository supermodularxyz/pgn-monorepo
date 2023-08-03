import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ComponentPropsWithRef, useEffect, useState } from "react";

export function AccountButton(
  props: ComponentPropsWithRef<typeof ConnectButton>
) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(true);
  }, []);
  if (!loaded) return null;
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
