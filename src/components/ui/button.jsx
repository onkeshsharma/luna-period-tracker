import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-white/30 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 cursor-pointer",
  {
    variants: {
      variant: {
        default:     "bg-primary text-primary-foreground hover:bg-primary/80",
        outline:     "border-slate-700 bg-slate-800/60 text-slate-200 hover:bg-slate-700 hover:text-white",
        secondary:   "bg-slate-700 text-slate-200 hover:bg-slate-600",
        ghost:       "hover:bg-white/10 hover:text-white text-slate-400",
        destructive: "bg-red-900/20 text-red-400 hover:bg-red-900/40",
        link:        "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 gap-1.5 px-4",
        sm:      "h-7 gap-1 px-2.5 text-[0.8rem]",
        lg:      "h-11 gap-2 px-6",
        icon:    "size-9 p-0",
        "icon-sm": "size-7 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({ className, variant = "default", size = "default", asChild = false, ...props }) {
  return (
    <button
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants }
