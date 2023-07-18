import Image from "next/image";
import { Layout } from "../components/Layout";
import { GettingStarted } from "../components/GettingStarted";
import { BridgeTokens } from "@pgn/react";

export default function Index() {
  return (
    <Layout>
      <div className="flex justify-center pb-16 sm:pt-24 md:pt-40">
        <div className="min-h-[377px] max-w-md flex-1">
          <BridgeTokens />
        </div>
      </div>
      <GettingStarted />
      <div className="absolute top-16 -z-10 overflow-hidden md:left-32">
        <Image
          className=""
          src={"/background.png"}
          width={556}
          height={578}
          alt="background"
        />
      </div>
    </Layout>
  );
}
