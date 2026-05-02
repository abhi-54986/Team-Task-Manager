import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, UserMinus, UserPlus } from 'lucide-react';
import { addProjectMember, getProject, getProjects, removeProjectMember } from '../api/projectApi.js';
import { createTask, deleteTask, updateTaskStatus } from '../api/taskApi.js';
import { getUsers } from '../api/userApi.js';
import { TaskForm } from '../components/TaskForm.jsx';
import { TaskRow } from '../components/TaskRow.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { errorMessage } from '../utils/formatters.js';

export const ProjectPage = () => {
  const { projectId } = useParams();
  const { isAdmin } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const memberIds = useMemo(() => project?.members?.map((member) => member._id) || [], [project]);
  const availableUsers = users.filter((user) => !memberIds.includes(user._id));

  const loadData = async () => {
    setError('');
    setIsLoading(true);

    try {
      const [projectResponse, projectsResponse, usersResponse] = await Promise.all([
        getProject(projectId),
        getProjects(),
        isAdmin ? getUsers() : Promise.resolve({ data: { users: [] } })
      ]);

      setProject(projectResponse.data.project);
      setTasks(projectResponse.data.tasks);
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
  }, [projectId, isAdmin]);

  const handleAddMember = async (event) => {
    event.preventDefault();
    if (!selectedUserId) return;

    try {
      await addProjectMember(projectId, selectedUserId);
      setSelectedUserId('');
      await loadData();
    } catch (requestError) {
      setError(errorMessage(requestError));
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Remove this member and their tasks from the project?')) return;

    try {
      await removeProjectMember(projectId, userId);
      await loadData();
    } catch (requestError) {
      setError(errorMessage(requestError));
    }
  };

  const handleCreateTask = async (payload) => {
    setIsSubmitting(true);
    try {
      await createTask({ ...payload, projectId });
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

  if (isLoading) {
    return <p className="text-sm text-slate-500">Loading project...</p>;
  }

  return (
    <div className="grid gap-6">
      <div>
        <Link className="focus-ring inline-flex items-center gap-2 rounded text-sm font-medium text-emerald-700" to="/dashboard">
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>
        <div className="mt-4">
          <h2 className="text-2xl font-semibold text-ink">{project?.name}</h2>
          <p className="mt-1 max-w-3xl text-sm text-slate-500">{project?.description || 'No description'}</p>
        </div>
      </div>

      {error && <div className="rounded border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}

      <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="overflow-hidden border border-line bg-white shadow-sm">
          <div className="border-b border-line px-4 py-3">
            <h3 className="font-semibold text-ink">Project tasks</h3>
          </div>
          {tasks.length ? (
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
            <p className="p-4 text-sm text-slate-500">No tasks in this project yet.</p>
          )}
        </div>

        <aside className="grid gap-4">
          <div className="border border-line bg-white p-4 shadow-sm">
            <h3 className="font-semibold text-ink">Members</h3>
            <div className="mt-4 grid gap-2">
              {project?.members?.map((member) => (
                <div key={member._id} className="flex items-center justify-between rounded border border-line px-3 py-2">
                  <div>
                    <p className="text-sm font-medium text-ink">{member.name}</p>
                    <p className="text-xs text-slate-500">{member.role}</p>
                  </div>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(member._id)}
                      className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded text-slate-500 hover:bg-rose-50 hover:text-rose-700"
                      aria-label={`Remove ${member.name}`}
                    >
                      <UserMinus className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {isAdmin && (
              <form onSubmit={handleAddMember} className="mt-4 flex gap-2">
                <select
                  className="focus-ring min-w-0 flex-1 rounded border border-line px-3 py-2 text-sm"
                  value={selectedUserId}
                  onChange={(event) => setSelectedUserId(event.target.value)}
                >
                  <option value="">Add member</option>
                  {availableUsers.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded bg-emerald-600 text-white hover:bg-emerald-700"
                  aria-label="Add member"
                >
                  <UserPlus className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>

          {isAdmin && (
            <TaskForm
              projects={projects}
              users={users}
              onSubmit={handleCreateTask}
              isSubmitting={isSubmitting}
              selectedProjectId={projectId}
            />
          )}
        </aside>
      </section>
    </div>
  );
};
