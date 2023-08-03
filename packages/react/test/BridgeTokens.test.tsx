import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
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
  cleanup,
} from ".";
import { BridgeTokens } from "../src/components/BridgeTokens";
import { TestToken } from "../src/config/tokens";
import { Transactions } from "../src";

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

const {
  getWithdrawalsByAddress,
  getMessageStatus,
  getMessageReceipt,
  proveMessage,
  finalizeMessage,
} = vi.hoisted(() => {
  const transactions = [
    {
      address: "0x4200000000000000000000000000000000000010",
      topics: [
        "0x73d170910aba9e6d50b102db522b1dbcd796216f5128b445aa2135272886497e",
        "0x00000000000000000000000010246fe5bf3b06fc688ed4aa1445ff52358ce3a9",
        "0x0000000000000000000000007c6b91d9be155a6db01f749217d76ff02a7227f2",
        "0x000000000000000000000000f66ccedcd3f99c234cefa713ab7399f5dd3a6770",
      ],
      data: "0x000000000000000000000000f66ccedcd3f99c234cefa713ab7399f5dd3a67700000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000",
      blockNumber: "0x790f9",
      transactionHash:
        "0x524070b42970509ee8e0b0ed46fbc8f5c7c825803258e154c85fcde7f24cf509",
      transactionIndex: "0x1",
      blockHash:
        "0xec09572075af771fc10d28c1153b54ebfa25610cb66fc6211919c470450d4716",
      logIndex: "0x2",
      removed: false,
    },
    {
      address: "0x4200000000000000000000000000000000000010",
      topics: [
        "0x73d170910aba9e6d50b102db522b1dbcd796216f5128b445aa2135272886497e",
        "0x00000000000000000000000010246fe5bf3b06fc688ed4aa1445ff52358ce3a9",
        "0x0000000000000000000000007c6b91d9be155a6db01f749217d76ff02a7227f2",
        "0x000000000000000000000000f66ccedcd3f99c234cefa713ab7399f5dd3a6770",
      ],
      data: "0x000000000000000000000000f66ccedcd3f99c234cefa713ab7399f5dd3a67700000000000000000000000000000000000000000000000000429d069189e000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000",
      blockNumber: "0x79175",
      transactionHash:
        "0x90b79797d6decd0803e50c63fa23674b7629185a8203f1ea317f4d83a3ae4863",
      transactionIndex: "0x1",
      blockHash:
        "0x0aa2fc6bcf3f549bc4f20719c945430301e1af29b9881a79fa2558292f31648d",
      logIndex: "0x2",
      removed: false,
    },
    {
      address: "0x4200000000000000000000000000000000000010",
      topics: [
        "0x73d170910aba9e6d50b102db522b1dbcd796216f5128b445aa2135272886497e",
        "0x00000000000000000000000010246fe5bf3b06fc688ed4aa1445ff52358ce3a9",
        "0x0000000000000000000000007c6b91d9be155a6db01f749217d76ff02a7227f2",
        "0x000000000000000000000000f66ccedcd3f99c234cefa713ab7399f5dd3a6770",
      ],
      data: "0x000000000000000000000000f66ccedcd3f99c234cefa713ab7399f5dd3a67700000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000",
      blockNumber: "0x791c7",
      transactionHash:
        "0x215d62828e73793710b5b4463b1668de6a98a5323580b811af6ea0a2d9b05ce9",
      transactionIndex: "0x1",
      blockHash:
        "0x3ee0b5d3b31c8b901e55c39e66586f341c82e934f7a050e2b4694624374ff618",
      logIndex: "0x2",
      removed: false,
    },
  ];
  const statusMap = {
    [transactions[0].transactionHash]: 3,
    [transactions[1].transactionHash]: 5,
  };
  const mock = vi
    .fn()
    .mockResolvedValue({ hash: "hash", wait: vi.fn().mockResolvedValue({}) });
  return {
    proveMessage: mock,
    finalizeMessage: mock,
    getMessageReceipt: vi.fn().mockResolvedValue({
      transactionReceipt: { transactionHash: "l1Hash" },
    }),
    getMessageStatus: vi.fn((addr) => Promise.resolve(statusMap[addr] ?? 0)),
    getWithdrawalsByAddress: vi.fn().mockResolvedValue(transactions),
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
      getWithdrawalsByAddress = getWithdrawalsByAddress;
      getMessageStatus = getMessageStatus;
      getMessageReceipt = getMessageReceipt;
      proveMessage = proveMessage;
      finalizeMessage = finalizeMessage;
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
  afterEach(cleanup);

  it("deposits ETH", async () => {
    await connectAndEnterAmount({ user });
    const depositButton = screen.getByRole("button", { name: "Deposit" });
    user.click(depositButton);
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
    user.click(depositButton);

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

  it("proveMessage", async () => {
    render(<Transactions />);

    let proveButton;
    await waitFor(() => {
      proveButton = screen.getByRole("button", { name: "Prove" });
      user.click(proveButton);
    });

    await waitFor(() => {
      expect(proveMessage).toHaveBeenCalledWith(
        "0x524070b42970509ee8e0b0ed46fbc8f5c7c825803258e154c85fcde7f24cf509"
      );
    });
  });
  it("finalizeMessage", async () => {
    render(<Transactions />);

    let finalizeButton;
    await waitFor(() => {
      finalizeButton = screen.getByRole("button", { name: "Finalize" });
      user.click(finalizeButton);
    });

    await waitFor(() => {
      expect(finalizeMessage).toHaveBeenCalledWith(
        "0x90b79797d6decd0803e50c63fa23674b7629185a8203f1ea317f4d83a3ae4863"
      );
    });
  });
});

async function connectAndEnterAmount({ user }: { user: UserEvent }) {
  render(<BridgeTokens />);

  const connectButton = screen.getByRole("button", { name: "Mock" });
  user.click(connectButton);

  await waitFor(async () => {
    expect(screen.getByText("__connected__")).toBeInTheDocument();
  });

  const amount = screen.getByRole("spinbutton", { name: "Amount" });
  fireEvent.change(amount, { target: { value: "1" } });

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
  user.click(swapButton);
}
