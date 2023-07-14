import { BigNumber, ethers } from "ethers";

import optimismMintableERC20FactoryData from "@eth-optimism/contracts-bedrock/artifacts/contracts/universal/OptimismMintableERC20Factory.sol/OptimismMintableERC20Factory.json";
import optimismMintableERC20 from "@eth-optimism/contracts-bedrock/artifacts/contracts/universal/OptimismMintableERC20.sol/OptimismMintableERC20.json";

import { Signer } from "ethers";

type DeployERC20Args = {
  name: string;
  symbol: string;
  l1address: `0x${string}`;
  deployer: Signer;
};
export async function createOptimismERC20({
  name,
  symbol,
  l1address,
  deployer,
}: DeployERC20Args) {
  const optimismMintableERC20Factory = new ethers.Contract(
    "0x4200000000000000000000000000000000000012",
    optimismMintableERC20FactoryData.abi,
    deployer
  );

  const tx = await optimismMintableERC20Factory.createOptimismMintableERC20(
    l1address,
    name,
    symbol
  );

  await tx.wait();
  console.log(tx);
  console.log(tx.events);

  const event = tx.events.filter(
    (x) => x.event == "OptimismMintableERC20Created"
  )[0];
  return event;
}
