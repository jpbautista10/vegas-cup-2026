export default function Modal({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(5,8,18,0.85)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-slate-600 bg-slate-900 p-5 sm:p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
