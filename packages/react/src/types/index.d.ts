import { Address, Chain } from "wagmi";

type Style = {
  fontFamily?: string;
  fontWeight?: number;
  fontSize?: number;
  borderRadius?: number;
  background?: string;
  color?: string;
};
export type Theme = {
  card: Style;
  buttons: {
    swap: Style;
    base: Style;
    primary: Style;
    secondary: Style;
  };
  input: Style;
  label: Style;
};

export type Token = {
  name?: string;
  symbol?: string;
  decimals?: number;
  description?: string;
  website?: string;
  twitter?: string;
  tokens: {
    [network: string]: { address?: Address };
  };
};

export type PGNConfig = {
  theme?: Theme;
  tokens: Token[];
  networks: {
    l1: Chain;
    l2: Chain;
  };
};
