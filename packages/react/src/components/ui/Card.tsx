import { tv } from "tailwind-variants";
import { createComponent, themeComponent } from ".";

export const Card = themeComponent(
  createComponent("div", tv({ base: "space-y-4" })),
  ["card"]
);
