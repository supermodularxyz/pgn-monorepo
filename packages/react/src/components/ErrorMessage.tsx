import { tv } from "tailwind-variants";
import { createComponent, themeComponent } from "./ui";

const Error = createComponent(
  "div",
  tv({
    base: "text-sm whitespace-pre-wrap break-all p-2",
  })
);

export const ErrorMessage = themeComponent(
  ({ error, ...props }: { error?: { message: string; reason?: string } }) => {
    if (!error?.message) return null;
    return <Error {...props}>{error?.reason ?? error?.message}</Error>;
  },
  ["error"]
);
