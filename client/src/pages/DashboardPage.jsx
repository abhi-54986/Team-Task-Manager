import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderPlus, Trash2 } from 'lucide-react';
import { getDashboardStats } from '../api/dashboardApi.js';
import { createProject, deleteProject, getProjects } from '../api/projectApi.js';
import { getUsers } from '../api/userApi.js';
import { ProjectForm } from '../components/ProjectForm.jsx';
import { StatCard } from '../components/StatCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { errorMessage } from '../utils/formatters.js';

export const DashboardPage = () => {
  const { isAdmin, user } = useAuth();
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ projectId: '', userId: '' });
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
      const [statsResponse, projectsResponse, usersResponse] = await Promise.all([
        getDashboardStats(activeFilters),
        getProjects(),
        isAdmin ? getUsers() : Promise.resolve({ data: { users: [] } })
      ]);

      setStats(statsResponse.data.stats);
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

  const handleCreateProject = async (payload) => {
    setIsSubmitting(true);
    try {
      await createProject(payload);
      await loadData();
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Delete this project and all related tasks?')) return;

    try {
      await deleteProject(projectId);
      await loadData();
    } catch (requestError) {
      setError(errorMessage(requestError));
    }
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-ink">Dashboard</h2>
          <p className="mt-1 text-sm text-slate-500">{isAdmin ? 'All project activity' : `Assigned activity for ${user.name}`}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
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
        </div>
      </div>

      {error && <div className="rounded border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total tasks" value={isLoading ? '-' : stats?.totalTasks ?? 0} accent="border-slate-500" />
        <StatCard label="Completed" value={isLoading ? '-' : stats?.completedTasks ?? 0} accent="border-emerald-500" />
        <StatCard label="Pending" value={isLoading ? '-' : stats?.pendingTasks ?? 0} accent="border-amber-500" />
        <StatCard label="Overdue" value={isLoading ? '-' : stats?.overdueTasks ?? 0} accent="border-rose-500" />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="border border-line bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-line px-4 py-3">
            <FolderPlus className="h-4 w-4 text-emerald-700" />
            <h3 className="font-semibold text-ink">Projects</h3>
          </div>
          <div className="divide-y divide-line">
            {projects.map((project) => (
              <div key={project._id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Link className="font-semibold text-ink hover:text-emerald-700" to={`/projects/${project._id}`}>
                    {project.name}
                  </Link>
                  <p className="mt-1 text-sm text-slate-500">{project.description || 'No description'}</p>
                  <p className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                    {project.members?.length || 0} members
                  </p>
                </div>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => handleDeleteProject(project._id)}
                    className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded border border-line text-slate-500 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                    aria-label={`Delete ${project.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            {!projects.length && <p className="p-4 text-sm text-slate-500">No projects yet.</p>}
          </div>
        </div>

        {isAdmin && <ProjectForm users={users} onSubmit={handleCreateProject} isSubmitting={isSubmitting} />}
      </section>
    </div>
  );
};
