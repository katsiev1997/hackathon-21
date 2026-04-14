import { createContext, type HTMLAttributes } from "preact";
import { useContext, useEffect, useRef } from "preact/hooks";
import { createPortal } from "preact/compat";
import type { ComponentChildren, JSX } from "preact";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { XIcon } from "lucide-react";

type DialogContextValue = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const DialogContext = createContext<DialogContextValue>({
  open: false,
  onOpenChange: () => {},
});

type DialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ComponentChildren;
};

function Dialog({ open = false, onOpenChange = () => {}, children }: DialogProps) {
  return <DialogContext.Provider value={{ open, onOpenChange }}>{children}</DialogContext.Provider>;
}

function DialogTrigger({
  children,
  asChild,
  ...props
}: { children?: ComponentChildren; asChild?: boolean } & Omit<
  HTMLAttributes<HTMLButtonElement>,
  "onClick"
>) {
  const { onOpenChange } = useContext(DialogContext);
  if (asChild) {
    return <span onClick={() => onOpenChange(true)}>{children}</span>;
  }
  return (
    <button type='button' onClick={() => onOpenChange(true)} {...props}>
      {children}
    </button>
  );
}

function DialogPortal({ children }: { children?: ComponentChildren }) {
  if (typeof document === "undefined") return null;
  return createPortal(<>{children}</>, document.body) as JSX.Element;
}

function DialogOverlay({ className, ...props }: Omit<HTMLAttributes<HTMLDivElement>, "onClick">) {
  const { onOpenChange } = useContext(DialogContext);
  return (
    <div
      data-slot='dialog-overlay'
      className={cn("fixed inset-0 z-50 bg-black/50 backdrop-blur-xs", className)}
      onClick={() => onOpenChange(false)}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: HTMLAttributes<HTMLDivElement> & { showCloseButton?: boolean }) {
  const { open, onOpenChange } = useContext(DialogContext);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <DialogPortal>
      <DialogOverlay />
      <div
        ref={contentRef}
        data-slot='dialog-content'
        className={cn(
          "fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-sm text-popover-foreground ring-1 ring-foreground/10 outline-none sm:max-w-sm",
          className,
        )}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {children}
        {showCloseButton && (
          <Button
            variant='ghost'
            className='absolute top-2 right-2'
            size='icon-sm'
            type='button'
            onClick={() => onOpenChange(false)}
          >
            <XIcon />
            <span className='sr-only'>Close</span>
          </Button>
        )}
      </div>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: JSX.HTMLAttributes<HTMLDivElement>) {
  return (
    <div data-slot='dialog-header' className={cn("flex flex-col gap-2", className)} {...props} />
  );
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { showCloseButton?: boolean }) {
  const { onOpenChange } = useContext(DialogContext);
  return (
    <div
      data-slot='dialog-footer'
      className={cn(
        "-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <Button variant='outline' type='button' onClick={() => onOpenChange(false)}>
          Close
        </Button>
      )}
    </div>
  );
}

function DialogTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      data-slot='dialog-title'
      className={cn("text-base leading-none font-medium", className)}
      {...props}
    />
  );
}

function DialogDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      data-slot='dialog-description'
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function DialogClose({
  children,
  asChild,
  ...props
}: { children?: ComponentChildren; asChild?: boolean } & Omit<
  HTMLAttributes<HTMLButtonElement>,
  "onClick"
>) {
  const { onOpenChange } = useContext(DialogContext);
  if (asChild) {
    return <span onClick={() => onOpenChange(false)}>{children}</span>;
  }
  return (
    <button type='button' onClick={() => onOpenChange(false)} {...props}>
      {children}
    </button>
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
