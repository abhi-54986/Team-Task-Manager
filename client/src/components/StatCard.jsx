export const StatCard = ({ label, value, accent = 'border-slate-200' }) => (
  <div className={`border-l-4 ${accent} bg-white p-4 shadow-sm ring-1 ring-line`}>
    <p className="text-sm font-medium text-slate-500">{label}</p>
    <p className="mt-2 text-3xl font-semibold text-ink">{value}</p>
  </div>
);
