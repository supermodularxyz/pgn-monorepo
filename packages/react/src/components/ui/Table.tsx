import { tv } from "tailwind-variants";
import { createComponent } from ".";

const table = tv({
  base: "w-full text-sm",
});

const variants = { align: { right: "text-right" } };

const tbody = tv({ base: "" });
const thead = tv({ base: "" });
const tr = tv({
  base: "block sm:table-row hover:bg-muted border-b transition-colors",
  variants,
});
const th = tv({
  base: "px-1 sm:px-2 text-left font-medium h-10 text-muted-foreground align-middle",
  variants,
});
const td = tv({
  base: "flex sm:table-cell p-1 sm:p-2 align-middle whitespace-nowrap break-normal",
  variants,
});

export const Table = createComponent("table", table);
export const Thead = createComponent("thead", thead);
export const Tbody = createComponent("tbody", tbody);
export const Tr = createComponent("tr", tr);
export const Td = createComponent("td", td);
export const Th = createComponent("th", th);
