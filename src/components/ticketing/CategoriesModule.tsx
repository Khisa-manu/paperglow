import React, { useState } from 'react';
import {
  FolderTree,
  Plus,
  Clock,
  ShieldCheck,
  TrendingUp,
  Inbox,
  X,
  Edit2,
  Trash2,
} from 'lucide-react';
import { TicketCategory, Ticket, StaffMember } from '../../types/ticketing';

interface CategoriesModuleProps {
  categories: TicketCategory[];
  tickets: Ticket[];
  staffMembers: StaffMember[];
  onAddCategory: (newCat: Omit<TicketCategory, 'id' | 'ticketCount'>) => void;
  onUpdateCategory: (id: string, updated: Partial<TicketCategory>) => void;
  onNavigateTicketsByCategory: (categoryId: string) => void;
}

export const CategoriesModule: React.FC<CategoriesModuleProps> = ({
  categories,
  tickets,
  staffMembers,
  onAddCategory,
  onUpdateCategory,
  onNavigateTicketsByCategory,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<TicketCategory | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('red');
  const [slaResponseHours, setSlaResponseHours] = useState('2');
  const [slaResolutionHours, setSlaResolutionHours] = useState('12');
  const [defaultAssigneeId, setDefaultAssigneeId] = useState('');

  const handleOpenAdd = () => {
    setName('');
    setDescription('');
    setColor('red');
    setSlaResponseHours('2');
    setSlaResolutionHours('12');
    setDefaultAssigneeId('');
    setEditingCategory(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (cat: TicketCategory) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description);
    setColor(cat.color);
    setSlaResponseHours(cat.slaResponseHours.toString());
    setSlaResolutionHours(cat.slaResolutionHours.toString());
    setDefaultAssigneeId(cat.defaultAssigneeId || '');
    setIsAddModalOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingCategory) {
      onUpdateCategory(editingCategory.id, {
        name,
        description,
        color,
        slaResponseHours: parseFloat(slaResponseHours) || 2,
        slaResolutionHours: parseFloat(slaResolutionHours) || 12,
        defaultAssigneeId: defaultAssigneeId || undefined,
      });
    } else {
      onAddCategory({
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description,
        color,
        slaResponseHours: parseFloat(slaResponseHours) || 2,
        slaResolutionHours: parseFloat(slaResolutionHours) || 12,
        defaultAssigneeId: defaultAssigneeId || undefined,
      });
    }

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-white font-['Poppins']">
            Ticket Categories & Routing Rules
          </h2>
          <p className="text-xs text-neutral-500">
            Define specialized inquiry channels, default staff assignees, and SLA target commitments
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-md shadow-xs transition-colors shrink-0 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      {/* Category Performance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const categoryTickets = tickets.filter((t) => t.categoryId === cat.id);
          const openCount = categoryTickets.filter((t) => t.status !== 'resolved' && t.status !== 'closed').length;
          const resolvedCount = categoryTickets.filter((t) => t.status === 'resolved' || t.status === 'closed').length;
          const overdueCount = categoryTickets.filter((t) => t.isOverdue || t.isResponseOverdue).length;

          const defaultStaff = staffMembers.find((s) => s.id === cat.defaultAssigneeId);

          return (
            <div
              key={cat.id}
              className="p-5 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-lg space-y-4 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5 line-clamp-2">{cat.description}</p>
                  </div>
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
                    title="Edit Category"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Routing & SLA Parameters */}
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div className="p-2 bg-neutral-50 dark:bg-[#181c24] rounded">
                    <span className="text-neutral-400 block text-[10px]">Response Target</span>
                    <span className="font-semibold text-neutral-900 dark:text-white tabular-nums">
                      {cat.slaResponseHours}h Max
                    </span>
                  </div>
                  <div className="p-2 bg-neutral-50 dark:bg-[#181c24] rounded">
                    <span className="text-neutral-400 block text-[10px]">Resolution Target</span>
                    <span className="font-semibold text-neutral-900 dark:text-white tabular-nums">
                      {cat.slaResolutionHours}h Max
                    </span>
                  </div>
                </div>

                {/* Default Assignee */}
                <div className="text-[11px] text-neutral-500">
                  <span>Default Routing: </span>
                  <strong className="text-neutral-800 dark:text-neutral-200">
                    {defaultStaff ? defaultStaff.name : 'Unassigned Queue'}
                  </strong>
                </div>
              </div>

              {/* Performance Stats Footer */}
              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3 text-[11px]">
                  <span>
                    Open: <strong className="text-red-600 tabular-nums">{openCount}</strong>
                  </span>
                  <span>
                    Resolved: <strong className="text-emerald-600 tabular-nums">{resolvedCount}</strong>
                  </span>
                  {overdueCount > 0 && (
                    <span className="text-amber-600 font-semibold">
                      {overdueCount} Overdue
                    </span>
                  )}
                </div>

                <button
                  onClick={() => onNavigateTicketsByCategory(cat.id)}
                  className="text-xs font-semibold text-red-600 hover:text-red-700 cursor-pointer"
                >
                  View Queue →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Category Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-lg max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                {editingCategory ? 'Edit Ticket Category' : 'Create New Category'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-500 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Database & Backup Inquiries"
                  className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-[#181c24] border border-neutral-200 dark:border-neutral-800 rounded focus:outline-none focus:ring-1 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-neutral-500 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Scope and purpose of this issue category..."
                  className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-[#181c24] border border-neutral-200 dark:border-neutral-800 rounded focus:outline-none focus:ring-1 focus:ring-red-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-500 mb-1">First Response SLA (Hours)</label>
                  <input
                    type="number"
                    min="1"
                    max="72"
                    value={slaResponseHours}
                    onChange={(e) => setSlaResponseHours(e.target.value)}
                    className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-[#181c24] border border-neutral-200 dark:border-neutral-800 rounded focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-500 mb-1">Resolution SLA (Hours)</label>
                  <input
                    type="number"
                    min="1"
                    max="168"
                    value={slaResolutionHours}
                    onChange={(e) => setSlaResolutionHours(e.target.value)}
                    className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-[#181c24] border border-neutral-200 dark:border-neutral-800 rounded focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-500 mb-1">Default Staff Assignee</label>
                <select
                  value={defaultAssigneeId}
                  onChange={(e) => setDefaultAssigneeId(e.target.value)}
                  className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-[#181c24] border border-neutral-200 dark:border-neutral-800 rounded focus:outline-none"
                >
                  <option value="">None (Unassigned General Pool)</option>
                  {staffMembers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded cursor-pointer shadow-xs"
                >
                  {editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
