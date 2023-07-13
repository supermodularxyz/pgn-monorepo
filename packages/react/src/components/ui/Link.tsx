import { tv } from "tailwind-variants";
import { createComponent, themeComponent } from ".";

export const Link = themeComponent(
  createComponent("a", tv({ base: "active:opacity-70 hover:underline" })),
  ["link"]
);
