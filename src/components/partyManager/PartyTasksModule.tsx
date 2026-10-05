import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Clock,
  User,
  AlertCircle,
  CheckCircle2,
  Filter,
  ArrowRight,
  X,
  Building,
  Flag,
} from 'lucide-react';
import { PartyTask, PartyDepartment, PartyBranch } from '../../types/partyManager';

interface PartyTasksModuleProps {
  tasks: PartyTask[];
  departments: PartyDepartment[];
  branches: PartyBranch[];
  onAddTask: (task: PartyTask) => void;
  onUpdateTask: (task: PartyTask) => void;
}

export const PartyTasksModule: React.FC<PartyTasksModuleProps> = ({
  tasks,
  departments,
  branches,
  onAddTask,
  onUpdateTask,
}) => {
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Task form state
  const [taskForm, setTaskForm] = useState<{
    title: string;
    description: string;
    assignedTo: string;
    department: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    dueDate: string;
  }>({
    title: '',
    description: '',
    assignedTo: 'Adv. Kenneth Omondi Otieno',
    department: 'dept-sec',
    priority: 'high',
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    const newTask: PartyTask = {
      id: `tsk-${Date.now()}`,
      title: taskForm.title,
      description: taskForm.description,
      assignedTo: taskForm.assignedTo,
      department: taskForm.department,
      priority: taskForm.priority,
      status: 'todo',
      dueDate: taskForm.dueDate,
      createdAt: new Date().toISOString().split('T')[0],
    };
    onAddTask(newTask);
    setIsCreateModalOpen(false);
    setTaskForm({
      title: '',
      description: '',
      assignedTo: 'Adv. Kenneth Omondi Otieno',
      department: 'dept-sec',
      priority: 'high',
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    });
  };

  const advanceTaskStatus = (task: PartyTask) => {
    const nextStatusMap: Record<PartyTask['status'], PartyTask['status']> = {
      todo: 'in_progress',
      in_progress: 'review',
      review: 'completed',
      completed: 'todo',
    };
    const nextStatus = nextStatusMap[task.status];
    onUpdateTask({
      ...task,
      status: nextStatus,
      completedAt: nextStatus === 'completed' ? new Date().toISOString().split('T')[0] : undefined,
    });
  };

  const filteredTasks = tasks.filter((t) => {
    const matchPriority = filterPriority === 'all' || t.priority === filterPriority;
    const matchStatus = filterStatus === 'all' || t.status === filterStatus;
    return matchPriority && matchStatus;
  });

  const statuses: Array<{ id: PartyTask['status']; label: string; color: string }> = [
    { id: 'todo', label: 'To Do / Backlog', color: 'border-slate-300' },
    { id: 'in_progress', label: 'In Progress', color: 'border-amber-400' },
    { id: 'review', label: 'Executive Review', color: 'border-blue-400' },
    { id: 'completed', label: 'Completed & Certified', color: 'border-emerald-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-red-600" />
            Secretariat Workflows & Compliance Tasks
          </h2>
          <p className="text-xs text-slate-500">
            Accountability tracking for ORPP filings, branch audits, and statutory deliverables
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Assign New Task</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-3 text-xs bg-white p-3 rounded-xl border border-slate-200">
        <span className="font-semibold text-slate-700 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5 text-slate-400" /> Filter:
        </span>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden"
        >
          <option value="all">All Priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden"
        >
          <option value="all">All Workflow Stages</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="review">Review</option>
          <option value="completed">Completed</option>
        </select>

        <span className="text-slate-400 ml-auto text-[11px]">
          Showing {filteredTasks.length} of {tasks.length} tasks
        </span>
      </div>

      {/* Kanban Column View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statuses.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.id);

          return (
            <div
              key={col.id}
              className="bg-slate-50/70 border border-slate-200 rounded-xl p-3.5 space-y-3 flex flex-col min-h-[400px]"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-800">{col.label}</span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-white text-slate-700 border border-slate-200 rounded-full">
                  {colTasks.length}
                </span>
              </div>

              <div className="space-y-2.5 flex-1">
                {colTasks.map((task) => {
                  const isUrgent = task.priority === 'urgent';
                  const isHigh = task.priority === 'high';

                  return (
                    <div
                      key={task.id}
                      className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all space-y-2.5 text-xs"
                    >
                      <div className="flex items-start justify-between gap-1.5">
                        <span
                          className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                            isUrgent
                              ? 'bg-red-100 text-red-800 border border-red-200'
                              : isHigh
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {task.priority}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Due: {task.dueDate}
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-900 leading-snug">{task.title}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2">{task.description}</p>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                        <span className="truncate max-w-[120px] font-medium text-slate-700">
                          {task.assignedTo}
                        </span>
                        <button
                          onClick={() => advanceTaskStatus(task)}
                          className="text-[10px] font-semibold text-red-600 hover:text-red-700 flex items-center gap-0.5 shrink-0 hover:underline"
                          title="Advance stage"
                        >
                          <span>Advance</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {colTasks.length === 0 && (
                  <div className="py-8 text-center text-xs text-slate-400">
                    No tasks in this lane
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Task Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Create Secretariat Task
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prepare Form 4 Annual Return for ORPP"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Detail instructions, deliverables, requirements..."
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned Officer</label>
                  <input
                    type="text"
                    required
                    value={taskForm.assignedTo}
                    onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={taskForm.department}
                    onChange={(e) => setTaskForm({ ...taskForm, department: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) =>
                      setTaskForm({
                        ...taskForm,
                        priority: e.target.value as 'low' | 'medium' | 'high' | 'urgent',
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                  >
                    <option value="urgent">Urgent (Statutory Deadline)</option>
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Routine</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={taskForm.dueDate}
                    onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
                >
                  Create & Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
