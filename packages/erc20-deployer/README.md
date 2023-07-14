# Deploy ERC20 Token

Run the following command:

```sh
npm run deploy -- --l1 sepolia --l2 pgnTestnet --l1address 0xd72ddE5D59Ca1E6A4131933b726E092A01eebBec
```

Make sure the networks exist in `hardhat.config.ts`

Sometimes the deployment fails with the error message: `transaction underpriced`.

You can configure gas price and limit in `utils/createOptimismERC20.ts`.

```ts
const tx = await optimismMintableERC20Factory.createOptimismMintableERC20(
  l1address,
  name,
  symbol,
  {
    gasPrice: ethers.utils.parseUnits("10", "gwei"),
    gasLimit: 2100000,
  }
);
```
