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

      <div className="absolute left-0 top-0 -z-10 h-full w-full overflow-hidden">
        <div
          style={{
            top: "-50%",
            left: "-50%",
            position: "absolute",
            width: "200%",
            height: "200%",
            transform: "rotate(30deg)",
            background:
              "radial-gradient(50% 50% at 50% 50%, #9BE9E9 0%, #C8F6F6 0.01%, rgba(37, 189, 206, 0) 100%)",
          }}
        />
        <div
          style={{
            // top: "-50%",
            // left: "-50%",
            position: "absolute",
            width: "100%",
            height: "100%",
            transform: "rotate(-25.12deg)",
            background:
              "radial-gradient(50% 50% at 50% 50%, #FFEFBE 0%, rgba(219, 240, 219, 0) 100%)",
          }}
        />
      </div>
    </Layout>
  );
}
/* Radial Gradient */
/* Radial Gradient */

// position: absolute;
// width: 2010.44px;
// height: 1364.95px;
// left: -476px;
// top: 381.99px;

// background: radial-gradient(50% 50% at 50% 50%, #FFEFBE 0%, rgba(219, 240, 219, 0) 100%);
// transform: rotate(-25.12deg);

// position: absolute;
// width: 2010.44px;
// height: 1364.95px;
// left: 206.47px;
// top: -522px;

// background: radial-gradient(50% 50% at 50% 50%, #9BE9E9 0%, #C8F6F6 0.01%, rgba(37, 189, 206, 0) 100%);
// transform: rotate(30deg);
