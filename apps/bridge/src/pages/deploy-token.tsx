import Image from "next/image";
import { Layout } from "../components/Layout";
import { DeployERC20 } from "@pgn/react";

export default function DeployToken() {
  return (
    <Layout>
      <div className="flex justify-center pb-16 sm:pt-24 md:pt-40">
        <div className="min-h-[377px] max-w-md flex-1">
          <DeployERC20 />
        </div>
      </div>
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
