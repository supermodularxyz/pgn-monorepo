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
const { depositETH, depositERC20 } = vi.hoisted(() => {
  const mock = vi
    .fn()
    .mockResolvedValue({ hash: "hash", wait: vi.fn().mockResolvedValue({}) });
  return { depositERC20: mock, depositETH: mock };
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
      waitForMessageStatus = waitForMessageStatus;
    },
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
  it.only("deposits ERC20", async () => {
    render(<BridgeTokens />);

    await connectAndEnterAmount({ user });

    const selectToken = screen.getByRole("combobox", { name: "Asset" });
    const tokenOption = screen.getByRole("option", { name: "TestToken" });

    userEvent.selectOptions(selectToken, ["TestToken"]);
    // fireEvent.change(selectToken, { target: { value: "TestToken" } });
    // await waitFor(() => {
    //   expect(tokenOption.selected).toBe(true);
    // });
    // const depositButton = screen.getByRole("button", { name: "Deposit" });
    // act(() => {
    //   user.click(depositButton);
    // });
    // await waitFor(() => {
    //   expect(depositERC20).toHaveBeenCalledWith("1000000000000000000", {});
    // });
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

  // Wait for balance to be updated before we attempt deposit
  // await waitFor(async () => {
  //   expect(screen.getByText(/10000/)).toBeInTheDocument();
  // });
  await waitFor(() => expect(amount.value).toBe("1"));
}
