import React, { useState } from 'react';
import {
  CheckSquare,
  Search,
  Plus,
  Clock,
  User,
  Briefcase,
  AlertTriangle,
  CheckCircle2,
  X,
  Filter,
} from 'lucide-react';
import {
  LegalTask,
  LegalMatter,
  LegalStaff,
  TaskPriority,
  TaskStatus,
} from '../../types/legalPractice';

interface TasksModuleProps {
  tasks: LegalTask[];
  matters: LegalMatter[];
  staff: LegalStaff[];
  onAddTask: (task: Omit<LegalTask, 'id' | 'createdAt'>) => void;
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TasksModule: React.FC<TasksModuleProps> = ({
  tasks,
  matters,
  staff,
  onAddTask,
  onUpdateTaskStatus,
  onDeleteTask,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form State
  const [matterId, setMatterId] = useState(matters[0]?.id || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedStaffId, setAssignedStaffId] = useState(staff[0]?.id || '');
  const [priority, setPriority] = useState<TaskPriority>('high');
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const matter = matters.find((m) => m.id === matterId);
    const assignedStaff = staff.find((s) => s.id === assignedStaffId) || staff[0];

    onAddTask({
      matterId: matter?.id,
      matterNumber: matter?.matterNumber,
      matterTitle: matter?.title,
      title,
      description,
      assignedStaffId: assignedStaff.id,
      assignedStaffName: assignedStaff.name,
      priority,
      dueDate,
      status: 'todo',
    });

    setIsAddOpen(false);
    setTitle('');
    setDescription('');
  };

  const filteredTasks = tasks.filter((t) => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.assignedStaffName.toLowerCase().includes(q) ||
        (t.matterNumber && t.matterNumber.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-['Poppins']">
            Litigation &amp; Transaction Task Management
          </h2>
          <p className="text-xs text-neutral-500">
            Allocate legal research, bench bundle indexing, process service, and client consultation deliverables across advocates and clerks.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create Practice Task</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search tasks, staff or matters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
            >
              <option value="all">All Task Statuses ({tasks.length})</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="under_review">Under Review</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.map((t) => (
          <div
            key={t.id}
            className={`p-4 rounded-xl border bg-white dark:bg-[#12151b] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
              t.status === 'completed'
                ? 'border-neutral-200 dark:border-neutral-800 opacity-60'
                : t.priority === 'urgent'
                ? 'border-red-200 dark:border-red-900/60'
                : 'border-neutral-200 dark:border-neutral-800'
            }`}
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                    t.priority === 'urgent'
                      ? 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-400'
                      : t.priority === 'high'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400'
                      : 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300'
                  }`}
                >
                  {t.priority}
                </span>

                {t.matterNumber && (
                  <span className="font-mono text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded border border-red-200 dark:border-red-900">
                    {t.matterNumber}
                  </span>
                )}

                <h3
                  className={`text-sm font-bold ${
                    t.status === 'completed' ? 'line-through text-neutral-400' : 'text-neutral-900 dark:text-white'
                  }`}
                >
                  {t.title}
                </h3>
              </div>

              {t.description && (
                <p className="text-xs text-neutral-500 leading-relaxed max-w-2xl">{t.description}</p>
              )}

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-neutral-500 pt-1">
                <span>
                  Assignee: <strong className="text-neutral-800 dark:text-neutral-200">{t.assignedStaffName}</strong>
                </span>
                {t.matterTitle && (
                  <span>
                    Matter: <strong className="text-neutral-700 dark:text-neutral-300">{t.matterTitle}</strong>
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3 shrink-0 self-end md:self-auto">
              <div className="text-right">
                <span className="font-mono font-bold text-xs text-neutral-900 dark:text-white block">
                  Due: {t.dueDate}
                </span>
                <span className="text-[10px] text-neutral-400">Created: {t.createdAt}</span>
              </div>

              <select
                value={t.status}
                onChange={(e) => onUpdateTaskStatus(t.id, e.target.value as TaskStatus)}
                className="px-2.5 py-1.5 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 cursor-pointer"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="under_review">Under Review</option>
                <option value="completed">Completed</option>
              </select>

              <button
                onClick={() => onDeleteTask(t.id)}
                className="p-1.5 text-neutral-400 hover:text-red-600 rounded-md transition-colors cursor-pointer"
                title="Delete Task"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {filteredTasks.length === 0 && (
          <div className="py-12 text-center text-xs text-neutral-500 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl space-y-2">
            <CheckSquare className="w-8 h-8 text-neutral-400 mx-auto" />
            <p>No tasks found for this filter criteria.</p>
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#14171d] border border-neutral-200 dark:border-neutral-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white font-['Poppins']">
                Create Practice Task / Deliverable
              </h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Linked Matter File
                </label>
                <select
                  value={matterId}
                  onChange={(e) => setMatterId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                >
                  <option value="">General Administrative Task (No specific matter)</option>
                  {matters.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.matterNumber}: {m.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Draft Written Submissions on Injunction or File at Registry"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Detailed Instructions
                </label>
                <textarea
                  rows={2}
                  placeholder="Specify case references, court rules or documents to review..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Assigned Advocate / Staff *
                  </label>
                  <select
                    value={assignedStaffId}
                    onChange={(e) => setAssignedStaffId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                  >
                    {staff.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Due Date *
                </label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs cursor-pointer"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
