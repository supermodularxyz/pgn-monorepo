import { tv } from "tailwind-variants";
import { createComponent, themeComponent } from ".";

export const Alert = themeComponent(
  createComponent("div", tv({ base: "border max-w-screen-sm space-y-4" })),
  ["alert"]
);

export const AlertTitle = createComponent(
  "h3",
  tv({ base: "font-bold text-lg" })
);
