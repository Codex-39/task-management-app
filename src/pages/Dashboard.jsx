import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { StatCard } from '../components/StatCard';
import { ClipboardList, CheckCircle2, Clock } from 'lucide-react';
import { format } from 'date-fns';

export const Dashboard = () => {
  const { tasks } = useTasks();
  const { user } = useAuth();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const pendingTasks = totalTasks - completedTasks;

  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-text mb-2">
          Dashboard
        </h1>
        <p className="text-textMuted">
          Welcome back, {user?.name}! Here's your task overview.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Tasks"
          value={totalTasks}
          icon={ClipboardList}
          colorClass="bg-primary/20 text-primary"
        />
        <StatCard
          title="Completed Tasks"
          value={completedTasks}
          icon={CheckCircle2}
          colorClass="bg-success/20 text-success"
        />
        <StatCard
          title="Pending Tasks"
          value={pendingTasks}
          icon={Clock}
          colorClass="bg-warning/20 text-warning"
        />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-text mb-4">Recent Tasks</h2>
        <div className="card">
          {recentTasks.length === 0 ? (
            <p className="text-textMuted text-center py-8">No tasks found. Create one!</p>
          ) : (
            <div className="divide-y divide-white/5">
              {recentTasks.map((task) => {
                const isCompleted = task.status === 'Completed';
                return (
                  <div key={task._id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between">
                    <div>
                      <h4 className={`font-medium ${isCompleted ? 'line-through text-textMuted' : 'text-text'}`}>
                        {task.title}
                      </h4>
                      {task.dueDate && (
                        <p className="text-sm text-textMuted">
                          Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
                        </p>
                      )}
                    </div>
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                      isCompleted
                        ? 'bg-success/10 text-success'
                        : 'bg-warning/10 text-warning'
                    }`}>
                      {isCompleted ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
