import { useState, useMemo } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { TaskCard } from '../components/TaskCard';
import { TaskModal } from '../components/TaskModal';

export const Tasks = () => {
  const { tasks } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All'); // All, Pending, Completed

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (task.description || '').toLowerCase().includes(searchQuery.toLowerCase());

      const isCompleted = task.status === 'Completed';
      const matchesFilter = filter === 'All' ? true :
                            filter === 'Completed' ? isCompleted :
                            !isCompleted;

      return matchesSearch && matchesFilter;
    });
  }, [tasks, searchQuery, filter]);

  const handleOpenModal = (task = null) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text mb-2">My Tasks</h1>
          <p className="text-textMuted">Manage and track your tasks</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="btn btn-primary whitespace-nowrap"
        >
          <Plus size={20} />
          Create Task
        </button>
      </header>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" size={18} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="text-textMuted hidden sm:block" size={18} />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input w-full sm:w-auto appearance-none pr-10 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_1rem_center] bg-[length:1.2em]"
          >
            <option value="All">All Tasks</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="card text-center py-12">
            <div className="w-16 h-16 bg-surface border border-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-textMuted" size={24} />
            </div>
            <h3 className="text-lg font-medium text-text mb-2">No tasks found</h3>
            <p className="text-textMuted">
              Try adjusting your search or filters, or create a new task.
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard key={task._id} task={task} onEdit={handleOpenModal} />
          ))
        )}
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingTask={editingTask}
      />
    </div>
  );
};
