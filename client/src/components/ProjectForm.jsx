import { useState } from 'react';
import { Plus } from 'lucide-react';

const initialState = {
  name: '',
  description: '',
  members: []
};

export const ProjectForm = ({ users, onSubmit, isSubmitting }) => {
  const [form, setForm] = useState(initialState);

  const submit = async (event) => {
    event.preventDefault();
    await onSubmit(form);
    setForm(initialState);
  };

  return (
    <form onSubmit={submit} className="grid gap-3 border border-line bg-white p-4 shadow-sm">
      <div>
        <label className="text-sm font-medium text-slate-700" htmlFor="project-name">
          Project name
        </label>
        <input
          id="project-name"
          className="focus-ring mt-1 w-full rounded border border-line px-3 py-2"
          value={form.name}
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700" htmlFor="project-description">
          Description
        </label>
        <textarea
          id="project-description"
          className="focus-ring mt-1 min-h-24 w-full rounded border border-line px-3 py-2"
          value={form.description}
          onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
        />
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700" htmlFor="project-members">
          Initial members
        </label>
        <select
          id="project-members"
          multiple
          className="focus-ring mt-1 min-h-28 w-full rounded border border-line px-3 py-2"
          value={form.members}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              members: Array.from(event.target.selectedOptions, (option) => option.value)
            }))
          }
        >
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name} ({user.role})
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="focus-ring inline-flex items-center justify-center gap-2 rounded bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Plus className="h-4 w-4" />
        Create project
      </button>
    </form>
  );
};
