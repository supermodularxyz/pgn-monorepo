import { BridgeProvider, BridgeTokens } from "../src";
import { WagmiMock } from "./WagmiMock";
import { render, screen, userEvent } from "./utils";

const localhost = {
  id: 31337,
  name: "Localhost",
  network: "localhost",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["http://127.0.0.1:8545"],
    },
    public: {
      http: ["http://127.0.0.1:8545"],
    },
  },
};
const config = {
  tokens: [],
  networks: {
    l1: localhost,
    l2: localhost,
  },
};

const App = () => (
  <WagmiMock config={config}>
    <BridgeTokens />
  </WagmiMock>
);

describe("Simple working test", () => {
  it("the title is visible", () => {
    render(<App />);
    expect(screen.getByText("hello")).toBeInTheDocument();
  });
});
