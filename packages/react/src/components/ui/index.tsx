import {
  ComponentPropsWithRef,
  forwardRef,
  ReactNode,
  ElementType,
} from "react";
import { usePGN } from "../..";

export type PolymorphicRef<C extends React.ElementType> =
  React.ComponentPropsWithRef<C>["ref"];

export type ComponentProps<C extends ElementType> = {
  as?: C;
  children?: ReactNode;
} & ComponentPropsWithRef<C>;

// TODO: How to get props typings for the TV props (eg, color)?
export const createComponent = (
  tag: string | ElementType,
  variant: any
  //   variant: TVReturnType<any, any, any, any, any, any>
) => {
  // eslint-disable-next-line react/display-name
  const Comp = forwardRef(
    <C extends ElementType>(
      { as, className, ...props }: ComponentProps<C>,
      ref?: PolymorphicRef<C>
    ) => {
      const Component = as || tag;
      return (
        <Component
          ref={ref}
          className={variant({ class: className, ...props })}
          {...props}
        />
      );
    }
  );

  return Comp;
};

export const themeComponent = (Component: any, keys: string[]) => {
  return forwardRef((props: ComponentPropsWithRef<typeof Component>, ref) => {
    const { theme = {} } = usePGN();
    const style = keys.reduce(
      (acc, key) => ({ ...acc, ...getProp(theme, key) }),
      {}
    );

    return <Component {...props} ref={ref} style={style} />;
  });
};

// Dot-notation access to object
const getProp = (obj: Object, path: string) =>
  path
    .split(".")
    .reduce((acc, part) => acc && acc[part], obj as { [key: string]: any });
