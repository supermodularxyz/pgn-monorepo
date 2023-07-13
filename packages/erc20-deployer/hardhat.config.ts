import "@nomicfoundation/hardhat-toolbox";
import { createInterface } from "readline/promises";
import { HardhatUserConfig, task } from "hardhat/config";
import { Wallet, ethers, providers } from "ethers";
import { HttpNetworkConfig } from "hardhat/types";

import dotenv from "dotenv";
dotenv.config();

import { createOptimismERC20 } from "./utils/createOptimismERC20";

const PRIVATE_KEY = process.env.PRIVATE_KEY as string;
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;

const config: HardhatUserConfig = {
  solidity: {
    compilers: [{ version: "0.8.20" }, { version: "0.5.12" }],
  },
  networks: {
    sepolia: {
      chainId: 11155111,
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [PRIVATE_KEY],
    },
    pgnTestnet: {
      chainId: 58008,
      url: `https://sepolia.publicgoods.network`,
      accounts: [PRIVATE_KEY],
    },
  },
};

task("deploy", "Deploy ERC20 token")
  .addParam("l1", "The L1 chain")
  .addParam("l2", "The L2 chain")
  .addParam("l1address", "The L1 address of the token")

  .setAction(async ({ l1address, l1, l2 }, hre) => {
    validateAddress(l1address);

    const { abi } = await hre.artifacts.readArtifact("ERC20");
    const signer = new Wallet(PRIVATE_KEY);
    const { l1Provider, l2Provider } = createProviders({ l1, l2 });
    const erc20 = new ethers.Contract(
      l1address,
      abi,
      signer.connect(l1Provider)
    );

    const [name, symbol] = await Promise.all([erc20.name(), erc20.symbol()]);
    const balance = ethers.utils.formatEther(
      await signer.connect(l2Provider).getBalance()
    );

    console.log(`\nDeploying ${name} (${symbol}): ${l1} → ${l2}`);
    console.log(`\nDeployer: ${signer.address} (${balance} ETH)\n`);

    if (await shouldProceed()) {
      const deployer = signer.connect(l2Provider);
      const l2Address = await createOptimismERC20({
        name,
        symbol,
        l1address,
        deployer,
      });

      console.log(`Deployed at: ${l2Address}`);
    }
  });

function createProviders(networks: { l1: string; l2: string }) {
  const { l1: l1Provider, l2: l2Provider } = Object.entries(networks).reduce(
    (acc, [network, type]) => {
      const rpc = config.networks?.[type] as HttpNetworkConfig;
      if (!rpc) {
        throw new Error(`Network not found in config: ${network}`);
      }
      return {
        ...acc,
        [network]: new providers.JsonRpcProvider(rpc.url),
      };
    },
    {} as { l1: providers.Provider; l2: providers.Provider }
  );
  return { l1Provider, l2Provider };
}

async function shouldProceed() {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return ["y", "yes"].includes(await rl.question("Proceed? (yes/no): "));
}
function validateAddress(address: string) {
  if (!ethers.utils.isAddress(address)) {
    throw new Error(`Must be a valid address: ${address}`);
  }
}
export default config;
