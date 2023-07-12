import { createComponent, themeComponent } from ".";
import { tv } from "tailwind-variants";

const button = tv({
  base: "inline-flex justify-center items-center tracking-wide active:opacity-90 hover:opacity-80 transition-colors disabled:cursor-default disabled:opacity-50 ",
});

export const Button = themeComponent(createComponent("button", button), [
  "buttons.base",
]);

export const PrimaryButton = themeComponent(createComponent("button", button), [
  "buttons.base",
  "buttons.primary",
]);
export const SecondaryButton = themeComponent(
  createComponent("button", button),
  ["buttons.base", "buttons.secondary"]
);

export const SwapButton = themeComponent(
  createComponent(
    "button",
    tv({
      base: "mb-1 -mx-2 relative z-10 text-2xl rounded-full hover:opacity-80 transition-color flex items-center justify-center w-12 h-12",
    })
  ),
  ["buttons.swap"]
);

export const MaxButton = themeComponent(
  createComponent(
    "button",
    tv({
      base: "p-2 h-10 w-16 absolute right-1 top-1 active:opacity-90 hover:opacity-90 disabled:cursor-default disabled:opacity-50",
    })
  ),
  ["buttons.max"]
);
