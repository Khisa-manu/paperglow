import React, { useState, useMemo } from 'react';
import { Member, MemberRole, MemberStatus, GroupProfile } from '../../types/chamaManager';
import {
  Users,
  Search,
  Plus,
  Filter,
  Phone,
  Mail,
  Award,
  CreditCard,
  Banknote,
  Trash2,
  Eye,
  CheckCircle2,
  Calendar,
  UserCheck,
} from 'lucide-react';

interface MembersModuleProps {
  members: Member[];
  group: GroupProfile;
  onOpenAddMember: () => void;
  onDeleteMember: (memberId: string) => void;
  onSelectMemberForDoc: (memberId: string) => void;
  onViewMemberDossier: (member: Member) => void;
}

export const MembersModule: React.FC<MembersModuleProps> = ({
  members,
  group,
  onOpenAddMember,
  onDeleteMember,
  onSelectMemberForDoc,
  onViewMemberDossier,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchesSearch =
        m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.membershipNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.phone.includes(searchQuery) ||
        m.idNumber.includes(searchQuery);

      const matchesRole = roleFilter === 'all' || m.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || m.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [members, searchQuery, roleFilter, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h2 className="text-xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 flex items-center space-x-2">
            <Users className="w-5 h-5 text-red-600" />
            <span>Members Directory &amp; Shareholding Register</span>
          </h2>
          <p className="text-xs text-neutral-500">
            {members.length} registered members · Total pooled shares {members.reduce((s, m) => s + m.sharesUnits, 0)} units
          </p>
        </div>

        <button
          onClick={onOpenAddMember}
          className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Member</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, UB number, phone or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-red-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 font-medium"
          >
            <option value="all">All Roles</option>
            <option value="Chairperson">Chairperson</option>
            <option value="Vice-Chairperson">Vice-Chairperson</option>
            <option value="Secretary">Secretary</option>
            <option value="Treasurer">Treasurer</option>
            <option value="Welfare Coordinator">Welfare Coordinator</option>
            <option value="Committee Member">Committee Member</option>
            <option value="Member">Ordinary Member</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="probation">Probation</option>
            <option value="dormant">Dormant</option>
          </select>
        </div>
      </div>

      {/* Members Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            className="p-5 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-xs hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex flex-col justify-between space-y-4"
          >
            {/* Member Card Top Bar */}
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 flex items-center justify-center font-bold text-sm border border-neutral-200 dark:border-neutral-700 font-mono">
                  {member.membershipNumber.replace('UB-', '')}
                </div>
                <div>
                  <h3 className="text-sm font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 leading-tight">
                    {member.fullName}
                  </h3>
                  <div className="flex items-center space-x-1.5 mt-0.5">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900">
                      {member.role}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {member.membershipNumber}
                    </span>
                  </div>
                </div>
              </div>

              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  member.status === 'active'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
                }`}
              >
                {member.status}
              </span>
            </div>

            {/* Contact Details */}
            <div className="space-y-1 text-xs text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-900/60 p-2.5 rounded-lg border border-neutral-100 dark:border-neutral-800/80">
              <div className="flex items-center space-x-2 text-[11px]">
                <Phone className="w-3.5 h-3.5 text-neutral-400" />
                <span>{member.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-[11px]">
                <Mail className="w-3.5 h-3.5 text-neutral-400" />
                <span className="truncate">{member.email}</span>
              </div>
              <div className="text-[11px] text-neutral-500 pt-0.5">
                Nat. ID: <strong className="text-neutral-800 dark:text-neutral-200 font-mono">{member.idNumber}</strong> · Res: {member.residentialArea}
              </div>
            </div>

            {/* Financial Ledger Mini-Metrics */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="p-2 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800">
                <span className="text-[10px] text-neutral-400 uppercase block font-medium">
                  Total Savings
                </span>
                <span className="font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
                  KES {member.totalContributionsKes.toLocaleString()}
                </span>
              </div>

              <div className="p-2 rounded bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800">
                <span className="text-[10px] text-neutral-400 uppercase block font-medium">
                  Loan Balance
                </span>
                <span
                  className={`font-bold tabular-nums ${
                    member.currentLoanBalanceKes > 0
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-neutral-400'
                  }`}
                >
                  {member.currentLoanBalanceKes > 0
                    ? `KES ${member.currentLoanBalanceKes.toLocaleString()}`
                    : 'Nil'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
              <button
                onClick={() => onViewMemberDossier(member)}
                className="text-neutral-700 dark:text-neutral-300 hover:text-red-600 font-semibold flex items-center space-x-1 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Dossier</span>
              </button>

              <button
                onClick={() => onSelectMemberForDoc(member.id)}
                className="text-red-600 dark:text-red-400 hover:underline font-bold flex items-center space-x-1 cursor-pointer"
              >
                <Award className="w-3.5 h-3.5" />
                <span>ID &amp; Cert</span>
              </button>

              <button
                onClick={() => {
                  if (confirm(`Are you sure you want to remove member ${member.fullName} from ${group.name}?`)) {
                    onDeleteMember(member.id);
                  }
                }}
                className="text-neutral-400 hover:text-red-600 cursor-pointer"
                title="Remove Member"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
