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
import { Logo } from "./Logo";

const navItems = [
  {
    label: "Bridge",
    href: "/",
  },
  {
    label: "Transactions",
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
        href: "#",
      },
      {
        icon: <BuilderIcon />,
        label: "Builder",
        href: "#",
      },
      {
        icon: <ManagerIcon />,
        label: "Manager",
        href: "#",
      },
    ],
  },
];

export const Layout = ({ children }: PropsWithChildren) => {
  return (
    <main>
      <header className="container mx-auto flex h-20 items-center justify-between">
        <div className="flex h-8 gap-2">
          <Logo />
        </div>
        <div className="flex items-center gap-8">
          <Navigation />
          <div className="hidden md:block">
            <AccountButton />
          </div>
        </div>
      </header>
      <div className="container mx-auto p-4 md:p-8">{children}</div>
    </main>
  );
};

const Navigation = () => {
  const { asPath } = useRouter();
  return (
    <NavigationMenu.Root className="relative flex justify-center">
      <NavigationMenu.List className="flex justify-center gap-8">
        {navItems.map((item, i) => (
          <NavigationMenu.Item
            key={i}
            className={clsx("hover:underline", {
              ["underline"]: asPath === item.href,
            })}
          >
            {item.href ? (
              <NavigationMenu.Link asChild>
                <Link {...item}>{item.label}</Link>
              </NavigationMenu.Link>
            ) : (
              <>
                <NavigationMenu.Trigger className="flex items-center gap-2">
                  {item.icon}
                  {item.label}
                  <ChevronDown aria-hidden />
                </NavigationMenu.Trigger>
                <NavigationMenu.Content className="">
                  <div className="absolute left-32 top-2 flex w-32 flex-col gap-4 rounded-lg bg-white p-2">
                    {item.children?.map((child, j) => (
                      <Link
                        key={j}
                        className={clsx(
                          "flex items-center justify-end gap-2 hover:underline"
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

      <div className="absolute left-0 top-full flex w-full justify-center">
        <NavigationMenu.Viewport className="relative origin-top-left" />
      </div>
    </NavigationMenu.Root>
  );
};
