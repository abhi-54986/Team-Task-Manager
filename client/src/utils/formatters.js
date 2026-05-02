export const formatDate = (value) =>
  new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(value));

export const isOverdue = (task) => task.status !== 'Done' && new Date(task.deadline) < new Date();

export const errorMessage = (error) => {
  const data = error.response?.data;

  if (Array.isArray(data?.details) && data.details.length > 0) {
    return [...new Set(data.details.map((detail) => detail.msg).filter(Boolean))].join('. ');
  }

  return data?.message || error.message || 'Something went wrong';
};
