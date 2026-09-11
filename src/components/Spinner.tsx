export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-[var(--text-dim)]">
      <div
        className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--border-soft-2)]"
        style={{ borderTopColor: "var(--pink)" }}
      />
      {label && <p className="text-sm font-semibold">{label}</p>}
    </div>
  );
}
