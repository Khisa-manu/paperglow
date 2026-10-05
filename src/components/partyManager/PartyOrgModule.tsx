import React, { useState } from 'react';
import {
  Building,
  ShieldCheck,
  Award,
  Users,
  Mail,
  Phone,
  Globe,
  MapPin,
  FileText,
  Edit2,
  CheckCircle2,
  ExternalLink,
  Save,
  X,
} from 'lucide-react';
import {
  PartyOrganizationSettings,
  PartyDepartment,
  PartyBranch,
} from '../../types/partyManager';

interface PartyOrgModuleProps {
  settings: PartyOrganizationSettings;
  departments: PartyDepartment[];
  branches: PartyBranch[];
  onUpdateSettings: (newSettings: PartyOrganizationSettings) => void;
  onNavigateToBranches: () => void;
  onNavigateToDocuments: () => void;
}

export const PartyOrgModule: React.FC<PartyOrgModuleProps> = ({
  settings,
  departments,
  branches,
  onUpdateSettings,
  onNavigateToBranches,
  onNavigateToDocuments,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<PartyOrganizationSettings>(settings);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formData);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Status Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0">
            {settings.abbreviation.split('-')[0] || 'UCA'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">{settings.registeredName}</h2>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-800 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Fully Registered
              </span>
            </div>
            <p className="text-xs text-slate-500 italic mt-0.5">"{settings.slogan}"</p>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
              <span>ORPP Ref: <strong className="text-slate-700">{settings.registrarRefNo}</strong></span>
              <span>KRA PIN: <strong className="text-slate-700">{settings.pinNumber}</strong></span>
              <span>Founded: <strong className="text-slate-700">{settings.foundingYear}</strong></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setFormData(settings);
              setIsEditing(true);
            }}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
          <button
            onClick={onNavigateToDocuments}
            className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Party Constitution</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Organization secretariat record updated and synchronized across all branches.</span>
        </div>
      )}

      {/* Main Grid: National Secretariat Headquarters & Executive Organs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Statutory Headquarters & Official Channels */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Building className="w-4 h-4 text-red-600" />
              National Secretariat Headquarters
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-800">Physical Address</div>
                  <div className="text-slate-600">{settings.headquartersAddress}</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-800">Postal Address & Email</div>
                  <div className="text-slate-600">{settings.postalAddress}</div>
                  <div className="text-red-600 font-medium">{settings.officialEmail}</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-800">Telephone Lines</div>
                  <div className="text-slate-600">{settings.telephone}</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Globe className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-800">Web Portal</div>
                  <div className="text-slate-600 flex items-center gap-1">
                    {settings.website}
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <div className="text-[11px] font-semibold text-slate-500 mb-1">Treasury Paybill</div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs font-mono font-bold text-slate-800">
                {settings.paybillNumber}
              </div>
            </div>
          </div>

          {/* Regional Network Summary */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-red-600" />
                Regional Secretariats ({branches.length})
              </h3>
              <button
                onClick={onNavigateToBranches}
                className="text-xs font-semibold text-red-600 hover:underline"
              >
                Manage Hubs
              </button>
            </div>
            <div className="space-y-2">
              {branches.map((b) => (
                <div
                  key={b.id}
                  className="p-2.5 bg-slate-50 rounded-lg flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-semibold text-slate-800">{b.name}</span>
                    <div className="text-[11px] text-slate-500">{b.county} • {b.coordinatorName}</div>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-white border border-slate-200 rounded text-slate-700">
                    {b.memberCount.toLocaleString()} Members
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: National Executive Officers & Specialized Directorates */}
        <div className="lg:col-span-2 space-y-6">
          {/* Statutory National Executive Leadership */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
              <Award className="w-4 h-4 text-red-600" />
              Statutory National Executive Officers
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-50 px-1.5 py-0.5 rounded border border-red-100">
                  Party Leader
                </span>
                <h4 className="text-sm font-bold text-slate-900 pt-1">{settings.partyLeader}</h4>
                <p className="text-xs text-slate-500">Principal spokesperson and titular head of the alliance.</p>
              </div>

              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-50 px-1.5 py-0.5 rounded border border-red-100">
                  National Chairperson
                </span>
                <h4 className="text-sm font-bold text-slate-900 pt-1">{settings.nationalChairperson}</h4>
                <p className="text-xs text-slate-500">Presides over National Delegates Conference and NEC.</p>
              </div>

              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-50 px-1.5 py-0.5 rounded border border-red-100">
                  Secretary General (CEO)
                </span>
                <h4 className="text-sm font-bold text-slate-900 pt-1">{settings.secretaryGeneral}</h4>
                <p className="text-xs text-slate-500">Chief Executive of the Secretariat, custodian of party seal.</p>
              </div>

              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-50 px-1.5 py-0.5 rounded border border-red-100">
                  National Treasurer
                </span>
                <h4 className="text-sm font-bold text-slate-900 pt-1">{settings.nationalTreasurer}</h4>
                <p className="text-xs text-slate-500">Chief financial steward, handles statutory disclosures.</p>
              </div>
            </div>
          </div>

          {/* Specialized Directorates & Wings */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-red-600" />
                Departments, Leagues & Specialized Directorates
              </h3>
              <span className="text-xs text-slate-500">{departments.length} Active Wings</span>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {departments.map((dept) => (
                <div key={dept.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-500">{dept.code}</span>
                      <h4 className="text-xs font-bold text-slate-900">{dept.name}</h4>
                    </div>
                    <p className="text-[11px] text-slate-500">{dept.description}</p>
                    <div className="text-[11px] text-slate-600 pt-1">
                      Lead: <strong className="text-slate-800">{dept.leadName}</strong> ({dept.leadTitle}) •{' '}
                      <span className="text-red-600 font-medium">{dept.contactEmail}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded-lg text-slate-700">
                      {dept.memberCount} Officers
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Organization Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Edit Organization Registry Record
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Organization Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Registered Statutory Name</label>
                  <input
                    type="text"
                    value={formData.registeredName}
                    onChange={(e) => setFormData({ ...formData, registeredName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Acronym</label>
                  <input
                    type="text"
                    value={formData.abbreviation}
                    onChange={(e) => setFormData({ ...formData, abbreviation: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ORPP Ref Number</label>
                  <input
                    type="text"
                    value={formData.registrarRefNo}
                    onChange={(e) => setFormData({ ...formData, registrarRefNo: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">KRA PIN</label>
                  <input
                    type="text"
                    value={formData.pinNumber}
                    onChange={(e) => setFormData({ ...formData, pinNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Motto / Slogan</label>
                <input
                  type="text"
                  value={formData.slogan}
                  onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Party Leader</label>
                  <input
                    type="text"
                    value={formData.partyLeader}
                    onChange={(e) => setFormData({ ...formData, partyLeader: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">National Chairperson</label>
                  <input
                    type="text"
                    value={formData.nationalChairperson}
                    onChange={(e) => setFormData({ ...formData, nationalChairperson: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Secretary General</label>
                  <input
                    type="text"
                    value={formData.secretaryGeneral}
                    onChange={(e) => setFormData({ ...formData, secretaryGeneral: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">National Treasurer</label>
                  <input
                    type="text"
                    value={formData.nationalTreasurer}
                    onChange={(e) => setFormData({ ...formData, nationalTreasurer: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Telephone</label>
                  <input
                    type="text"
                    value={formData.telephone}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Official Email</label>
                  <input
                    type="email"
                    value={formData.officialEmail}
                    onChange={(e) => setFormData({ ...formData, officialEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Physical Headquarters</label>
                <input
                  type="text"
                  value={formData.headquartersAddress}
                  onChange={(e) => setFormData({ ...formData, headquartersAddress: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Record</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
