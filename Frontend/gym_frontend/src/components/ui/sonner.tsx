// Fix: Added missing React import to resolve namespace errors.
import React from "react";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-brand-matte group-[.toaster]:text-white group-[.toaster]:border-brand-gold/20 group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-white/50",
          actionButton: "group-[.toast]:bg-brand group-[.toast]:text-white",
          cancelButton: "group-[.toast]:bg-brand-matte group-[.toast]:text-white/50",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };