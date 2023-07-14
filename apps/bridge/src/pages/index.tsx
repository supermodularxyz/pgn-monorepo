import Image from "next/image";
import { Layout } from "../components/Layout";
import { GettingStarted } from "../components/GetingStarted";

import { BridgeTokens } from "@pgn/react";

export default function Index() {
  return (
    <Layout>
      <div className="flex justify-center pb-16 pt-40">
        <div className="min-h-[377px]">
          <BridgeTokens />
        </div>
      </div>
      <GettingStarted />
      <Image
        className="absolute left-32 top-16 -z-10"
        src={"/background.png"}
        width={556}
        height={578}
        alt="background"
      />
    </Layout>
  );
}
