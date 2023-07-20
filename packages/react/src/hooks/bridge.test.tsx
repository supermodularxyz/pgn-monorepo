import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  UserEvent,
  act,
  render,
  fireEvent,
  screen,
  userEvent,
  waitFor,
} from "../../test";
import { BridgeTokens } from "../components/BridgeTokens";

const { getOptimismConfiguration } = vi.hoisted(() => {
  return {
    getOptimismConfiguration: vi.fn().mockResolvedValue({}),
  };
});
const { depositETH } = vi.hoisted(() => {
  return {
    depositETH: vi
      .fn()
      .mockResolvedValue({ hash: "hash", wait: vi.fn().mockResolvedValue({}) }),
  };
});
const { waitForMessageStatus } = vi.hoisted(() => {
  return { waitForMessageStatus: vi.fn().mockResolvedValue({}) };
});

vi.mock("@conduitxyz/sdk", () => {
  return { getOptimismConfiguration };
});
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

    await waitFor(() => expect(amount.value).toBe("1"));

    // Wait for balance to be updated before we attempt deposit
    await waitFor(async () => {
      expect(screen.getByText(/10000/)).toBeInTheDocument();
    });

    const depositButton = screen.getByRole("button", { name: "Deposit" });
    act(() => {
      user.click(depositButton);
    });
    await waitFor(() => {
      expect(depositETH).toHaveBeenCalledWith("1000000000000000000", {});
    });
  });
});
