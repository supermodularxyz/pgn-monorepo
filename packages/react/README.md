# PGN Bridge component

### How to use

Look in these files for example implementations:

- `/apps/app/bridge/_app.tsx`
- `/apps/app/bridge/pages/index.tsx`

#### BridgeProvider

The BridgeProvider contains the state for networks, tokens and theme. It also wraps Wagmi and RainbowKit providers to interact with the OptimismSDK.

```tsx
import "@pgn/react/styles.css";

import { BridgeProvider, tokens, networks } from "@pgn/react";

const config = {
  // Optional theme
  theme: {},
  // Tokens to be shown in the UI
  tokens: [tokens.ETH, tokens.TestToken],
  // Configs with RPC url and chain IDs
  networks: {
    l1: networks.supportedChains.sepolia,
    l2: networks.supportedChains.pgnTestnet,
  },
};

export default ({ Component, pageProps }) => {
  return (
    <BridgeProvider config={config}>
      <Component {...pageProps} />
    </BridgeProvider>
  );
};
```

#### BridgeTokens

The component for bridging tokens.

#### Transactions

This component will fetch all withdrawals and display in a table. The user can Prove or Finalize these transactions.

### Running tests

Make sure a hardhat node is running.

```sh
cd packages/erc20-deployer
npx hardhat node
```

Then you can run the tests

```sh
npm run test

```
