import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  UserEvent,
  act,
  render,
  fireEvent,
  screen,
  userEvent,
  waitFor,
  testTokens,
  testTokenAddresses,
} from ".";
import { BridgeTokens } from "../src/components/BridgeTokens";
import { TestToken } from "../src/config/tokens";

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
      formatted: "__bal",
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
    await connectAndEnterAmount({ user });
    const depositButton = screen.getByRole("button", { name: "Deposit" });
    act(() => {
      user.click(depositButton);
    });
    await waitFor(() => {
      expect(depositETH).toHaveBeenCalledWith("1000000000000000000", {});
    });
  });
  it("withdraws ETH", async () => {
    await connectAndEnterAmount({ user });
    await swapNetworks({ user });

    let withdrawButton;
    await waitFor(() => {
      withdrawButton = screen.getByRole("button", { name: "Withdraw" });
      user.click(withdrawButton);
    });

    await waitFor(() => {
      expect(withdrawETH).toHaveBeenCalledWith("1000000000000000000");
    });
  });
  it("deposits ERC20", async () => {
    await connectAndEnterAmount({ user });
    await selectToken({ user: userEvent, token: "TestToken" });

    const depositButton = screen.getByRole("button", { name: "Deposit" });
    act(() => {
      user.click(depositButton);
    });

    await waitFor(() => {
      expect(approveERC20).toHaveBeenCalledWith(
        testTokenAddresses[0],
        testTokenAddresses[1],
        "1000000000000000000"
      );
    });
    await waitFor(() => {
      expect(depositERC20).toHaveBeenCalledWith(
        testTokenAddresses[0],
        testTokenAddresses[1],
        "1000000000000000000"
      );
    });
  });

  it("withdraws ERC20", async () => {
    await connectAndEnterAmount({ user });
    await selectToken({ user, token: "TestToken" });

    await swapNetworks({ user });
    let withdrawButton;
    await waitFor(() => {
      withdrawButton = screen.getByRole("button", { name: "Withdraw" });
      user.click(withdrawButton);
    });

    await waitFor(() => {
      expect(withdrawERC20).toHaveBeenCalledWith(
        testTokenAddresses[0],
        testTokenAddresses[1],
        "1000000000000000000"
      );
    });
  });
});

async function connectAndEnterAmount({ user }: { user: UserEvent }) {
  render(<BridgeTokens />);

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

  await waitFor(async () => {
    expect(screen.getByText(/__bal/)).toBeInTheDocument();
  });

  await waitFor(() => expect(amount.value).toBe("1"));
}

async function selectToken({
  token,
  user,
}: {
  token: string;
  user: UserEvent;
}) {
  user.selectOptions(screen.getByRole("combobox", { name: "Asset" }), [token]);
}
async function swapNetworks({ user }: { user: UserEvent }) {
  const swapButton = screen.getByRole("button", { name: "⇌" });
  act(() => {
    user.click(swapButton);
  });
}
