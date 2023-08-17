import { Layout } from "../components/Layout";

import { Transactions } from "@pgn/react";

export default function TransactionsPage() {
  return (
    <Layout>
      <div className="pb-16 pt-4">
        <h1 className="mb-4 text-3xl font-bold">Withdrawals</h1>
        <Transactions />
      </div>
    </Layout>
  );
}
