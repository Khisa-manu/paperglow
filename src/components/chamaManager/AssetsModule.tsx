import React, { useState } from 'react';
import { GroupAsset, GroupProfile } from '../../types/chamaManager';
import {
  Landmark,
  Plus,
  MapPin,
  TrendingUp,
  FileCheck,
  Calendar,
  Building,
} from 'lucide-react';

interface AssetsModuleProps {
  assets: GroupAsset[];
  group: GroupProfile;
  onAddAsset: (asset: Omit<GroupAsset, 'id'>) => void;
}

export const AssetsModule: React.FC<AssetsModuleProps> = ({
  assets,
  group,
  onAddAsset,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<GroupAsset['category']>('Land & Real Estate');
  const [purchaseDate, setPurchaseDate] = useState('2026-01-15');
  const [purchaseCostKes, setPurchaseCostKes] = useState(1500000);
  const [currentValuationKes, setCurrentValuationKes] = useState(1800000);
  const [location, setLocation] = useState('Ruiru, Kiambu County');
  const [documentNumber, setDocumentNumber] = useState('TITLE DEED NO. 8891/2026');
  const [notes, setNotes] = useState('');

  const totalCost = assets.reduce((s, a) => s + a.purchaseCostKes, 0);
  const totalValuation = assets.reduce((s, a) => s + a.currentValuationKes, 0);
  const totalAppreciation = totalValuation - totalCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddAsset({
      name,
      category,
      purchaseDate,
      purchaseCostKes,
      currentValuationKes,
      location,
      documentNumber,
      status: 'active',
      notes,
    });

    setIsModalOpen(false);
    setName('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h2 className="text-xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 flex items-center space-x-2">
            <Landmark className="w-5 h-5 text-red-600" />
            <span>Group Land, Real Estate &amp; Capital Assets</span>
          </h2>
          <p className="text-xs text-neutral-500">
            Portfolio of shared titles, money market unit trusts, and commercial investments owned collectively
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Asset Record</span>
        </button>
      </div>

      {/* 3 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <span className="text-[10px] text-neutral-400 font-medium uppercase block">
            Combined Asset Market Valuation
          </span>
          <div className="text-xl font-bold font-['Poppins'] text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
            KES {totalValuation.toLocaleString()}
          </div>
          <span className="text-[11px] text-neutral-500 mt-0.5 block">
            Current estimated market value
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <span className="text-[10px] text-neutral-400 font-medium uppercase block">
            Historical Acquisition Cost
          </span>
          <div className="text-xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 mt-1 tabular-nums">
            KES {totalCost.toLocaleString()}
          </div>
          <span className="text-[11px] text-neutral-500 mt-0.5 block">
            Original pooled purchase price
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-xs">
          <span className="text-[10px] text-neutral-400 font-medium uppercase block">
            Total Capital Growth (Appreciation)
          </span>
          <div className="text-xl font-bold font-['Poppins'] text-red-600 mt-1 tabular-nums">
            +KES {totalAppreciation.toLocaleString()}
          </div>
          <span className="text-[11px] text-neutral-500 mt-0.5 block">
            +{Math.round((totalAppreciation / (totalCost || 1)) * 100)}% portfolio ROI
          </span>
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assets.map((asset) => {
          const appreciation = asset.currentValuationKes - asset.purchaseCostKes;
          const roi = Math.round((appreciation / (asset.purchaseCostKes || 1)) * 100);

          return (
            <div
              key={asset.id}
              className="p-5 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900">
                      {asset.category}
                    </span>
                    <h3 className="text-sm font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 pt-1">
                      {asset.name}
                    </h3>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    {asset.status}
                  </span>
                </div>

                <div className="space-y-1 text-xs text-neutral-600 dark:text-neutral-400 pt-2">
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{asset.location}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <FileCheck className="w-3.5 h-3.5 text-neutral-400" />
                    <span className="font-mono">{asset.documentNumber}</span>
                  </div>
                </div>

                <p className="text-xs text-neutral-500 bg-neutral-50 dark:bg-neutral-900/60 p-2.5 rounded-lg border border-neutral-100 dark:border-neutral-800/80 mt-2">
                  {asset.notes}
                </p>
              </div>

              {/* Financial Valuation Metrics */}
              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase block font-medium">
                    Purchase Cost
                  </span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200 tabular-nums">
                    KES {asset.purchaseCostKes.toLocaleString()}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-neutral-400 uppercase block font-medium">
                    Current Value
                  </span>
                  <span className="font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
                    KES {asset.currentValuationKes.toLocaleString()}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-neutral-400 uppercase block font-medium">
                    Growth (Gain)
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    +{roi}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Asset Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-[#11141a] rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 max-w-md w-full space-y-4"
          >
            <h3 className="text-sm font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
              Register Collective Chama Asset
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Asset Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kitengela 1/8 Acre Commercial Plot"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
                  required
                />
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as GroupAsset['category'])}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
                >
                  <option value="Land & Real Estate">Land &amp; Real Estate</option>
                  <option value="Money Market Fund">Money Market Fund (MMF)</option>
                  <option value="Fixed Deposit">Fixed Deposit Account</option>
                  <option value="Treasury Bills">Treasury Bills &amp; Bonds</option>
                  <option value="Equipment / Furniture">Equipment &amp; Furniture</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                    Purchase Cost (KES)
                  </label>
                  <input
                    type="number"
                    value={purchaseCostKes}
                    onChange={(e) => setPurchaseCostKes(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                    Current Value (KES)
                  </label>
                  <input
                    type="number"
                    value={currentValuationKes}
                    onChange={(e) => setCurrentValuationKes(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-bold text-emerald-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Location / Financial Institution
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
                  required
                />
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Document / Title Deed Number
                </label>
                <input
                  type="text"
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                  Operational Notes &amp; Trustees
                </label>
                <textarea
                  rows={2}
                  placeholder="Custody details, land survey beacons or maturity dates..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-700 dark:text-neutral-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
              >
                Register Asset
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
