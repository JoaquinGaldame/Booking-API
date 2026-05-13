import { X } from "lucide-react";
import { useEffect, type PropsWithChildren } from "react";

type DialogProps = PropsWithChildren<{
  open: boolean;
  onClose: () => void;
}>;

export function Dialog({ open, onClose, children }: DialogProps) {
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm">
      <button
        aria-label="Close dialog"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        type="button"
      />
      <div className="relative z-10 max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[2rem]">
        <button
          aria-label="Close dialog"
          className="absolute right-5 top-5 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-signal hover:text-signal"
          onClick={onClose}
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>
  );
}
