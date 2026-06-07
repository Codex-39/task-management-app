import { Edit2, Trash2, CheckCircle, Circle, Calendar, Flag } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { format } from 'date-fns';
import clsx from 'clsx';

export const TaskCard = ({ task, onEdit }) => {
  const { toggleTaskStatus, deleteTask } = useTasks();

  const isCompleted = task.status === 'Completed';

  const priorityColors = {
    High: 'text-danger bg-danger/10 border-danger/20',
    Medium: 'text-warning bg-warning/10 border-warning/20',
    Low: 'text-success bg-success/10 border-success/20',
  };

  return (
    <div className={clsx(
      'card transition-all duration-300 group',
      isCompleted ? 'opacity-60 grayscale-[0.5]' : 'hover:shadow-md hover:border-white/10'
    )}>
      <div className="flex items-start gap-4">
        <button
          onClick={() => toggleTaskStatus(task._id)}
          className={clsx(
            'mt-1 flex-shrink-0 transition-colors',
            isCompleted ? 'text-success' : 'text-textMuted hover:text-primary'
          )}
        >
          {isCompleted ? <CheckCircle size={24} /> : <Circle size={24} />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h3 className={clsx(
              'text-lg font-semibold truncate transition-all',
              isCompleted ? 'line-through text-textMuted' : 'text-text'
            )}>
              {task.title}
            </h3>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onEdit(task)}
                className="p-1.5 text-textMuted hover:text-primary rounded-lg hover:bg-primary/10 transition-colors"
                title="Edit Task"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => deleteTask(task._id)}
                className="p-1.5 text-textMuted hover:text-danger rounded-lg hover:bg-danger/10 transition-colors"
                title="Delete Task"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <p className="text-textMuted text-sm mb-4 line-clamp-2">
            {task.description}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            {task.dueDate && (
              <div className="flex items-center gap-1.5 text-textMuted bg-surface px-2.5 py-1 rounded-md border border-white/5">
                <Calendar size={14} />
                {format(new Date(task.dueDate), 'MMM d, yyyy')}
              </div>
            )}
            <div className={clsx(
              'flex items-center gap-1.5 px-2.5 py-1 rounded-md border font-medium',
              priorityColors[task.priority]
            )}>
              <Flag size={14} />
              {task.priority}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
