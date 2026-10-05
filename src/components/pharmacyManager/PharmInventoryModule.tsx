import React, { useState } from 'react';
import {
  Pill,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  Clock,
  Layers,
  CheckCircle2,
  X,
  Edit2,
  Building,
  Tag,
  DollarSign,
} from 'lucide-react';
import {
  MedicineProduct,
  MedicineCategory,
  StockStatus,
} from '../../types/pharmacyManager';

interface PharmInventoryModuleProps {
  medicines: MedicineProduct[];
  onAddMedicine: (newMed: Omit<MedicineProduct, 'id'>) => void;
  onUpdateMedicine: (med: MedicineProduct) => void;
  onNavigateToStock: () => void;
}

export const PharmInventoryModule: React.FC<PharmInventoryModuleProps> = ({
  medicines,
  onAddMedicine,
  onUpdateMedicine,
  onNavigateToStock,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | MedicineCategory>('all');
  const [prescriptionFilter, setPrescriptionFilter] = useState<'all' | 'rx' | 'otc'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<MedicineProduct | null>(null);

  // Form State
  const [form, setForm] = useState<{
    name: string;
    genericName: string;
    category: MedicineCategory;
    manufacturer: string;
    skuBarcode: string;
    batchNumber: string;
    unitOfMeasure: string;
    quantityInStock: number;
    minStockLevel: number;
    buyingPriceKes: number;
    sellingPriceKes: number;
    expiryDate: string;
    requiresPrescription: boolean;
    shelfLocation: string;
    notes: string;
  }>({
    name: '',
    genericName: '',
    category: 'Antibiotics',
    manufacturer: 'Dawa Life Sciences Ltd',
    skuBarcode: '',
    batchNumber: 'BTH-26A01',
    unitOfMeasure: 'Pack of 30 Tablets',
    quantityInStock: 50,
    minStockLevel: 15,
    buyingPriceKes: 450,
    sellingPriceKes: 750,
    expiryDate: '2027-12-31',
    requiresPrescription: true,
    shelfLocation: 'Shelf A-2',
    notes: '',
  });

  const formatKes = (amount: number) => `KES ${amount.toLocaleString('en-KE')}`;

  const filteredMedicines = medicines.filter((m) => {
    const catMatch = categoryFilter === 'all' || m.category === categoryFilter;
    const rxMatch =
      prescriptionFilter === 'all'
        ? true
        : prescriptionFilter === 'rx'
        ? m.requiresPrescription
        : !m.requiresPrescription;

    const q = searchQuery.toLowerCase();
    const searchMatch =
      !searchQuery ||
      m.name.toLowerCase().includes(q) ||
      m.genericName.toLowerCase().includes(q) ||
      m.batchNumber.toLowerCase().includes(q) ||
      m.skuBarcode.toLowerCase().includes(q) ||
      m.manufacturer.toLowerCase().includes(q);

    return catMatch && rxMatch && searchMatch;
  });

  const handleCreateMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || form.sellingPriceKes <= 0) return;

    const sku = form.skuBarcode.trim() || `MED-${Date.now().toString().slice(-5)}`;

    onAddMedicine({
      name: form.name,
      genericName: form.genericName || form.name,
      category: form.category,
      manufacturer: form.manufacturer,
      skuBarcode: sku,
      batchNumber: form.batchNumber,
      unitOfMeasure: form.unitOfMeasure,
      quantityInStock: Number(form.quantityInStock),
      minStockLevel: Number(form.minStockLevel),
      buyingPriceKes: Number(form.buyingPriceKes),
      sellingPriceKes: Number(form.sellingPriceKes),
      expiryDate: form.expiryDate,
      requiresPrescription: form.requiresPrescription,
      shelfLocation: form.shelfLocation || 'Main Dispensary Shelf',
      notes: form.notes,
    });

    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMedicine) return;
    onUpdateMedicine(editingMedicine);
    setEditingMedicine(null);
  };

  return (
    <div className="space-y-6">
      {/* Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 font-['Poppins']">
            Medicine &amp; Pharmaceutical Inventory
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Full formulary with active ingredients, batches, buying/selling prices, shelf locations, and PPB prescription tags.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Register Medicine</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white dark:bg-[#11141a] rounded-xl border border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search medicine name, generic, batch, SKU..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-red-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="text-xs bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg px-2.5 py-1.5 text-neutral-700 dark:text-neutral-300"
          >
            <option value="all">All Categories ({medicines.length})</option>
            <option value="Antibiotics">Antibiotics</option>
            <option value="Analgesics & Pain Relief">Analgesics &amp; Pain</option>
            <option value="Antimalarials">Antimalarials</option>
            <option value="Respiratory & Cold">Respiratory &amp; Cold</option>
            <option value="Gastrointestinal">Gastrointestinal</option>
            <option value="Cardiovascular & Diabetes">Cardiovascular &amp; Diabetes</option>
            <option value="Dermatologicals">Dermatologicals</option>
            <option value="Vitamins & Supplements">Vitamins &amp; Supplements</option>
          </select>

          {/* Prescription Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xs">
            <button
              onClick={() => setPrescriptionFilter('all')}
              className={`px-2.5 py-1 rounded font-medium cursor-pointer ${
                prescriptionFilter === 'all'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                  : 'text-neutral-500'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setPrescriptionFilter('rx')}
              className={`px-2.5 py-1 rounded font-medium cursor-pointer ${
                prescriptionFilter === 'rx'
                  ? 'bg-white dark:bg-neutral-900 text-red-600 dark:text-red-400 font-semibold shadow-xs'
                  : 'text-neutral-500'
              }`}
            >
              Prescription (Rx)
            </button>
            <button
              onClick={() => setPrescriptionFilter('otc')}
              className={`px-2.5 py-1 rounded font-medium cursor-pointer ${
                prescriptionFilter === 'otc'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                  : 'text-neutral-500'
              }`}
            >
              Over-the-Counter (OTC)
            </button>
          </div>
        </div>
      </div>

      {/* Medicines Table */}
      <div className="bg-white dark:bg-[#11141a] rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-900/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 font-medium">
              <tr>
                <th className="py-3 px-4">Medicine &amp; Generic Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Manufacturer</th>
                <th className="py-3 px-4">Batch / SKU</th>
                <th className="py-3 px-4">Stock Qty</th>
                <th className="py-3 px-4">Buying Price</th>
                <th className="py-3 px-4">Retail Price</th>
                <th className="py-3 px-4">Expiry Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
              {filteredMedicines.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-neutral-400">
                    No medicines match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredMedicines.map((med) => {
                  const isLow = med.quantityInStock <= med.minStockLevel;
                  const expDate = new Date(med.expiryDate);
                  const isExpiring = expDate <= new Date('2027-01-01');

                  return (
                    <tr
                      key={med.id}
                      className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-semibold text-neutral-900 dark:text-neutral-100">
                        <div className="flex items-center space-x-1.5">
                          <span>{med.name}</span>
                          {med.requiresPrescription && (
                            <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300">
                              Rx
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-neutral-500 font-normal">
                          {med.genericName} · {med.unitOfMeasure}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-neutral-700 dark:text-neutral-300">
                        {med.category}
                      </td>

                      <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-400 truncate max-w-[130px]">
                        {med.manufacturer}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-700 dark:text-neutral-300">
                        <div>{med.batchNumber}</div>
                        <div className="text-[10px] text-neutral-400">{med.skuBarcode}</div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold tabular-nums">
                        <span className={isLow ? 'text-red-600 dark:text-red-400' : 'text-neutral-900 dark:text-neutral-100'}>
                          {med.quantityInStock}
                        </span>
                        {isLow && (
                          <div className="text-[10px] text-amber-600 font-normal">
                            Min: {med.minStockLevel}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-mono tabular-nums text-neutral-500">
                        {formatKes(med.buyingPriceKes)}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold tabular-nums text-neutral-900 dark:text-neutral-100">
                        {formatKes(med.sellingPriceKes)}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        <span className={isExpiring ? 'text-amber-600 font-semibold' : 'text-neutral-600 dark:text-neutral-400'}>
                          {med.expiryDate}
                        </span>
                        <div className="text-[10px] text-neutral-400 font-sans">
                          {med.shelfLocation}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setEditingMedicine(med)}
                          className="px-2 py-1 text-[11px] font-semibold bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-700 dark:text-neutral-300 rounded cursor-pointer"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add New Medicine */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl my-8">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100 font-['Poppins']">
                Register New Medicine to Formulary
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMedicine} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Trade / Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Flagyl 400mg Tablets"
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Generic Active Ingredient
                  </label>
                  <input
                    type="text"
                    value={form.genericName}
                    onChange={(e) => setForm({ ...form, genericName: e.target.value })}
                    placeholder="e.g. Metronidazole"
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as MedicineCategory })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
                  >
                    <option value="Antibiotics">Antibiotics</option>
                    <option value="Analgesics & Pain Relief">Analgesics &amp; Pain</option>
                    <option value="Antimalarials">Antimalarials</option>
                    <option value="Respiratory & Cold">Respiratory &amp; Cold</option>
                    <option value="Gastrointestinal">Gastrointestinal</option>
                    <option value="Cardiovascular & Diabetes">Cardiovascular &amp; Diabetes</option>
                    <option value="Dermatologicals">Dermatologicals</option>
                    <option value="Vitamins & Supplements">Vitamins &amp; Supplements</option>
                    <option value="Medical Supplies & First Aid">Medical Supplies</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Manufacturer / Brand *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.manufacturer}
                    onChange={(e) => setForm({ ...form, manufacturer: e.target.value })}
                    placeholder="e.g. Dawa Life Sciences / Sanofi"
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Batch Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.batchNumber}
                    onChange={(e) => setForm({ ...form, batchNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Packaging Unit
                  </label>
                  <input
                    type="text"
                    value={form.unitOfMeasure}
                    onChange={(e) => setForm({ ...form, unitOfMeasure: e.target.value })}
                    placeholder="Pack of 20"
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Expiry Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={form.expiryDate}
                    onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Initial Stock Qty
                  </label>
                  <input
                    type="number"
                    value={form.quantityInStock}
                    onChange={(e) => setForm({ ...form, quantityInStock: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Min Alert Threshold
                  </label>
                  <input
                    type="number"
                    value={form.minStockLevel}
                    onChange={(e) => setForm({ ...form, minStockLevel: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Buying Price (KES)
                  </label>
                  <input
                    type="number"
                    value={form.buyingPriceKes}
                    onChange={(e) => setForm({ ...form, buyingPriceKes: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Retail Selling Price (KES) *
                  </label>
                  <input
                    type="number"
                    required
                    value={form.sellingPriceKes}
                    onChange={(e) => setForm({ ...form, sellingPriceKes: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="rxCheckbox"
                  checked={form.requiresPrescription}
                  onChange={(e) => setForm({ ...form, requiresPrescription: e.target.checked })}
                  className="rounded border-neutral-300 text-red-600 focus:ring-red-500 cursor-pointer"
                />
                <label htmlFor="rxCheckbox" className="font-medium text-neutral-800 dark:text-neutral-200 cursor-pointer">
                  Requires Doctor's Prescription (POM / Rx)
                </label>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-xs"
                >
                  Save Medicine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Medicine */}
      {editingMedicine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl my-8">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100 font-['Poppins']">
                Edit Medicine Details
              </h3>
              <button
                onClick={() => setEditingMedicine(null)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Medicine Name
                </label>
                <input
                  type="text"
                  value={editingMedicine.name}
                  onChange={(e) => setEditingMedicine({ ...editingMedicine, name: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={editingMedicine.quantityInStock}
                    onChange={(e) =>
                      setEditingMedicine({ ...editingMedicine, quantityInStock: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Selling Price (KES)
                  </label>
                  <input
                    type="number"
                    value={editingMedicine.sellingPriceKes}
                    onChange={(e) =>
                      setEditingMedicine({ ...editingMedicine, sellingPriceKes: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Batch Number
                  </label>
                  <input
                    type="text"
                    value={editingMedicine.batchNumber}
                    onChange={(e) => setEditingMedicine({ ...editingMedicine, batchNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={editingMedicine.expiryDate}
                    onChange={(e) => setEditingMedicine({ ...editingMedicine, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Shelf Location
                </label>
                <input
                  type="text"
                  value={editingMedicine.shelfLocation}
                  onChange={(e) => setEditingMedicine({ ...editingMedicine, shelfLocation: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditingMedicine(null)}
                  className="px-4 py-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
