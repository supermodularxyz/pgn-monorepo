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
const { depositETH } = vi.hoisted(() => ({
  depositETH: vi
    .fn()
    .mockResolvedValue({ hash: "hash", wait: vi.fn().mockResolvedValue({}) }),
}));
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
    await waitFor(async () => {
      expect(screen.getByText(/10000/)).toBeInTheDocument();
    });
    await waitFor(() => expect(amount.value).toBe("1"));

    const depositButton = screen.getByRole("button", { name: "Deposit" });
    act(() => {
      user.click(depositButton);
    });
    await waitFor(() => {
      expect(depositETH).toHaveBeenCalledWith("1000000000000000000", {});
    });
  });
});
