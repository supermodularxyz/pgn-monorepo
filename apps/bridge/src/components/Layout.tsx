import Link from "next/link";
import { useRouter } from "next/router";
import { PropsWithChildren } from "react";
import clsx from "clsx";

import { AccountButton } from "@pgn/react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import {
  BuilderIcon,
  ChevronDown,
  ExplorerIcon,
  GrantsIcon,
  ManagerIcon,
} from "./icons";

const navItems = [
  {
    label: "Bridge",
    href: "/",
  },
  {
    label: "Withdrawals",
    href: "/transactions",
  },
  {
    label: "Documentation",
    href: "https://docs.publicgoods.network",
    target: "_blank",
  },
];

export const Layout = ({ children }: PropsWithChildren) => {
  const { asPath } = useRouter();
  return (
    <>
      <meta charSet="utf-8" />
      <title>Public Goods Network - Bridge</title>
      <meta
        content="PGN is both a digital schelling point and the world's first L2 that works to create durable and recurring funding for public goods."
        name="description"
      />
      <meta content="Public Goods Network - Bridge" property="og:title" />
      <meta
        content="PGN is both a digital schelling point and the world's first L2 that works to create durable and recurring funding for public goods."
        property="og:description"
      />
      <meta
        content="https://uploads-ssl.webflow.com/647f92a0f2ef1e7c88494a60/64a579cce0dd563bb5f26680_PGNgreen.png"
        property="og:image"
      />
      <meta content="Public Goods Network - Bridge" property="twitter:title" />
      <meta
        content="PGN is both a digital schelling point and the world's first L2 that works to create durable and recurring funding for public goods."
        property="twitter:description"
      />
      <meta
        content="https://uploads-ssl.webflow.com/647f92a0f2ef1e7c88494a60/64a579cce0dd563bb5f26680_PGNgreen.png"
        property="twitter:image"
      />
      <meta property="og:type" content="website" />
      <meta content="summary_large_image" name="twitter:card" />
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <link
        href="https://uploads-ssl.webflow.com/647f92a0f2ef1e7c88494a60/64a575cc96298081294be33a_PGN%20ICO.png"
        rel="shortcut icon"
        type="image/x-icon"
      />
      <link
        href="https://uploads-ssl.webflow.com/647f92a0f2ef1e7c88494a60/64a575eedb5908ca4f0f63b1_PGN%20ICO2.png"
        rel="apple-touch-icon"
      />
      <main>
        <header className="container mx-auto h-20 items-center justify-between p-2 md:flex">
          <Logo />
          <div className="flex items-center gap-8 overflow-y-clip overflow-x-scroll py-2 sm:overflow-x-hidden">
            {navItems.map((item) => (
              <Link
                key={item.href}
                {...item}
                className={clsx("hover:underline", {
                  ["underline"]: asPath === item.href,
                })}
              >
                {item.label}
              </Link>
            ))}
            <div className="fixed right-2 top-2 md:static">
              <AccountButton />
            </div>
          </div>
        </header>
        <div className="container mx-auto p-2 sm:p-4 md:p-8">{children}</div>
      </main>
    </>
  );
};

const Logo = () => (
  <svg
    width="102"
    height="32"
    viewBox="0 0 102 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M32.3131 16C32.3131 24.599 25.1812 31.5856 16.3637 31.5856C7.54632 31.5856 0.41438 24.599 0.41438 16C0.41438 7.40103 7.54632 0.41438 16.3637 0.41438C25.1812 0.41438 32.3131 7.40103 32.3131 16Z"
      fill="white"
      stroke="black"
      strokeWidth="0.828761"
    />
    <rect
      x="8.90559"
      y="8.75056"
      width="9.62203"
      height="9.38973"
      fill="black"
      stroke="black"
      strokeWidth="0.828761"
    />
    <rect
      x="14.1995"
      y="13.8597"
      width="9.62203"
      height="9.38973"
      fill="black"
      stroke="black"
      strokeWidth="0.828761"
    />
    <rect
      x="14.1839"
      y="13.8597"
      width="4.34447"
      height="4.22947"
      fill="white"
      stroke="black"
      strokeWidth="0.828761"
    />
    <path
      d="M49.7717 15.3414H53.6913C54.2696 15.3414 54.8265 15.2985 55.362 15.2129C55.8975 15.1272 56.3687 14.9665 56.7757 14.7309C57.1826 14.4739 57.5039 14.1205 57.7395 13.6707C57.9966 13.2209 58.1251 12.6319 58.1251 11.9036C58.1251 11.1754 57.9966 10.5863 57.7395 10.1365C57.5039 9.68675 57.1826 9.34404 56.7757 9.10843C56.3687 8.8514 55.8975 8.68005 55.362 8.59438C54.8265 8.5087 54.2696 8.46586 53.6913 8.46586H49.7717V15.3414ZM44.7275 4.54618H55.0729C56.5079 4.54618 57.7288 4.76037 58.7355 5.18876C59.7422 5.59572 60.5561 6.1419 61.1773 6.82731C61.8199 7.51272 62.2804 8.29451 62.5588 9.17269C62.8587 10.0509 63.0086 10.9612 63.0086 11.9036C63.0086 12.8246 62.8587 13.7349 62.5588 14.6345C62.2804 15.5127 61.8199 16.2945 61.1773 16.9799C60.5561 17.6653 59.7422 18.2222 58.7355 18.6506C57.7288 19.0576 56.5079 19.261 55.0729 19.261H49.7717V27.4859H44.7275V4.54618Z"
      fill="black"
    />
    <path
      d="M78.5586 24.8835C77.659 26.0402 76.663 26.8541 75.5706 27.3253C74.4782 27.7751 73.3752 28 72.2614 28C70.505 28 68.92 27.7001 67.5064 27.1004C66.1141 26.4792 64.9361 25.6332 63.9722 24.5623C63.0084 23.4913 62.2694 22.2383 61.7553 20.8032C61.2413 19.3467 60.9843 17.7831 60.9843 16.1125C60.9843 14.3989 61.2413 12.8139 61.7553 11.3574C62.2694 9.87952 63.0084 8.59438 63.9722 7.50201C64.9361 6.40964 66.1141 5.55288 67.5064 4.93173C68.92 4.31058 70.505 4 72.2614 4C73.4394 4 74.5746 4.18206 75.667 4.54618C76.7808 4.88889 77.7768 5.40294 78.6549 6.08835C79.5546 6.77376 80.2935 7.61981 80.8718 8.62651C81.4501 9.6332 81.8035 10.7898 81.9321 12.0964H77.1128C76.8129 10.8112 76.2346 9.84739 75.3778 9.20482C74.5211 8.56225 73.4823 8.24096 72.2614 8.24096C71.1262 8.24096 70.1623 8.46586 69.3698 8.91566C68.5773 9.34404 67.9347 9.93307 67.4421 10.6827C66.9495 11.411 66.5853 12.2463 66.3497 13.1888C66.1355 14.1312 66.0284 15.1058 66.0284 16.1125C66.0284 17.0763 66.1355 18.0187 66.3497 18.9398C66.5853 19.8394 66.9495 20.6533 67.4421 21.3815C67.9347 22.1098 68.5773 22.6988 69.3698 23.1486C70.1623 23.577 71.1262 23.7912 72.2614 23.7912C73.9321 23.7912 75.2172 23.3735 76.1168 22.5382C77.0378 21.6814 77.5733 20.4498 77.7232 18.8434H72.6469V15.0843H82.2855V27.4859H79.0726L78.5586 24.8835Z"
      fill="black"
    />
    <path
      d="M82.1823 4.54618H87.1943L96.7686 19.9357H96.8329V4.54618H101.556V27.4859H96.5116L86.9695 12.1285H86.9052V27.4859H82.1823V4.54618Z"
      fill="black"
    />
  </svg>
);
