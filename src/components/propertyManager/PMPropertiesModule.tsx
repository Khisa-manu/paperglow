import React, { useState } from 'react';
import {
  Building2,
  Plus,
  MapPin,
  Phone,
  User,
  Key,
  Layers,
  CheckCircle2,
  AlertTriangle,
  X,
  Filter,
  Eye,
  Check,
  ChevronDown,
} from 'lucide-react';
import {
  Property,
  Unit,
  Tenant,
  UnitType,
  UnitStatus,
  PropertyType,
} from '../../types/propertyManager';

interface PMPropertiesModuleProps {
  properties: Property[];
  units: Unit[];
  tenants: Tenant[];
  onAddProperty: (newProp: Omit<Property, 'id'>) => void;
  onAddUnit: (newUnit: Omit<Unit, 'id'>) => void;
  onUpdateUnitStatus: (unitId: string, status: UnitStatus) => void;
  initialSelectedPropertyId?: string;
}

export const PMPropertiesModule: React.FC<PMPropertiesModuleProps> = ({
  properties,
  units,
  tenants,
  onAddProperty,
  onAddUnit,
  onUpdateUnitStatus,
  initialSelectedPropertyId,
}) => {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(
    initialSelectedPropertyId || properties[0]?.id || ''
  );
  const [unitStatusFilter, setUnitStatusFilter] = useState<'all' | UnitStatus>('all');
  const [isAddPropertyModalOpen, setIsAddPropertyModalOpen] = useState(false);
  const [isAddUnitModalOpen, setIsAddUnitModalOpen] = useState(false);

  // New Property Form State
  const [propForm, setPropForm] = useState<{
    name: string;
    propertyType: PropertyType;
    location: string;
    address: string;
    county: string;
    totalUnits: number;
    yearBuilt: number;
    caretakerName: string;
    caretakerPhone: string;
    amenities: string;
    notes: string;
  }>({
    name: '',
    propertyType: 'apartment_building',
    location: 'Kilimani, Nairobi',
    address: '',
    county: 'Nairobi County',
    totalUnits: 10,
    yearBuilt: 2024,
    caretakerName: '',
    caretakerPhone: '+254 ',
    amenities: 'Borehole, 24/7 Security, Backup Generator, Parking',
    notes: '',
  });

  // New Unit Form State
  const [unitForm, setUnitForm] = useState<{
    propertyId: string;
    unitNumber: string;
    floor: number;
    unitType: UnitType;
    monthlyRentKes: number;
    depositKes: number;
    sizeSqFt: number;
  }>({
    propertyId: selectedPropertyId,
    unitNumber: '',
    floor: 1,
    unitType: '2 Bedroom Master Ensuite',
    monthlyRentKes: 65000,
    depositKes: 65000,
    sizeSqFt: 950,
  });

  const selectedProperty = properties.find((p) => p.id === selectedPropertyId) || properties[0];

  const propertyUnits = units.filter((u) => u.propertyId === selectedPropertyId);
  const filteredUnits = propertyUnits.filter((u) => {
    if (unitStatusFilter === 'all') return true;
    return u.status === unitStatusFilter;
  });

  // Calculate stats for current property
  const propTotalUnits = propertyUnits.length;
  const propOccupiedUnits = propertyUnits.filter((u) => u.status === 'occupied').length;
  const propVacantUnits = propertyUnits.filter((u) => u.status === 'vacant').length;
  const propMonthlyPotential = propertyUnits.reduce((acc, u) => acc + u.monthlyRentKes, 0);

  const formatKes = (amount: number) => `KES ${amount.toLocaleString('en-KE')}`;

  const handleCreateProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propForm.name || !propForm.location) return;

    onAddProperty({
      name: propForm.name,
      propertyType: propForm.propertyType,
      location: propForm.location,
      address: propForm.address || `${propForm.location}, Nairobi`,
      county: propForm.county,
      totalUnits: Number(propForm.totalUnits) || 1,
      yearBuilt: Number(propForm.yearBuilt) || 2024,
      caretakerName: propForm.caretakerName || 'Estate Supervisor',
      caretakerPhone: propForm.caretakerPhone || '+254 700 000 000',
      amenities: propForm.amenities.split(',').map((s) => s.trim()).filter(Boolean),
      imageUrl: selectedProperty?.imageUrl || '',
      notes: propForm.notes,
    });

    setIsAddPropertyModalOpen(false);
  };

  const handleCreateUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitForm.unitNumber) return;

    onAddUnit({
      propertyId: unitForm.propertyId || selectedPropertyId,
      unitNumber: unitForm.unitNumber,
      floor: Number(unitForm.floor) || 1,
      unitType: unitForm.unitType,
      monthlyRentKes: Number(unitForm.monthlyRentKes) || 0,
      depositKes: Number(unitForm.depositKes) || Number(unitForm.monthlyRentKes) || 0,
      status: 'vacant',
      sizeSqFt: Number(unitForm.sizeSqFt) || 800,
    });

    setIsAddUnitModalOpen(false);
    setUnitForm((prev) => ({ ...prev, unitNumber: '' }));
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 font-['Poppins']">
            Estate Properties &amp; Unit Registry
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Manage residential apartment buildings, commercial towers, and individual unit status.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsAddPropertyModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-2 bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-white text-white dark:text-neutral-900 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Property</span>
          </button>
          <button
            onClick={() => {
              setUnitForm((prev) => ({ ...prev, propertyId: selectedPropertyId }));
              setIsAddUnitModalOpen(true);
            }}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Unit</span>
          </button>
        </div>
      </div>

      {/* Property Selector Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {properties.map((prop) => {
          const isSelected = prop.id === selectedPropertyId;
          const pUnits = units.filter((u) => u.propertyId === prop.id);
          const pOccupied = pUnits.filter((u) => u.status === 'occupied').length;
          const pVacant = pUnits.filter((u) => u.status === 'vacant').length;
          const occPct = pUnits.length > 0 ? Math.round((pOccupied / pUnits.length) * 100) : 0;

          return (
            <div
              key={prop.id}
              onClick={() => setSelectedPropertyId(prop.id)}
              className={`group overflow-hidden rounded-xl border transition-all cursor-pointer bg-white dark:bg-[#11141a] ${
                isSelected
                  ? 'border-red-600 ring-1 ring-red-600 shadow-sm'
                  : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
              }`}
            >
              {/* Property Image Cover */}
              <div className="relative h-40 w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900">
                {prop.imageUrl ? (
                  <img
                    src={prop.imageUrl}
                    alt={prop.name}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-400">
                    <Building2 className="w-10 h-10" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-red-300">
                    {prop.propertyType.replace('_', ' ')}
                  </div>
                  <h3 className="font-bold text-sm tracking-tight truncate font-['Poppins']">
                    {prop.name}
                  </h3>
                  <div className="flex items-center space-x-1 text-[11px] text-neutral-200 truncate mt-0.5">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">{prop.location}</span>
                  </div>
                </div>
              </div>

              {/* Property Metrics Bar */}
              <div className="p-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500 dark:text-neutral-400">Occupancy</span>
                  <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
                    {occPct}% ({pOccupied}/{pUnits.length})
                  </span>
                </div>
                {/* Micro Progress Bar */}
                <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-600 rounded-full"
                    style={{ width: `${occPct}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 pt-1 border-t border-neutral-100 dark:border-neutral-800">
                  <span>{pVacant} Vacant</span>
                  <span>Caretaker: {prop.caretakerName.split(' ')[0]}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Property Details Panel */}
      {selectedProperty && (
        <div className="bg-white dark:bg-[#11141a] rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <div>
              <div className="flex items-center space-x-2 text-xs text-neutral-500 dark:text-neutral-400">
                <span className="font-medium text-red-600 dark:text-red-400 uppercase tracking-wide">
                  Active Property Focus
                </span>
                <span aria-hidden="true">·</span>
                <span>Built {selectedProperty.yearBuilt}</span>
                <span aria-hidden="true">·</span>
                <span>{selectedProperty.county}</span>
              </div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 font-['Poppins'] mt-0.5">
                {selectedProperty.name}
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                {selectedProperty.address}
              </p>
            </div>

            {/* Quick Property Stats */}
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="px-3 py-1.5 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300">
                <span className="text-[10px] text-neutral-400 block font-sans">Total Units</span>
                <span className="font-bold text-sm tabular-nums">{propTotalUnits}</span>
              </div>
              <div className="px-3 py-1.5 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300">
                <span className="text-[10px] text-neutral-400 block font-sans">Monthly Target</span>
                <span className="font-bold text-sm tabular-nums">{formatKes(propMonthlyPotential)}</span>
              </div>
              <div className="px-3 py-1.5 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300">
                <span className="text-[10px] text-neutral-400 block font-sans">Caretaker Desk</span>
                <span className="font-sans font-medium text-xs block truncate max-w-[120px]">
                  {selectedProperty.caretakerName} ({selectedProperty.caretakerPhone})
                </span>
              </div>
            </div>
          </div>

          {/* Amenities & Notes Line */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-neutral-400 font-medium">Amenities:</span>
            {selectedProperty.amenities.map((am, i) => (
              <span
                key={i}
                className="bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded text-neutral-700 dark:text-neutral-300 text-[11px]"
              >
                {am}
              </span>
            ))}
          </div>

          {/* Units Sub-table Header & Filters */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center space-x-2">
              <h4 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
                Units in this Building ({filteredUnits.length})
              </h4>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800/80 rounded-lg text-xs">
              <button
                onClick={() => setUnitStatusFilter('all')}
                className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                  unitStatusFilter === 'all'
                    ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                }`}
              >
                All Units ({propTotalUnits})
              </button>
              <button
                onClick={() => setUnitStatusFilter('occupied')}
                className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                  unitStatusFilter === 'occupied'
                    ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                }`}
              >
                Occupied ({propOccupiedUnits})
              </button>
              <button
                onClick={() => setUnitStatusFilter('vacant')}
                className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                  unitStatusFilter === 'vacant'
                    ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                }`}
              >
                Vacant ({propVacantUnits})
              </button>
              <button
                onClick={() => setUnitStatusFilter('under_maintenance')}
                className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                  unitStatusFilter === 'under_maintenance'
                    ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                }`}
              >
                Maintenance ({propertyUnits.filter((u) => u.status === 'under_maintenance').length})
              </button>
            </div>
          </div>

          {/* Units Table */}
          <div className="overflow-x-auto border border-neutral-200 dark:border-neutral-800 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-900/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 font-medium">
                <tr>
                  <th className="py-2.5 px-4">Unit #</th>
                  <th className="py-2.5 px-4">Floor</th>
                  <th className="py-2.5 px-4">Type</th>
                  <th className="py-2.5 px-4">Size (Sq Ft)</th>
                  <th className="py-2.5 px-4">Monthly Rent</th>
                  <th className="py-2.5 px-4">Deposit</th>
                  <th className="py-2.5 px-4">Current Tenant</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4 text-right">Quick Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
                {filteredUnits.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-neutral-400">
                      No units match this filter. Click "+ Add Unit" to register rooms.
                    </td>
                  </tr>
                ) : (
                  filteredUnits.map((unit) => {
                    const tenant = tenants.find((t) => t.id === unit.currentTenantId);
                    return (
                      <tr
                        key={unit.id}
                        className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors"
                      >
                        <td className="py-3 px-4 font-bold font-mono text-neutral-900 dark:text-neutral-100">
                          {unit.unitNumber}
                        </td>
                        <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">
                          Floor {unit.floor}
                        </td>
                        <td className="py-3 px-4 text-neutral-800 dark:text-neutral-200">
                          {unit.unitType}
                        </td>
                        <td className="py-3 px-4 font-mono tabular-nums text-neutral-600 dark:text-neutral-400">
                          {unit.sizeSqFt} sq ft
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">
                          {formatKes(unit.monthlyRentKes)}
                        </td>
                        <td className="py-3 px-4 font-mono tabular-nums text-neutral-500">
                          {formatKes(unit.depositKes)}
                        </td>
                        <td className="py-3 px-4">
                          {tenant ? (
                            <div>
                              <div className="font-medium text-neutral-900 dark:text-neutral-100">
                                {tenant.name}
                              </div>
                              <div className="text-[10px] text-neutral-400">
                                {tenant.phone}
                              </div>
                            </div>
                          ) : (
                            <span className="text-neutral-400 italic">None (Unassigned)</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                              unit.status === 'occupied'
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                                : unit.status === 'vacant'
                                ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                                : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                            }`}
                          >
                            {unit.status === 'occupied'
                              ? 'Occupied'
                              : unit.status === 'vacant'
                              ? 'Vacant'
                              : 'Maintenance'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <select
                            value={unit.status}
                            onChange={(e) => onUpdateUnitStatus(unit.id, e.target.value as UnitStatus)}
                            className="text-[11px] bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded px-2 py-1 text-neutral-700 dark:text-neutral-300 focus:outline-none focus:border-red-500"
                          >
                            <option value="occupied">Set Occupied</option>
                            <option value="vacant">Set Vacant</option>
                            <option value="under_maintenance">Set Maintenance</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Add Property */}
      {isAddPropertyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl my-8">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100 font-['Poppins']">
                Add New Estate / Property
              </h3>
              <button
                onClick={() => setIsAddPropertyModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProperty} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Property Name *
                </label>
                <input
                  type="text"
                  required
                  value={propForm.name}
                  onChange={(e) => setPropForm({ ...propForm, name: e.target.value })}
                  placeholder="e.g. Ruaka Ridge Residences"
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Property Type
                  </label>
                  <select
                    value={propForm.propertyType}
                    onChange={(e) => setPropForm({ ...propForm, propertyType: e.target.value as PropertyType })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
                  >
                    <option value="apartment_building">Apartment Building</option>
                    <option value="commercial">Commercial Building</option>
                    <option value="gated_villas">Gated Villas</option>
                    <option value="mixed_use">Mixed Use</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Location Area *
                  </label>
                  <input
                    type="text"
                    required
                    value={propForm.location}
                    onChange={(e) => setPropForm({ ...propForm, location: e.target.value })}
                    placeholder="e.g. Ruaka / Westlands / Karen"
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  value={propForm.address}
                  onChange={(e) => setPropForm({ ...propForm, address: e.target.value })}
                  placeholder="e.g. Limuru Road, Opposite Quickmart"
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Caretaker Name
                  </label>
                  <input
                    type="text"
                    value={propForm.caretakerName}
                    onChange={(e) => setPropForm({ ...propForm, caretakerName: e.target.value })}
                    placeholder="e.g. John Mwenda"
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Caretaker Phone
                  </label>
                  <input
                    type="text"
                    value={propForm.caretakerPhone}
                    onChange={(e) => setPropForm({ ...propForm, caretakerPhone: e.target.value })}
                    placeholder="+254 7XX XXX XXX"
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Amenities (comma separated)
                </label>
                <input
                  type="text"
                  value={propForm.amenities}
                  onChange={(e) => setPropForm({ ...propForm, amenities: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddPropertyModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-xs"
                >
                  Save Property
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Unit */}
      {isAddUnitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl my-8">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100 font-['Poppins']">
                Add Unit to Property
              </h3>
              <button
                onClick={() => setIsAddUnitModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUnit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Target Property
                </label>
                <select
                  value={unitForm.propertyId}
                  onChange={(e) => setUnitForm({ ...unitForm, propertyId: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
                >
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Unit Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={unitForm.unitNumber}
                    onChange={(e) => setUnitForm({ ...unitForm, unitNumber: e.target.value })}
                    placeholder="e.g. B204 or Penthouse 1"
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Floor Level
                  </label>
                  <input
                    type="number"
                    value={unitForm.floor}
                    onChange={(e) => setUnitForm({ ...unitForm, floor: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Unit Type
                </label>
                <select
                  value={unitForm.unitType}
                  onChange={(e) => setUnitForm({ ...unitForm, unitType: e.target.value as UnitType })}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
                >
                  <option value="Studio">Studio</option>
                  <option value="1 Bedroom">1 Bedroom</option>
                  <option value="2 Bedroom Master Ensuite">2 Bedroom Master Ensuite</option>
                  <option value="3 Bedroom">3 Bedroom</option>
                  <option value="Penthouse">Penthouse</option>
                  <option value="Commercial Office">Commercial Office</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Monthly Rent (KES) *
                  </label>
                  <input
                    type="number"
                    required
                    value={unitForm.monthlyRentKes}
                    onChange={(e) =>
                      setUnitForm({
                        ...unitForm,
                        monthlyRentKes: Number(e.target.value),
                        depositKes: Number(e.target.value), // auto-match deposit
                      })
                    }
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Security Deposit (KES)
                  </label>
                  <input
                    type="number"
                    value={unitForm.depositKes}
                    onChange={(e) => setUnitForm({ ...unitForm, depositKes: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Floor Area (Sq Ft)
                </label>
                <input
                  type="number"
                  value={unitForm.sizeSqFt}
                  onChange={(e) => setUnitForm({ ...unitForm, sizeSqFt: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddUnitModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-xs"
                >
                  Add Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
