import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export const TaskModal = ({ isOpen, onClose, editingTask = null }) => {
  const { addTask, updateTask } = useTasks();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'Medium',
  });

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title,
        description: editingTask.description || '',
        dueDate: editingTask.dueDate
          ? new Date(editingTask.dueDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        priority: editingTask.priority,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        dueDate: new Date().toISOString().split('T')[0],
        priority: 'Medium',
      });
    }
  }, [editingTask, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert date string back to ISO string for consistency
    const submitData = {
      ...formData,
      dueDate: new Date(formData.dueDate).toISOString(),
    };

    try {
      if (editingTask) {
        await updateTask(editingTask._id, submitData);
      } else {
        await addTask(submitData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="bg-surface border border-white/10 rounded-2xl w-full max-w-md shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-xl font-semibold text-text">
            {editingTask ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-textMuted hover:text-text hover:bg-white/5 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-textMuted mb-1.5">
              Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input"
              placeholder="E.g., Complete project proposal"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-textMuted mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input resize-none"
              placeholder="Add details about this task..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-textMuted mb-1.5">
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-textMuted mb-1.5">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="input appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_1rem_center] bg-[length:1.2em]"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn btn-primary"
            >
              {editingTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
