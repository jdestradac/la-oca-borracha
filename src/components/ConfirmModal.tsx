"use client";

import { AnimatePresence, motion } from "framer-motion";

export function ConfirmModal({
  open,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="flex w-full max-w-sm flex-col items-center gap-6 rounded-3xl border border-white/10 bg-[#171029] p-8 text-center shadow-[0_0_60px_rgba(124,58,237,0.35)]"
          >
            <p className="text-lg font-semibold text-[var(--text)]">{message}</p>

            <div className="flex w-full gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 rounded-2xl border border-white/15 bg-white/5 px-6 py-3 font-bold text-[var(--text)] transition-colors hover:bg-white/10"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="flex-1 rounded-2xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 px-6 py-3 font-bold text-white shadow-[0_0_20px_rgba(255,45,120,0.4)] transition-shadow hover:shadow-[0_0_30px_rgba(255,45,120,0.6)]"
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
