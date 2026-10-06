import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  DollarSign,
  Tag,
  Search,
} from 'lucide-react';
import {
  ServiceItem,
  ServiceCategory,
  StaffMember,
} from '../../types/booking';

interface ServicesModuleProps {
  services: ServiceItem[];
  categories: ServiceCategory[];
  staff: StaffMember[];
  onAddService: (newService: Omit<ServiceItem, 'id'>) => void;
  onUpdateService: (id: string, updated: Partial<ServiceItem>) => void;
  onDeleteService: (id: string) => void;
}

export const ServicesModule: React.FC<ServicesModuleProps> = ({
  services,
  categories,
  staff,
  onAddService,
  onUpdateService,
  onDeleteService,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [priceKes, setPriceKes] = useState('2500');
  const [durationMinutes, setDurationMinutes] = useState('45');
  const [description, setDescription] = useState('');
  const [assignedStaffIds, setAssignedStaffIds] = useState<string[]>([]);
  const [bufferMinutes, setBufferMinutes] = useState('15');

  const filteredServices = services.filter((s) => {
    if (selectedCategory !== 'all' && s.categoryId !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!s.name.toLowerCase().includes(q) && !s.description.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const handleOpenAdd = () => {
    setName('');
    setCategoryId(categories[0]?.id || '');
    setPriceKes('2500');
    setDurationMinutes('45');
    setDescription('');
    setAssignedStaffIds(staff.map((st) => st.id));
    setBufferMinutes('15');
    setEditingService(null);
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (srv: ServiceItem) => {
    setEditingService(srv);
    setName(srv.name);
    setCategoryId(srv.categoryId);
    setPriceKes(srv.priceKes.toString());
    setDurationMinutes(srv.durationMinutes.toString());
    setDescription(srv.description);
    setAssignedStaffIds(srv.assignedStaffIds);
    setBufferMinutes((srv.bufferMinutes || 15).toString());
    setIsCreateModalOpen(true);
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const cat = categories.find((c) => c.id === categoryId) || categories[0];

    if (editingService) {
      onUpdateService(editingService.id, {
        name,
        categoryId: cat.id,
        categoryName: cat.name,
        priceKes: parseInt(priceKes) || 0,
        durationMinutes: parseInt(durationMinutes) || 30,
        description,
        assignedStaffIds,
        bufferMinutes: parseInt(bufferMinutes) || 0,
      });
    } else {
      onAddService({
        name,
        categoryId: cat.id,
        categoryName: cat.name,
        priceKes: parseInt(priceKes) || 0,
        durationMinutes: parseInt(durationMinutes) || 30,
        description,
        assignedStaffIds,
        isActive: true,
        bufferMinutes: parseInt(bufferMinutes) || 0,
      });
    }

    setIsCreateModalOpen(false);
  };

  const toggleStaffAssignment = (stId: string) => {
    setAssignedStaffIds((prev) =>
      prev.includes(stId) ? prev.filter((id) => id !== stId) : [...prev, stId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 sm:p-5 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-['Poppins']">
            Service Menu &amp; Offerings
          </h2>
          <p className="text-xs text-neutral-500">
            Configure bookable service tariffs in KES, standard durations, buffer turnarounds, and staff assignments.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
            }`}
          >
            All Categories ({services.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-64 relative">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search service title..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 dark:bg-[#181c24] border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-red-500"
          />
        </div>
      </div>

      {/* Service Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map((srv) => (
          <div
            key={srv.id}
            className={`p-5 rounded-xl border bg-white dark:bg-[#12151b] transition-all flex flex-col justify-between shadow-xs ${
              srv.isActive
                ? 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                : 'border-neutral-200/50 dark:border-neutral-800/50 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200/60 dark:border-red-900/60">
                  {srv.categoryName}
                </span>

                <button
                  onClick={() => onUpdateService(srv.id, { isActive: !srv.isActive })}
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full cursor-pointer ${
                    srv.isActive
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                      : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400'
                  }`}
                >
                  {srv.isActive ? 'Active' : 'Inactive'}
                </button>
              </div>

              <h3 className="text-sm font-bold text-neutral-900 dark:text-white font-['Poppins']">
                {srv.name}
              </h3>
              <p className="text-xs text-neutral-500 line-clamp-2 mt-1 leading-relaxed">
                {srv.description}
              </p>

              {/* Price & Duration Badges */}
              <div className="flex items-center space-x-3 mt-4 text-xs font-mono">
                <div className="text-base font-bold text-neutral-900 dark:text-white">
                  KES {srv.priceKes.toLocaleString()}
                </div>
                <div className="flex items-center space-x-1 text-neutral-500">
                  <Clock className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{srv.durationMinutes} mins</span>
                </div>
                {srv.bufferMinutes ? (
                  <span className="text-[10px] text-neutral-400">
                    (+{srv.bufferMinutes}m buffer)
                  </span>
                ) : null}
              </div>

              {/* Assigned Staff specialists */}
              <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <div className="text-[11px] font-medium text-neutral-500 mb-1.5">
                  Available Specialists:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {srv.assignedStaffIds.map((sId) => {
                    const st = staff.find((s) => s.id === sId);
                    if (!st) return null;
                    return (
                      <span
                        key={st.id}
                        className="text-[10px] px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center space-x-1"
                      >
                        <User className="w-2.5 h-2.5 text-neutral-400" />
                        <span>{st.name.split(' ')[0]}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Card Actions */}
            <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <button
                onClick={() => handleOpenEdit(srv)}
                className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-red-600 flex items-center space-x-1 cursor-pointer"
              >
                <Edit2 className="w-3 h-3" />
                <span>Edit Service</span>
              </button>
              <button
                onClick={() => {
                  if (confirm(`Delete service "${srv.name}"?`)) onDeleteService(srv.id);
                }}
                className="text-neutral-400 hover:text-red-600 p-1 cursor-pointer"
                title="Delete Service"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Service Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#14171d] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 max-w-lg w-full space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white font-['Poppins']">
              {editingService ? 'Edit Service' : 'Create New Service'}
            </h3>

            <form onSubmit={handleSaveSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Executive Beard Grooming & Wash"
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Price (KES) *
                  </label>
                  <input
                    type="number"
                    required
                    value={priceKes}
                    onChange={(e) => setPriceKes(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Duration (Minutes) *
                  </label>
                  <input
                    type="number"
                    required
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Buffer Turnaround (Minutes)
                  </label>
                  <input
                    type="number"
                    value={bufferMinutes}
                    onChange={(e) => setBufferMinutes(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Outline what is included in this service session..."
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Assigned Staff Specialists
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                  {staff.map((st) => (
                    <label key={st.id} className="flex items-center space-x-2 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={assignedStaffIds.includes(st.id)}
                        onChange={() => toggleStaffAssignment(st.id)}
                        className="rounded border-neutral-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="truncate">{st.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs"
                >
                  {editingService ? 'Update Service' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
