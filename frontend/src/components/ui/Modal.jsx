import { useEffect } from "react";
import Button from "./Button.jsx";

function Modal({ open, title, children, onClose, footer, disableClose = false }) {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape" && open && !disableClose) {
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, disableClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        aria-label="Close modal overlay"
        className="sf-modal-overlay absolute inset-0 bg-gray-900/45"
        onClick={() => {
          if (!disableClose) onClose();
        }}
      />
      <div className="sf-modal-panel relative z-10 w-full max-w-2xl rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
          <Button variant="ghost" className="h-8 px-2" onClick={onClose} disabled={disableClose}>
            ✕
          </Button>
        </div>
        <div className="px-6 py-4">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-slate-200 px-6 py-4 dark:border-slate-800">{footer}</div>}
      </div>
    </div>
  );
}

export default Modal;
