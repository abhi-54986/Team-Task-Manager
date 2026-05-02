import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';

const today = new Date().toISOString().slice(0, 10);

const initialState = {
  title: '',
  description: '',
  projectId: '',
  assignedTo: '',
  status: 'Todo',
  deadline: today
};

export const TaskForm = ({ projects, users, onSubmit, isSubmitting, selectedProjectId = '' }) => {
  const [form, setForm] = useState({ ...initialState, projectId: selectedProjectId });

  useEffect(() => {
    if (selectedProjectId) {
      setForm((current) => ({ ...current, projectId: selectedProjectId }));
    }
  }, [selectedProjectId]);

  const activeProject = projects.find((project) => project._id === form.projectId);
  const projectMemberIds = activeProject?.members?.map((member) => member._id || member) || [];
  const assignees = projectMemberIds.length
    ? users.filter((user) => projectMemberIds.includes(user._id))
    : users;

  const submit = async (event) => {
    event.preventDefault();
    await onSubmit(form);
    setForm({ ...initialState, projectId: selectedProjectId || form.projectId });
  };

  return (
    <form onSubmit={submit} className="grid gap-3 border border-line bg-white p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-700" htmlFor="task-title">
            Task title
          </label>
          <input
            id="task-title"
            className="focus-ring mt-1 w-full rounded border border-line px-3 py-2"
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700" htmlFor="task-deadline">
            Deadline
          </label>
          <input
            id="task-deadline"
            type="date"
            min={today}
            className="focus-ring mt-1 w-full rounded border border-line px-3 py-2"
            value={form.deadline}
            onChange={(event) => setForm((current) => ({ ...current, deadline: event.target.value }))}
            required
          />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700" htmlFor="task-description">
          Description
        </label>
        <textarea
          id="task-description"
          className="focus-ring mt-1 min-h-24 w-full rounded border border-line px-3 py-2"
          value={form.description}
          onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
        />
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <div>
          <label className="text-sm font-medium text-slate-700" htmlFor="task-project">
            Project
          </label>
          <select
            id="task-project"
            className="focus-ring mt-1 w-full rounded border border-line px-3 py-2"
            value={form.projectId}
            onChange={(event) => setForm((current) => ({ ...current, projectId: event.target.value, assignedTo: '' }))}
            required
          >
            <option value="">Select project</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700" htmlFor="task-assignee">
            Assignee
          </label>
          <select
            id="task-assignee"
            className="focus-ring mt-1 w-full rounded border border-line px-3 py-2"
            value={form.assignedTo}
            onChange={(event) => setForm((current) => ({ ...current, assignedTo: event.target.value }))}
            required
          >
            <option value="">Select assignee</option>
            {assignees.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700" htmlFor="task-status">
            Status
          </label>
          <select
            id="task-status"
            className="focus-ring mt-1 w-full rounded border border-line px-3 py-2"
            value={form.status}
            onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}
          >
            <option>Todo</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>
        </div>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="focus-ring inline-flex items-center justify-center gap-2 rounded bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Plus className="h-4 w-4" />
        Create task
      </button>
    </form>
  );
};
