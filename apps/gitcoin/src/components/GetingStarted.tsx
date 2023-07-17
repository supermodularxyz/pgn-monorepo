import { useSwitchToPGN } from "@pgn/react";

export const GettingStarted = () => {
  const switchToPGN = useSwitchToPGN();
  const steps = [
    "Connect your wallet to the Ethereum network.",
    "Make sure you have some funds in your ETH wallet.",
    <>
      Add the PGN network to your wallet. Add PGN to your wallet with one click{" "}
      <a className="cursor-pointer underline" onClick={switchToPGN}>
        here
      </a>
      .
    </>,
    "Input the amount of ETH you want to bridge over to PGN.",
    "Click Deposit in order to get the transaction started.",
    "Success! You now have your funds on PGN! Head over back to Grants Stack to continue.",
  ];
  return (
    <details className="[&_svg]:open:-rotate-0">
      <summary className="mb-4 flex cursor-pointer items-center gap-2">
        <h3 className="text-xl font-bold">How to get started</h3>
        <svg
          className="rotate-180 transform text-blue-700 transition-all duration-300"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.7071 12.7071C14.3166 13.0976 13.6834 13.0976 13.2929 12.7071L10 9.41421L6.70711 12.7071C6.31658 13.0976 5.68342 13.0976 5.29289 12.7071C4.90237 12.3166 4.90237 11.6834 5.29289 11.2929L9.29289 7.29289C9.68342 6.90237 10.3166 6.90237 10.7071 7.29289L14.7071 11.2929C15.0976 11.6834 15.0976 12.3166 14.7071 12.7071Z"
            fill="#111827"
          />
        </svg>
      </summary>
      <ol className="mb-6 space-y-4">
        {steps.map((step, i) => (
          <li key={i} className="flex gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#9BE9E9]">
              {i + 1}
            </div>
            <div>{step}</div>
          </li>
        ))}
      </ol>
      <div className="text-sm">
        For more in-depth steps, check out the{" "}
        <a
          className="underline"
          target="_blank"
          href="https://docs.publicgoods.network"
        >
          PGN guide.
        </a>
      </div>
    </details>
  );
};
