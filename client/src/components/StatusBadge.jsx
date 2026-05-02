const statusStyles = {
  Todo: 'bg-slate-100 text-slate-700 ring-slate-200',
  'In Progress': 'bg-amber-50 text-amber-800 ring-amber-200',
  Done: 'bg-emerald-50 text-emerald-700 ring-emerald-200'
};

export const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center rounded px-2 py-1 text-xs font-semibold ring-1 ${statusStyles[status]}`}>
    {status}
  </span>
);
