import { ComponentProps } from "react";
import clsx from "clsx";

export const Skeleton = ({
  isLoading = false,
  className,
  children,
}: ComponentProps<"div"> & { isLoading: boolean }) =>
  isLoading ? (
    <div
      className={clsx("bg-gray-300 h-4 min-w-[20px] animate-pulse", className)}
    />
  ) : (
    <>{children}</>
  );
