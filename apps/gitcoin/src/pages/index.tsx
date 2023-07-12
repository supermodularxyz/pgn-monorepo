import { Layout } from "../components/Layout";

import { BridgeTokens } from "@pgn/react";

export default function Index() {
  return (
    <Layout>
      <div className="flex justify-center pb-16 pt-40">
        <BridgeTokens />
      </div>
    </Layout>
  );
}
