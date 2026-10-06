import React, { useState, useMemo } from 'react';
import { MedicalService, ClinicProfile } from '../../types/clinicManager';
import {
  Activity,
  Plus,
  Search,
  Filter,
  Clock,
  DollarSign,
  Tag,
  CheckCircle2,
  XCircle,
  Stethoscope,
} from 'lucide-react';

interface ServicesModuleProps {
  services: MedicalService[];
  clinic: ClinicProfile;
  onAddService: (service: Omit<MedicalService, 'id'>) => void;
  onToggleServiceActive: (serviceId: string) => void;
}

export const ServicesModule: React.FC<ServicesModuleProps> = ({
  services,
  clinic,
  onAddService,
  onToggleServiceActive,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // New Service Form
  const [code, setCode] = useState('MED-' + Math.floor(100 + Math.random() * 900));
  const [name, setName] = useState('');
  const [category, setCategory] = useState<MedicalService['category']>('Laboratory');
  const [priceKes, setPriceKes] = useState<number>(1500);
  const [defaultPractitionerRole, setDefaultPractitionerRole] = useState('Lab Technologist');
  const [turnaroundTime, setTurnaroundTime] = useState('30 mins');
  const [description, setDescription] = useState('');

  const categories = ['all', 'Consultation', 'Laboratory', 'Diagnostics', 'Nursing & Procedures', 'Dispensary'];

  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const matchesCat = categoryFilter === 'all' || s.category === categoryFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q);

      return matchesCat && matchesSearch;
    });
  }, [services, categoryFilter, searchQuery]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddService({
      code,
      name: name.trim(),
      category,
      priceKes,
      defaultPractitionerRole,
      turnaroundTime,
      description: description.trim(),
      active: true,
    });

    setIsAddModalOpen(false);
    setName('');
    setDescription('');
    setCode('MED-' + Math.floor(100 + Math.random() * 900));
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h2 className="text-xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 flex items-center space-x-2">
            <Activity className="w-5 h-5 text-red-600" />
            <span>Clinical Services &amp; Tariff Price List</span>
          </h2>
          <p className="text-xs text-neutral-500">
            Catalog of outpatient diagnostic investigations, procedures, consultations and nursing tariffs in KES
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search service, code, test..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-red-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer capitalize ${
                categoryFilter === cat
                  ? 'bg-red-600 text-white font-semibold shadow-2xs'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map((srv) => (
          <div
            key={srv.id}
            className={`p-4 rounded-xl border transition-all text-xs flex flex-col justify-between space-y-3 ${
              srv.active
                ? 'bg-white dark:bg-[#11141a] border-neutral-200 dark:border-neutral-800 shadow-2xs'
                : 'bg-neutral-50/50 dark:bg-neutral-900/30 border-neutral-200/60 dark:border-neutral-800/60 opacity-60'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
                  {srv.code}
                </span>
                <span className="text-[10px] font-semibold text-red-600 dark:text-red-400">
                  {srv.category}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 font-['Poppins']">
                  {srv.name}
                </h3>
                <p className="text-neutral-500 text-[11px] mt-0.5 line-clamp-2 leading-relaxed">
                  {srv.description}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-neutral-400 block">Tariff Price (KES)</span>
                <span className="text-base font-black font-['Poppins'] text-neutral-900 dark:text-neutral-100 tabular-nums">
                  KES {srv.priceKes.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-[10px] text-neutral-500 font-mono">
                  {srv.turnaroundTime}
                </span>
                <button
                  onClick={() => onToggleServiceActive(srv.id)}
                  className={`text-[10px] font-bold px-2 py-1 rounded cursor-pointer ${
                    srv.active
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                      : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  {srv.active ? 'Active' : 'Disabled'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Service Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateSubmit}
            className="bg-white dark:bg-[#11141a] rounded-2xl max-w-md w-full border border-neutral-200 dark:border-neutral-800 p-6 space-y-4 shadow-xl text-xs"
          >
            <h3 className="text-base font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
              Add Medical Service to Tariff List
            </h3>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">Code</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
                  >
                    <option value="Consultation">Consultation</option>
                    <option value="Laboratory">Laboratory</option>
                    <option value="Diagnostics">Diagnostics</option>
                    <option value="Nursing & Procedures">Nursing & Procedures</option>
                    <option value="Dispensary">Dispensary</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">Service Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Thyroid Stimulating Hormone (TSH)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">Price (KES) *</label>
                  <input
                    type="number"
                    value={priceKes}
                    onChange={(e) => setPriceKes(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">Turnaround Time</label>
                  <input
                    type="text"
                    value={turnaroundTime}
                    onChange={(e) => setTurnaroundTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold"
              >
                Add Service
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
