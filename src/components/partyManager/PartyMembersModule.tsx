import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Plus,
  Download,
  Upload,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  X,
  CreditCard,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShieldCheck,
  Eye,
  Edit,
  DollarSign,
  ChevronDown,
} from 'lucide-react';
import {
  PartyMember,
  PartyBranch,
  MemberStatus,
  MemberTier,
  DuesStatus,
} from '../../types/partyManager';

interface PartyMembersModuleProps {
  members: PartyMember[];
  branches: PartyBranch[];
  onAddMember: (member: PartyMember) => void;
  onUpdateMember: (member: PartyMember) => void;
  onRecordDuesPayment: (memberId: string, amount: number, channel: string) => void;
}

export const PartyMembersModule: React.FC<PartyMembersModuleProps> = ({
  members,
  branches,
  onAddMember,
  onUpdateMember,
  onRecordDuesPayment,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [branchFilter, setBranchFilter] = useState<string>('all');
  const [duesFilter, setDuesFilter] = useState<string>('all');

  // Modals
  const [selectedMember, setSelectedMember] = useState<PartyMember | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDuesModalOpen, setIsDuesModalOpen] = useState(false);
  const [duesMember, setDuesMember] = useState<PartyMember | null>(null);
  const [duesAmount, setDuesAmount] = useState<number>(2400);
  const [duesChannel, setDuesChannel] = useState<string>('mpesa_paybill');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // New Member Form State
  const [newMemberForm, setNewMemberForm] = useState<{
    fullName: string;
    idNumber: string;
    email: string;
    phone: string;
    gender: 'male' | 'female' | 'other';
    county: string;
    constituency: string;
    ward: string;
    branchId: string;
    status: MemberStatus;
    tier: MemberTier;
    notes: string;
  }>({
    fullName: '',
    idNumber: '',
    email: '',
    phone: '+254 ',
    gender: 'male',
    county: 'Nairobi City',
    constituency: 'Westlands',
    ward: 'Parklands',
    branchId: branches[0]?.id || 'branch-nbi',
    status: 'active',
    tier: 'regular',
    notes: '',
  });

  // Filtered members list
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchSearch =
        m.fullName.toLowerCase().includes(search.toLowerCase()) ||
        m.membershipNumber.toLowerCase().includes(search.toLowerCase()) ||
        m.idNumber.includes(search) ||
        m.county.toLowerCase().includes(search.toLowerCase());

      const matchStatus = statusFilter === 'all' || m.status === statusFilter;
      const matchTier = tierFilter === 'all' || m.tier === tierFilter;
      const matchBranch = branchFilter === 'all' || m.branchId === branchFilter;
      const matchDues = duesFilter === 'all' || m.duesStatus === duesFilter;

      return matchSearch && matchStatus && matchTier && matchBranch && matchDues;
    });
  }, [members, search, statusFilter, tierFilter, branchFilter, duesFilter]);

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `mem-${Date.now()}`;
    const nextSeq = 1000 + members.length + 1;
    const membershipNumber = `UCA-2025-${nextSeq}`;
    const today = new Date().toISOString().split('T')[0];

    const newMember: PartyMember = {
      id: newId,
      membershipNumber,
      fullName: newMemberForm.fullName,
      idNumber: newMemberForm.idNumber,
      email: newMemberForm.email,
      phone: newMemberForm.phone,
      gender: newMemberForm.gender,
      county: newMemberForm.county,
      constituency: newMemberForm.constituency,
      ward: newMemberForm.ward,
      branchId: newMemberForm.branchId,
      status: newMemberForm.status,
      tier: newMemberForm.tier,
      joinDate: today,
      expiryDate: '2026-12-31',
      duesStatus: 'paid',
      outstandingDues: 0,
      lastDuesPaymentDate: today,
      notes: newMemberForm.notes,
      roles: newMemberForm.tier === 'delegate' ? ['Accredited Delegate'] : ['Registered Member'],
    };

    onAddMember(newMember);
    setIsAddModalOpen(false);
    setSelectedMember(newMember);
  };

  const handleExportCSV = () => {
    const headers = [
      'Membership Number',
      'Full Name',
      'National ID',
      'County',
      'Constituency',
      'Ward',
      'Branch',
      'Status',
      'Tier',
      'Dues Status',
      'Join Date',
    ];
    const rows = filteredMembers.map((m) => [
      m.membershipNumber,
      m.fullName,
      m.idNumber,
      m.county,
      m.constituency,
      m.ward,
      branches.find((b) => b.id === m.branchId)?.name || 'Central',
      m.status,
      m.tier,
      m.duesStatus,
      m.joinDate,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `UCAK_Certified_Member_Roll_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePayDues = (e: React.FormEvent) => {
    e.preventDefault();
    if (!duesMember) return;
    onRecordDuesPayment(duesMember.id, duesAmount, duesChannel);
    setIsDuesModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-red-600" />
            Certified Member Registry & Roll
          </h2>
          <p className="text-xs text-slate-500">
            Compliant with Section 17 of the Political Parties Act 2011 (Audited Party Roll)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import Roll</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV Roll</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Box */}
          <div className="relative lg:col-span-2">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, National ID, membership no..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:border-red-500 focus:outline-hidden"
            />
          </div>

          {/* Branch Filter */}
          <div>
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:bg-white focus:border-red-500 focus:outline-hidden"
            >
              <option value="all">All Regional Secretariats</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.county})
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:bg-white focus:border-red-500 focus:outline-hidden"
            >
              <option value="all">All Membership Statuses</option>
              <option value="active">Active Members</option>
              <option value="pending">Pending Approval</option>
              <option value="suspended">Suspended</option>
              <option value="honorary">Honorary / Elder</option>
            </select>
          </div>

          {/* Dues Status Filter */}
          <div>
            <select
              value={duesFilter}
              onChange={(e) => setDuesFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:bg-white focus:border-red-500 focus:outline-hidden"
            >
              <option value="all">All Dues Statuses</option>
              <option value="paid">Dues Paid (Current)</option>
              <option value="overdue">Dues Overdue</option>
              <option value="exempt">Dues Exempt</option>
            </select>
          </div>
        </div>

        {/* Counter Summary */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>
            Showing <strong className="text-slate-800">{filteredMembers.length}</strong> of{' '}
            {members.length} registered member profiles
          </span>
          <span className="text-[11px] text-emerald-700 font-medium">
            National presence across 47 counties verified
          </span>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Member / Registry No</th>
                <th className="py-3 px-3">National ID</th>
                <th className="py-3 px-3">County / Electoral Ward</th>
                <th className="py-3 px-3">Branch & Tier</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">2025 Dues</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {filteredMembers.map((member) => {
                const branchName =
                  branches.find((b) => b.id === member.branchId)?.name || 'Central';

                return (
                  <tr key={member.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{member.fullName}</div>
                      <div className="text-[11px] font-mono text-slate-500">
                        {member.membershipNumber}
                      </div>
                    </td>

                    <td className="py-3 px-3 font-mono text-slate-700">{member.idNumber}</td>

                    <td className="py-3 px-3">
                      <div className="text-slate-800 font-medium">{member.county}</div>
                      <div className="text-[11px] text-slate-500">
                        {member.constituency} • {member.ward}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="text-slate-800 truncate max-w-[140px]">{branchName}</div>
                      <span className="inline-block mt-0.5 px-1.5 py-0.5 text-[9px] font-semibold uppercase rounded bg-slate-100 text-slate-700">
                        {member.tier.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
                          member.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : member.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : member.status === 'suspended'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            member.status === 'active'
                              ? 'bg-emerald-500'
                              : member.status === 'pending'
                              ? 'bg-amber-500'
                              : 'bg-red-500'
                          }`}
                        />
                        {member.status}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      {member.duesStatus === 'paid' ? (
                        <span className="text-emerald-700 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Paid (KES 2,400)
                        </span>
                      ) : member.duesStatus === 'exempt' ? (
                        <span className="text-purple-700 font-medium">Exempt</span>
                      ) : (
                        <div className="space-y-0.5">
                          <span className="text-red-600 font-bold">
                            Overdue KES {member.outstandingDues}
                          </span>
                          <button
                            onClick={() => {
                              setDuesMember(member);
                              setDuesAmount(member.outstandingDues || 2400);
                              setIsDuesModalOpen(true);
                            }}
                            className="block text-[10px] text-red-700 underline font-semibold"
                          >
                            Pay Dues
                          </button>
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedMember(member)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Member Details Profile Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-900 text-white font-bold text-base flex items-center justify-center ring-2 ring-red-100">
                  {selectedMember.fullName
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedMember.fullName}</h3>
                  <div className="text-xs font-mono text-slate-500">
                    Registry Ref: {selectedMember.membershipNumber}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedMember(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              {/* Status and Tier tags */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 capitalize">
                  Status: {selectedMember.status}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 capitalize">
                  Tier: {selectedMember.tier.replace('_', ' ')}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                  {selectedMember.duesStatus === 'paid' ? 'Dues Compliant' : 'Subscription Due'}
                </span>
              </div>

              {/* Electoral & Regional info */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-600" />
                  Electoral Accreditation
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-slate-700">
                  <div>
                    <span className="text-[10px] text-slate-400 block">National ID</span>
                    <span className="font-mono font-bold">{selectedMember.idNumber}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">County</span>
                    <span className="font-medium">{selectedMember.county}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Constituency</span>
                    <span className="font-medium">{selectedMember.constituency}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Electoral Ward</span>
                    <span className="font-medium">{selectedMember.ward}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Assigned Branch</span>
                    <span className="font-medium">
                      {branches.find((b) => b.id === selectedMember.branchId)?.name || 'Central'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Join Date</span>
                    <span className="font-medium">{selectedMember.joinDate}</span>
                  </div>
                </div>
              </div>

              {/* Contact info */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="font-semibold text-slate-900">Contact Details</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedMember.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedMember.email}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedMember.notes && (
                <div>
                  <div className="font-semibold text-slate-900 mb-1">Secretariat Dossier Notes</div>
                  <p className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-slate-600 text-[11px]">
                    {selectedMember.notes}
                  </p>
                </div>
              )}

              {/* Status Update Quick Toggles */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="font-semibold text-slate-700">Update Status:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      const updated = { ...selectedMember, status: 'active' as MemberStatus };
                      onUpdateMember(updated);
                      setSelectedMember(updated);
                    }}
                    className={`px-2 py-1 rounded text-[11px] font-semibold ${
                      selectedMember.status === 'active'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => {
                      const updated = { ...selectedMember, status: 'suspended' as MemberStatus };
                      onUpdateMember(updated);
                      setSelectedMember(updated);
                    }}
                    className={`px-2 py-1 rounded text-[11px] font-semibold ${
                      selectedMember.status === 'suspended'
                        ? 'bg-red-600 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    Suspended
                  </button>
                  <button
                    onClick={() => {
                      const updated = { ...selectedMember, status: 'honorary' as MemberStatus };
                      onUpdateMember(updated);
                      setSelectedMember(updated);
                    }}
                    className={`px-2 py-1 rounded text-[11px] font-semibold ${
                      selectedMember.status === 'honorary'
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    Honorary
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedMember(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-900"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Register Party Member</h3>
                <p className="text-xs text-slate-500">
                  New enrollment into statutory party register
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMember} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name (as per ID)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Gitonga Mwangi"
                    value={newMemberForm.fullName}
                    onChange={(e) =>
                      setNewMemberForm({ ...newMemberForm, fullName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">National ID Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 29481920"
                    value={newMemberForm.idNumber}
                    onChange={(e) =>
                      setNewMemberForm({ ...newMemberForm, idNumber: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number (M-Pesa)</label>
                  <input
                    type="text"
                    required
                    value={newMemberForm.phone}
                    onChange={(e) =>
                      setNewMemberForm({ ...newMemberForm, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="member@example.com"
                    value={newMemberForm.email}
                    onChange={(e) =>
                      setNewMemberForm({ ...newMemberForm, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">County</label>
                  <input
                    type="text"
                    required
                    value={newMemberForm.county}
                    onChange={(e) =>
                      setNewMemberForm({ ...newMemberForm, county: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Constituency</label>
                  <input
                    type="text"
                    required
                    value={newMemberForm.constituency}
                    onChange={(e) =>
                      setNewMemberForm({ ...newMemberForm, constituency: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Electoral Ward</label>
                  <input
                    type="text"
                    required
                    value={newMemberForm.ward}
                    onChange={(e) =>
                      setNewMemberForm({ ...newMemberForm, ward: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Regional Branch</label>
                  <select
                    value={newMemberForm.branchId}
                    onChange={(e) =>
                      setNewMemberForm({ ...newMemberForm, branchId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tier / Role</label>
                  <select
                    value={newMemberForm.tier}
                    onChange={(e) =>
                      setNewMemberForm({ ...newMemberForm, tier: e.target.value as MemberTier })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                  >
                    <option value="regular">Regular Member</option>
                    <option value="delegate">Accredited Delegate</option>
                    <option value="youth_rep">Youth Representative</option>
                    <option value="elder_council">Elders Council</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={newMemberForm.gender}
                    onChange={(e) =>
                      setNewMemberForm({
                        ...newMemberForm,
                        gender: e.target.value as 'male' | 'female' | 'other',
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Remarks / Dossier Notes</label>
                <textarea
                  rows={2}
                  placeholder="Accreditation details, committee assignments..."
                  value={newMemberForm.notes}
                  onChange={(e) =>
                    setNewMemberForm({ ...newMemberForm, notes: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
                >
                  Confirm & Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Dues Payment Modal */}
      {isDuesModalOpen && duesMember && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                Record Member Annual Subscription
              </h3>
              <button
                onClick={() => setIsDuesModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePayDues} className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="font-bold text-slate-900">{duesMember.fullName}</div>
                <div className="text-[11px] text-slate-500">
                  ID: {duesMember.idNumber} • {duesMember.membershipNumber}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Amount (KES)</label>
                <input
                  type="number"
                  value={duesAmount}
                  onChange={(e) => setDuesAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-hidden font-bold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
                <select
                  value={duesChannel}
                  onChange={(e) => setDuesChannel(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                >
                  <option value="mpesa_paybill">M-Pesa Paybill #522522</option>
                  <option value="bank_transfer">Direct Bank Deposit (KCB)</option>
                  <option value="cheque">Secretariat Cheque</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsDuesModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold"
                >
                  Verify & Issue Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Simulated Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl text-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-red-600" />
                Import Certified County Voter Roll
              </h3>
              <button onClick={() => setIsImportModalOpen(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-slate-600">
              Upload CSV or Excel member registers exported from IEBC biometric voter registration or county secretariat records.
            </p>

            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 cursor-pointer">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <div className="font-semibold text-slate-800">Click to upload member roll .CSV</div>
              <div className="text-[10px] text-slate-500 mt-1">Columns: FullName, IDNumber, County, Constituency, Ward, Phone</div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Demo Mode: In a production environment, bulk files are validated against the ORPP national voter register.');
                  setIsImportModalOpen(false);
                }}
                className="px-4 py-1.5 bg-red-600 text-white rounded-lg font-semibold"
              >
                Validate & Ingest
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
