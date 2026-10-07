import React from "react";
import { cn } from "../shared/utils/cn";

const textVariants = {
    h1: "text-4xl md:text-5xl font-extrabold tracking-tight",
    h2: "text-3xl md:text-4xl font-bold tracking-tight",
    h3: "text-2xl md:text-3xl font-semibold",
    h4Bold: "text-xl md:text-xl font-bold",
    h4: "text-lg md:text-xl font-semibold",
    pBold: "text-base font-bold",
    p: "text-base leading-relaxed",
    sm: "text-sm leading-snug",
    xs: "text-xs leading-none",
};

const textColors = {
    default: "text-slate-100 ",
    muted: "text-slate-500 ",
    primary: "text-[#9D4EDD] ",
    danger: "text-red-600 ",
};

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
    as?: React.ElementType;
    variant?: keyof typeof textVariants;
    color?: keyof typeof textColors;
    align?: "left" | "center" | "right" | "justify";
}

export const Text = React.forwardRef<HTMLElement, TextProps>(
    (
        {
            className,
            as: Component = "p",
            variant = "p",
            color = "default",
            align = "left",
            children,
            ...props
        },
        ref,
    ) => {
        return (
            <Component
                ref={ref}
                className={cn(
                    textVariants[variant],
                    textColors[color],
                    `text-${align}`,
                    className,
                )}
                {...props}
            >
                {children}
            </Component>
        );
    },
);

Text.displayName = "Text";
