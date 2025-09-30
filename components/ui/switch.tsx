"use client";

import * as React from "react";
import { cn } from "./utils";

interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

function Switch({ className, checked = false, onCheckedChange, ...props }: SwitchProps) {
  const handleClick = () => {
    onCheckedChange?.(!checked);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={handleClick}
      className={cn(
        "peer inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent transition-all outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
        checked 
          ? "bg-primary" 
          : "bg-switch-background dark:bg-input/80",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "pointer-events-none block size-4 rounded-full ring-0 transition-transform",
          "bg-card dark:bg-card-foreground",
          checked 
            ? "translate-x-[calc(100%-2px)] dark:bg-primary-foreground" 
            : "translate-x-0"
        )}
      />
    </button>
  );
}

export { Switch };