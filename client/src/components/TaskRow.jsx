import { Calendar, Trash2 } from 'lucide-react';
import { StatusBadge } from './StatusBadge.jsx';
import { formatDate, isOverdue } from '../utils/formatters.js';

export const TaskRow = ({ task, canDelete, onDelete, onStatusChange }) => {
  const overdue = isOverdue(task);

  return (
    <div className="grid gap-4 border-b border-line bg-white p-4 last:border-0 md:grid-cols-[1.5fr_1fr_180px_140px_auto] md:items-center">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold text-ink">{task.title}</h3>
          <StatusBadge status={task.status} />
          {overdue && (
            <span className="rounded bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700 ring-1 ring-rose-200">
              Overdue
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-slate-600">{task.description || 'No description'}</p>
      </div>

      <div className="text-sm">
        <p className="font-medium text-slate-900">{task.assignedTo?.name}</p>
        <p className="text-slate-500">{task.project?.name}</p>
      </div>

      <div className="flex items-center gap-2 text-sm text-slate-600">
        <Calendar className="h-4 w-4" />
        <span>{formatDate(task.deadline)}</span>
      </div>

      <select
        className="focus-ring rounded border border-line bg-white px-3 py-2 text-sm"
        value={task.status}
        onChange={(event) => onStatusChange(task._id, event.target.value)}
      >
        <option>Todo</option>
        <option>In Progress</option>
        <option>Done</option>
      </select>

      {canDelete && (
        <button
          type="button"
          onClick={() => onDelete(task._id)}
          className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded border border-line text-slate-500 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
          aria-label={`Delete ${task.title}`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
