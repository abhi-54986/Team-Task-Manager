import { useEffect, useMemo, useState } from 'react';
import { createTask, deleteTask, getTasks, updateTaskStatus } from '../api/taskApi.js';
import { getProjects } from '../api/projectApi.js';
import { getUsers } from '../api/userApi.js';
import { TaskForm } from '../components/TaskForm.jsx';
import { TaskRow } from '../components/TaskRow.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { errorMessage } from '../utils/formatters.js';

export const TaskManagementPage = () => {
  const { isAdmin } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ projectId: '', userId: '', status: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeFilters = useMemo(
    () => Object.fromEntries(Object.entries(filters).filter(([, value]) => value)),
    [filters]
  );

  const loadData = async () => {
    setError('');
    setIsLoading(true);

    try {
      const [tasksResponse, projectsResponse, usersResponse] = await Promise.all([
        getTasks(activeFilters),
        getProjects(),
        isAdmin ? getUsers() : Promise.resolve({ data: { users: [] } })
      ]);

      setTasks(tasksResponse.data.tasks);
      setProjects(projectsResponse.data.projects);
      setUsers(usersResponse.data.users);
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeFilters, isAdmin]);

  const handleCreateTask = async (payload) => {
    setIsSubmitting(true);
    try {
      await createTask(payload);
      await loadData();
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await updateTaskStatus(taskId, status);
      await loadData();
    } catch (requestError) {
      setError(errorMessage(requestError));
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;

    try {
      await deleteTask(taskId);
      await loadData();
    } catch (requestError) {
      setError(errorMessage(requestError));
    }
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-ink">Task Management</h2>
          <p className="mt-1 text-sm text-slate-500">{isAdmin ? 'Assign and monitor team work' : 'Update assigned task status'}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <select
            className="focus-ring rounded border border-line bg-white px-3 py-2 text-sm"
            value={filters.projectId}
            onChange={(event) => setFilters((current) => ({ ...current, projectId: event.target.value }))}
          >
            <option value="">All projects</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>
          {isAdmin && (
            <select
              className="focus-ring rounded border border-line bg-white px-3 py-2 text-sm"
              value={filters.userId}
              onChange={(event) => setFilters((current) => ({ ...current, userId: event.target.value }))}
            >
              <option value="">All users</option>
              {users.map((teamUser) => (
                <option key={teamUser._id} value={teamUser._id}>
                  {teamUser.name}
                </option>
              ))}
            </select>
          )}
          <select
            className="focus-ring rounded border border-line bg-white px-3 py-2 text-sm"
            value={filters.status}
            onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}
          >
            <option value="">All statuses</option>
            <option>Todo</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>
        </div>
      </div>

      {error && <div className="rounded border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}

      {isAdmin && (
        <TaskForm projects={projects} users={users} onSubmit={handleCreateTask} isSubmitting={isSubmitting} />
      )}

      <section className="overflow-hidden border border-line bg-white shadow-sm">
        {isLoading ? (
          <p className="p-4 text-sm text-slate-500">Loading tasks...</p>
        ) : tasks.length ? (
          tasks.map((task) => (
            <TaskRow
              key={task._id}
              task={task}
              canDelete={isAdmin}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
            />
          ))
        ) : (
          <p className="p-4 text-sm text-slate-500">No tasks match the current filters.</p>
        )}
      </section>
    </div>
  );
};
