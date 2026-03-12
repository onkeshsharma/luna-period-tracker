import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-lg border border-slate-700 bg-transparent px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 transition-colors outline-none focus-visible:border-slate-500 focus-visible:ring-2 focus-visible:ring-slate-500/30 disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Input }
