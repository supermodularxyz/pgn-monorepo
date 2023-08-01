import { mainnet, sepolia } from "@wagmi/chains";
import { pgn, pgnTestnet } from "./chain";

console.log("sepoia", sepolia);
export const supportedChains = {
  mainnet,
  sepolia,
  pgn,
  pgnTestnet,
};
