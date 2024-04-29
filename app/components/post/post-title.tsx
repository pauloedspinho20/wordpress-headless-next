import { ReactNode } from "react";
import cn from "classnames";
interface Props {
  className: string;
  children: ReactNode;
}

export default function PostTitle({ className, children }: Props) {
  return (
    <h1
      className={cn(
        "mb-0 text-center text-2xl font-bold leading-tight tracking-tighter md:text-left md:text-2xl md:leading-none lg:text-4xl",
        className,
      )}
    >
      {children}
    </h1>
  );
}
