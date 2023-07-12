import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ComponentPropsWithoutRef } from "react";
import { PrimaryButton, SecondaryButton } from "./ui/Button";
import { Chain, useSwitchNetwork } from "wagmi";

export function ConnectWallet({
  chain,
  ...props
}: { chain: Chain } & ComponentPropsWithoutRef<"button">) {
  const { switchNetwork } = useSwitchNetwork();
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain: { unsupported } = {},
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected = ready && account;

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <SecondaryButton
                    className="w-full"
                    onClick={openConnectModal}
                    type="button"
                    {...props}
                  >
                    Connect Wallet
                  </SecondaryButton>
                );
              }

              if (unsupported) {
                return (
                  <PrimaryButton
                    className="w-full"
                    onClick={() => switchNetwork?.(chain?.id)}
                    type="button"
                    {...props}
                  >
                    Switch to {chain.name}
                  </PrimaryButton>
                );
              }
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
