import clsx from 'clsx';

export const StatCard = ({ title, value, icon: Icon, colorClass }) => {
  return (
    <div className="card glass hover:-translate-y-1 transition-transform duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-textMuted mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-text">{value}</h3>
        </div>
        <div className={clsx('p-3 rounded-xl', colorClass)}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );
};
