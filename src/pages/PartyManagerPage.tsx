import React, { useState, useEffect } from 'react';
import {
  PartyModule,
  PartyMember,
  PartyBranch,
  PartyDepartment,
  PartyEvent,
  PartyTask,
  PartyCommunication,
  PartyDocument,
  PartyFinanceTransaction,
  PartyAuditLog,
  PartyAdminUser,
  PartyOrganizationSettings,
} from '../types/partyManager';
import {
  DEFAULT_PARTY_SETTINGS,
  DEFAULT_PARTY_BRANCHES,
  DEFAULT_PARTY_DEPARTMENTS,
  DEFAULT_PARTY_MEMBERS,
  DEFAULT_PARTY_EVENTS,
  DEFAULT_PARTY_TASKS,
  DEFAULT_PARTY_COMMS,
  DEFAULT_PARTY_DOCS,
  DEFAULT_PARTY_TRANSACTIONS,
  DEFAULT_PARTY_AUDIT_LOGS,
  DEFAULT_PARTY_ADMIN_USERS,
} from '../data/defaultPartyManagerData';

import { PartySidebar } from '../components/partyManager/PartySidebar';
import { PartyHeader } from '../components/partyManager/PartyHeader';
import { PartyDashboardModule } from '../components/partyManager/PartyDashboardModule';
import { PartyOrgModule } from '../components/partyManager/PartyOrgModule';
import { PartyMembersModule } from '../components/partyManager/PartyMembersModule';
import { PartyBranchesModule } from '../components/partyManager/PartyBranchesModule';
import { PartyEventsModule } from '../components/partyManager/PartyEventsModule';
import { PartyTasksModule } from '../components/partyManager/PartyTasksModule';
import { PartyCommsModule } from '../components/partyManager/PartyCommsModule';
import { PartyDocsModule } from '../components/partyManager/PartyDocsModule';
import { PartyFinanceModule } from '../components/partyManager/PartyFinanceModule';
import { PartyReportsModule } from '../components/partyManager/PartyReportsModule';
import { PartyAdminModule } from '../components/partyManager/PartyAdminModule';

interface PartyManagerPageProps {
  onBackToPaperglow: () => void;
}

export const PartyManagerPage: React.FC<PartyManagerPageProps> = ({ onBackToPaperglow }) => {
  const [currentModule, setCurrentModule] = useState<PartyModule>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Toast alert
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Local state persistence
  const [settings, setSettings] = useState<PartyOrganizationSettings>(() => {
    const saved = localStorage.getItem('paperglow_party_settings');
    return saved ? JSON.parse(saved) : DEFAULT_PARTY_SETTINGS;
  });

  const [branches, setBranches] = useState<PartyBranch[]>(() => {
    const saved = localStorage.getItem('paperglow_party_branches');
    return saved ? JSON.parse(saved) : DEFAULT_PARTY_BRANCHES;
  });

  const [departments] = useState<PartyDepartment[]>(DEFAULT_PARTY_DEPARTMENTS);

  const [members, setMembers] = useState<PartyMember[]>(() => {
    const saved = localStorage.getItem('paperglow_party_members');
    return saved ? JSON.parse(saved) : DEFAULT_PARTY_MEMBERS;
  });

  const [events, setEvents] = useState<PartyEvent[]>(() => {
    const saved = localStorage.getItem('paperglow_party_events');
    return saved ? JSON.parse(saved) : DEFAULT_PARTY_EVENTS;
  });

  const [tasks, setTasks] = useState<PartyTask[]>(() => {
    const saved = localStorage.getItem('paperglow_party_tasks');
    return saved ? JSON.parse(saved) : DEFAULT_PARTY_TASKS;
  });

  const [communications, setCommunications] = useState<PartyCommunication[]>(() => {
    const saved = localStorage.getItem('paperglow_party_comms');
    return saved ? JSON.parse(saved) : DEFAULT_PARTY_COMMS;
  });

  const [documents, setDocuments] = useState<PartyDocument[]>(() => {
    const saved = localStorage.getItem('paperglow_party_docs');
    return saved ? JSON.parse(saved) : DEFAULT_PARTY_DOCS;
  });

  const [transactions, setTransactions] = useState<PartyFinanceTransaction[]>(() => {
    const saved = localStorage.getItem('paperglow_party_txns');
    return saved ? JSON.parse(saved) : DEFAULT_PARTY_TRANSACTIONS;
  });

  const [auditLogs, setAuditLogs] = useState<PartyAuditLog[]>(() => {
    const saved = localStorage.getItem('paperglow_party_audit');
    return saved ? JSON.parse(saved) : DEFAULT_PARTY_AUDIT_LOGS;
  });

  const [adminUsers, setAdminUsers] = useState<PartyAdminUser[]>(() => {
    const saved = localStorage.getItem('paperglow_party_users');
    return saved ? JSON.parse(saved) : DEFAULT_PARTY_ADMIN_USERS;
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('paperglow_party_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('paperglow_party_branches', JSON.stringify(branches));
  }, [branches]);

  useEffect(() => {
    localStorage.setItem('paperglow_party_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('paperglow_party_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('paperglow_party_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('paperglow_party_comms', JSON.stringify(communications));
  }, [communications]);

  useEffect(() => {
    localStorage.setItem('paperglow_party_docs', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('paperglow_party_txns', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('paperglow_party_audit', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('paperglow_party_users', JSON.stringify(adminUsers));
  }, [adminUsers]);

  // Handler: Add Member
  const handleAddMember = (newMember: PartyMember) => {
    setMembers((prev) => [newMember, ...prev]);

    // Update branch count
    setBranches((prev) =>
      prev.map((b) => (b.id === newMember.branchId ? { ...b, memberCount: b.memberCount + 1 } : b))
    );

    // Audit log
    const log: PartyAuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actorName: 'Adv. Kenneth Omondi Otieno',
      actorRole: 'Secretary General',
      action: 'REGISTER_MEMBER',
      module: 'members',
      details: `Enrolled ${newMember.fullName} (Ref: ${newMember.membershipNumber}) under ${newMember.county} County.`,
      ipAddress: '197.232.88.14',
    };
    setAuditLogs((prev) => [log, ...prev]);
    showToast(`Member ${newMember.fullName} (${newMember.membershipNumber}) registered.`);
  };

  // Handler: Update Member
  const handleUpdateMember = (updated: PartyMember) => {
    setMembers((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    showToast(`Updated dossier for ${updated.fullName}.`);
  };

  // Handler: Record Member Dues Payment
  const handleRecordDuesPayment = (memberId: string, amount: number, channel: string) => {
    const member = members.find((m) => m.id === memberId);
    if (!member) return;

    const today = new Date().toISOString().split('T')[0];
    const updatedMember: PartyMember = {
      ...member,
      duesStatus: 'paid',
      outstandingDues: 0,
      lastDuesPaymentDate: today,
    };
    setMembers((prev) => prev.map((m) => (m.id === memberId ? updatedMember : m)));

    // Add financial transaction
    const newTxn: PartyFinanceTransaction = {
      id: `fin-${Date.now()}`,
      referenceNo: `TXN-2025-${Math.floor(100 + Math.random() * 900)}`,
      type: 'membership_dues',
      direction: 'income',
      amount,
      date: today,
      partyOrMemberName: `${member.fullName} (${member.membershipNumber})`,
      branchId: member.branchId,
      paymentChannel: channel as any,
      status: 'verified',
      description: `Annual subscription renewal payment via ${channel.replace('_', ' ')}`,
    };
    setTransactions((prev) => [newTxn, ...prev]);

    showToast(`Dues of KES ${amount.toLocaleString()} recorded for ${member.fullName}.`);
  };

  // Handler: Add Branch
  const handleAddBranch = (branch: PartyBranch) => {
    setBranches((prev) => [...prev, branch]);
    showToast(`Regional chapter "${branch.name}" established.`);
  };

  // Handler: Update Branch
  const handleUpdateBranch = (branch: PartyBranch) => {
    setBranches((prev) => prev.map((b) => (b.id === branch.id ? branch : b)));
    showToast(`Branch "${branch.name}" configuration saved.`);
  };

  // Handler: Add Event
  const handleAddEvent = (event: PartyEvent) => {
    setEvents((prev) => [event, ...prev]);
    showToast(`Assembly "${event.title}" scheduled.`);
  };

  // Handler: Update Event
  const handleUpdateEvent = (event: PartyEvent) => {
    setEvents((prev) => prev.map((e) => (e.id === event.id ? event : e)));
    showToast(`Meeting session "${event.title}" updated.`);
  };

  // Handler: Add Task
  const handleAddTask = (task: PartyTask) => {
    setTasks((prev) => [task, ...prev]);
    showToast(`Task assigned to ${task.assignedTo}.`);
  };

  // Handler: Update Task
  const handleUpdateTask = (task: PartyTask) => {
    setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
    showToast(`Task status updated to ${task.status.replace('_', ' ')}.`);
  };

  // Handler: Add Communication
  const handleAddCommunication = (comm: PartyCommunication) => {
    setCommunications((prev) => [comm, ...prev]);
    showToast(`Communiqué "${comm.title}" dispatched.`);
  };

  // Handler: Add Document
  const handleAddDocument = (doc: PartyDocument) => {
    setDocuments((prev) => [doc, ...prev]);
    showToast(`Document "${doc.title}" archived in legal vault.`);
  };

  // Handler: Add Transaction
  const handleAddTransaction = (txn: PartyFinanceTransaction) => {
    setTransactions((prev) => [txn, ...prev]);
    showToast(`Ledger entry ${txn.referenceNo} (KES ${txn.amount.toLocaleString()}) committed.`);
  };

  // Handler: Add Admin User
  const handleAddUser = (user: PartyAdminUser) => {
    setAdminUsers((prev) => [...prev, user]);
    showToast(`Officer account created for ${user.name}.`);
  };

  // Handler: Reset Demo Data
  const handleResetData = () => {
    if (confirm('Reset all Paperglow Political Party Manager demo state to default Kenyan party records?')) {
      localStorage.removeItem('paperglow_party_settings');
      localStorage.removeItem('paperglow_party_branches');
      localStorage.removeItem('paperglow_party_members');
      localStorage.removeItem('paperglow_party_events');
      localStorage.removeItem('paperglow_party_tasks');
      localStorage.removeItem('paperglow_party_comms');
      localStorage.removeItem('paperglow_party_docs');
      localStorage.removeItem('paperglow_party_txns');
      localStorage.removeItem('paperglow_party_audit');
      localStorage.removeItem('paperglow_party_users');

      setSettings(DEFAULT_PARTY_SETTINGS);
      setBranches(DEFAULT_PARTY_BRANCHES);
      setMembers(DEFAULT_PARTY_MEMBERS);
      setEvents(DEFAULT_PARTY_EVENTS);
      setTasks(DEFAULT_PARTY_TASKS);
      setCommunications(DEFAULT_PARTY_COMMS);
      setDocuments(DEFAULT_PARTY_DOCS);
      setTransactions(DEFAULT_PARTY_TRANSACTIONS);
      setAuditLogs(DEFAULT_PARTY_AUDIT_LOGS);
      setAdminUsers(DEFAULT_PARTY_ADMIN_USERS);

      showToast('Party registry state reset to default demo dataset.');
    }
  };

  // Quick Action Modals State
  const [quickAddMemberOpen, setQuickAddMemberOpen] = useState(false);
  const [quickScheduleEventOpen, setQuickScheduleEventOpen] = useState(false);
  const [quickFinanceOpen, setQuickFinanceOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 text-xs flex items-center gap-2 animate-in slide-in-from-bottom duration-200">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar */}
      <PartySidebar
        currentModule={currentModule}
        onSelectModule={setCurrentModule}
        onBackToPaperglow={onBackToPaperglow}
        memberCount={members.length}
        openTasksCount={tasks.filter((t) => t.status !== 'completed').length}
        upcomingEventsCount={events.filter((e) => e.status === 'upcoming').length}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <PartyHeader
          currentModule={currentModule}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          branches={branches}
          selectedBranchId={selectedBranchId}
          onSelectBranchId={setSelectedBranchId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onQuickAddMember={() => setCurrentModule('members')}
          onQuickScheduleEvent={() => setCurrentModule('events')}
          onQuickRecordFinance={() => setCurrentModule('finance')}
        />

        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto pb-16">
          {currentModule === 'dashboard' && (
            <PartyDashboardModule
              members={members}
              branches={branches}
              events={events}
              tasks={tasks}
              transactions={transactions}
              communications={communications}
              onNavigate={(mod) => setCurrentModule(mod)}
              onQuickAddMember={() => setCurrentModule('members')}
              onQuickScheduleEvent={() => setCurrentModule('events')}
              onQuickRecordFinance={() => setCurrentModule('finance')}
            />
          )}

          {currentModule === 'organization' && (
            <PartyOrgModule
              settings={settings}
              departments={departments}
              branches={branches}
              onUpdateSettings={setSettings}
              onNavigateToBranches={() => setCurrentModule('branches')}
              onNavigateToDocuments={() => setCurrentModule('documents')}
            />
          )}

          {currentModule === 'members' && (
            <PartyMembersModule
              members={members}
              branches={branches}
              onAddMember={handleAddMember}
              onUpdateMember={handleUpdateMember}
              onRecordDuesPayment={handleRecordDuesPayment}
            />
          )}

          {currentModule === 'branches' && (
            <PartyBranchesModule
              branches={branches}
              members={members}
              onAddBranch={handleAddBranch}
              onUpdateBranch={handleUpdateBranch}
            />
          )}

          {currentModule === 'events' && (
            <PartyEventsModule
              events={events}
              branches={branches}
              onAddEvent={handleAddEvent}
              onUpdateEvent={handleUpdateEvent}
            />
          )}

          {currentModule === 'tasks' && (
            <PartyTasksModule
              tasks={tasks}
              departments={departments}
              branches={branches}
              onAddTask={handleAddTask}
              onUpdateTask={handleUpdateTask}
            />
          )}

          {currentModule === 'communications' && (
            <PartyCommsModule
              communications={communications}
              onAddCommunication={handleAddCommunication}
            />
          )}

          {currentModule === 'documents' && (
            <PartyDocsModule
              documents={documents}
              onAddDocument={handleAddDocument}
            />
          )}

          {currentModule === 'finance' && (
            <PartyFinanceModule
              transactions={transactions}
              branches={branches}
              onAddTransaction={handleAddTransaction}
            />
          )}

          {currentModule === 'reports' && (
            <PartyReportsModule
              members={members}
              branches={branches}
              events={events}
              transactions={transactions}
              auditLogs={auditLogs}
            />
          )}

          {currentModule === 'admin' && (
            <PartyAdminModule
              adminUsers={adminUsers}
              auditLogs={auditLogs}
              settings={settings}
              branches={branches}
              onAddUser={handleAddUser}
              onUpdateUser={(updated) =>
                setAdminUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)))
              }
              onUpdateSettings={setSettings}
            />
          )}

          {/* Reset Demo Data & Info Footer */}
          <div className="mt-12 pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div>
              <strong>Paperglow Political Party Manager</strong> • Registered Under Political Parties Act 2011 (Cap 7D).
            </div>
            <button
              onClick={handleResetData}
              className="text-slate-400 hover:text-red-600 underline font-medium transition-colors"
            >
              Reset Demo Records to Factory Defaults
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};
