export default function Modal({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4"
      style={{ background: "var(--vc-overlay)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-slate-600 bg-slate-900 p-5 sm:p-6 shadow-2xl text-slate-100"
        style={{ background: "var(--vc-surface-solid)", color: "var(--vc-fg)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
