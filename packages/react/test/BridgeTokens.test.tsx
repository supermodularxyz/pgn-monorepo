import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  UserEvent,
  act,
  render,
  fireEvent,
  screen,
  userEvent,
  waitFor,
} from ".";
import { BridgeTokens } from "../src/components/BridgeTokens";

// Mock Conduit SDK
const { getOptimismConfiguration } = vi.hoisted(() => ({
  getOptimismConfiguration: vi.fn().mockResolvedValue({}),
}));
vi.mock("@conduitxyz/sdk", () => ({ getOptimismConfiguration }));

// Mock Optimism SDK
const { depositETH, withdrawETH, approveERC20, depositERC20, withdrawERC20 } =
  vi.hoisted(() => {
    const mock = vi
      .fn()
      .mockResolvedValue({ hash: "hash", wait: vi.fn().mockResolvedValue({}) });
    return {
      depositETH: mock,
      withdrawETH: mock,
      approveERC20: mock,
      depositERC20: mock,
      withdrawERC20: mock,
    };
  });
const { waitForMessageStatus } = vi.hoisted(() => ({
  waitForMessageStatus: vi.fn().mockResolvedValue({}),
}));

vi.mock("@eth-optimism/sdk", () => {
  return {
    MessageStatus: {
      RELAYED: "RELAYED",
    },
    CrossChainMessenger: class {
      depositETH = depositETH;
      withdrawETH = withdrawETH;
      approveERC20 = approveERC20;
      depositERC20 = depositERC20;
      withdrawERC20 = withdrawERC20;
      waitForMessageStatus = waitForMessageStatus;
    },
  };
});

// Mock useBalance hook so we don't have to mint tokens for testing
const { useBalance } = vi.hoisted(() => ({
  useBalance: vi.fn().mockReturnValue({
    data: {
      symbol: "TOK",
      formatted: "100.00",
      value: 10 ** 18,
    },
  }),
}));

vi.mock("wagmi", async () => {
  const actual = await vi.importActual("wagmi");
  return {
    ...(actual as any),
    useBalance,
  };
});

describe("<BridgeTokens />", () => {
  let user: UserEvent;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it("deposits ETH", async () => {
    render(<BridgeTokens />);

    await connectAndEnterAmount({ user });
    const depositButton = screen.getByRole("button", { name: "Deposit" });
    act(() => {
      user.click(depositButton);
    });
    await waitFor(() => {
      expect(depositETH).toHaveBeenCalledWith("1000000000000000000", {});
    });
  });

  it("deposits ERC20", async () => {
    render(<BridgeTokens />);

    await connectAndEnterAmount({ user });

    const selectToken = screen.getByRole("combobox", { name: "Asset" });

    userEvent.selectOptions(selectToken, ["TestToken"]);
    const depositButton = screen.getByRole("button", { name: "Deposit" });
    act(() => {
      user.click(depositButton);
    });

    await waitFor(() => {
      expect(approveERC20).toHaveBeenCalledWith("1000000000000000000", {});
      expect(depositERC20).toHaveBeenCalledWith("1000000000000000000", {});
    });
  });
});

async function connectAndEnterAmount({ user }: { user: UserEvent }) {
  const connectButton = screen.getByRole("button", { name: "Mock" });
  act(() => {
    user.click(connectButton);
  });

  await waitFor(async () => {
    expect(screen.getByText("__connected__")).toBeInTheDocument();
  });

  const amount = screen.getByRole("spinbutton", { name: "Amount" });
  act(() => {
    fireEvent.change(amount, { target: { value: "1" } });
  });

  await waitFor(() => expect(amount.value).toBe("1"));
}
