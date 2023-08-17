import Link from "next/link";
import { useRouter } from "next/router";
import { PropsWithChildren, useState } from "react";
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
import { Logo } from "./Logo";

export const Layout = ({ children }: PropsWithChildren) => {
  const { asPath } = useRouter();

  return (
    <main>
      <Meta />
      <header className="mx-auto h-16 flex-wrap items-center justify-between bg-white/30 p-2 lg:container md:flex md:h-20 md:items-center md:bg-transparent">
        <div className="flex h-full w-64 items-center pr-8 md:mt-0 lg:w-auto">
          <Logo />
        </div>

        <Navigation />
        <div className="fixed right-2 top-2 hidden lg:static lg:block">
          <AccountButton />
        </div>
      </header>
      <div className="container mx-auto p-2 sm:p-4 md:p-8">{children}</div>
    </main>
  );
};

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
  {
    label: "Grants Stack",
    href: "",
    icon: <GrantsIcon />,
    children: [
      {
        icon: <ExplorerIcon />,
        label: "Explorer",
        target: "_blank",
        href: "https://explorer.gitcoin.co",
      },
      {
        icon: <BuilderIcon />,
        label: "Builder",
        target: "_blank",
        href: "https://builder.gitcoin.co",
      },
      {
        icon: <ManagerIcon />,
        label: "Manager",
        target: "_blank",
        href: "https://manager.gitcoin.co",
      },
    ],
  },
];

const Navigation = () => {
  const { asPath } = useRouter();

  const [isOpen, toggleOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => toggleOpen(!isOpen)}
        type="button"
        className="fixed right-3 top-3 h-10 w-10 items-center justify-center md:hidden"
      >
        <span className="sr-only">Open main menu</span>
        <svg
          className="h-5 w-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 17 14"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M1 1h15M1 7h15M1 13h15"
          />
        </svg>
      </button>
      <NavigationMenu.Root
        className={clsx(
          {
            ["hidden"]: !isOpen,
          },
          "relative z-20 -mx-2 flex-1 justify-end bg-white/30 backdrop-blur md:mx-0 md:!flex md:bg-transparent"
        )}
      >
        <NavigationMenu.List
          className={clsx(
            "items-center justify-center gap-4 p-4 text-right backdrop-blur md:mx-0 md:flex md:gap-8 md:p-0  md:p-0"
          )}
        >
          {navItems.map((item, i) => (
            <NavigationMenu.Item
              key={i}
              className={clsx("flex justify-end hover:underline md:p-0 ", {
                ["underline"]: asPath === item.href,
              })}
            >
              {item.href ? (
                <NavigationMenu.Link asChild>
                  <Link {...item} className="py-4 md:py-0">
                    {item.label}
                  </Link>
                </NavigationMenu.Link>
              ) : (
                <>
                  <NavigationMenu.Trigger className="flex items-center gap-2 py-4 md:py-0">
                    {item.icon}
                    {item.label}
                    <ChevronDown aria-hidden />
                  </NavigationMenu.Trigger>
                  <NavigationMenu.Content>
                    <div className="flex flex-col gap-4 rounded-lg p-2 md:absolute md:right-0 md:w-32 md:bg-white">
                      {item.children?.map((child, j) => (
                        <Link
                          key={j}
                          className={clsx(
                            "flex items-center justify-end gap-2 py-2 hover:underline md:py-0"
                          )}
                          {...child}
                        >
                          {child.icon}
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </NavigationMenu.Content>
                </>
              )}
            </NavigationMenu.Item>
          ))}
        </NavigationMenu.List>

        <div className="md:absolute md:right-0 md:top-full md:mx-0 md:flex md:w-full md:justify-end md:pr-8 ">
          <NavigationMenu.Viewport className="md:relative md:origin-top-right" />
        </div>
      </NavigationMenu.Root>
    </>
  );
};
const Meta = () => {
  const site = {
    title: "Gitcoin | PGN Bridge",
    description: "Bridge funds to PGN",
    image: "https://builder.gitcoin.co/assets/gh-background.svg",
  };

  return (
    <>
      <meta charSet="utf-8" />
      <title>{site.title}</title>
      <meta content={site.description} name="description" />
      <meta content={site.title} property="og:title" />
      <meta content={site.description} property="og:description" />
      <meta content={site.image} property="og:image" />
      <meta content={site.title} property="twitter:title" />
      <meta content={site.description} property="twitter:description" />
      <meta content={site.image} property="twitter:image" />
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
    </>
  );
};
