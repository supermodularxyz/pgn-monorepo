import { PropsWithChildren } from "react";

export const Layout = ({ children }: PropsWithChildren) => {
  return (
    <main className="h-screen bg-[#F9F7F3]">
      <header className="container mx-auto flex h-20 items-center justify-between">
        <div className="w-32">
          <img
            src="https://uploads-ssl.webflow.com/6433c5d029c6bb75f3f00bd5/6433c5d029c6bb20c5f00bf8_GTC-Logotype-Dark.svg"
            loading="lazy"
            height="20"
            alt="Gitcoin logo"
          />
        </div>
      </header>
      <div className="container mx-auto p-4 md:p-8">{children}</div>
    </main>
  );
};
