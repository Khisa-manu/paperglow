import React, { useState, useEffect } from 'react';
import {
  LegalModule,
  LegalMatter,
  LegalClient,
  CourtHearingEvent,
  LegalDeadline,
  LegalDocument,
  LegalTask,
  TimeEntry,
  LegalInvoice,
  ClientCommunication,
  LegalStaff,
  LawFirmSettings,
  MatterStatus,
  TaskStatus,
  PaymentMethod,
} from '../types/legalPractice';

import {
  DEFAULT_LAW_FIRM_SETTINGS,
  DEFAULT_LEGAL_STAFF,
  DEFAULT_LEGAL_CLIENTS,
  DEFAULT_LEGAL_MATTERS,
  DEFAULT_COURT_HEARINGS,
  DEFAULT_LEGAL_DEADLINES,
  DEFAULT_LEGAL_DOCUMENTS,
  DEFAULT_LEGAL_TASKS,
  DEFAULT_TIME_ENTRIES,
  DEFAULT_LEGAL_INVOICES,
  DEFAULT_CLIENT_COMMUNICATIONS,
} from '../data/defaultLegalPracticeData';

import { LegalPracticeHeader } from '../components/legalPractice/LegalPracticeHeader';
import { LegalPracticeSidebar } from '../components/legalPractice/LegalPracticeSidebar';
import { DashboardModule } from '../components/legalPractice/DashboardModule';
import { MattersModule } from '../components/legalPractice/MattersModule';
import { ClientsModule } from '../components/legalPractice/ClientsModule';
import { CourtDeadlinesModule } from '../components/legalPractice/CourtDeadlinesModule';
import { DocumentsModule } from '../components/legalPractice/DocumentsModule';
import { TasksModule } from '../components/legalPractice/TasksModule';
import { TimeTrackingModule } from '../components/legalPractice/TimeTrackingModule';
import { BillingModule } from '../components/legalPractice/BillingModule';
import { CalendarModule } from '../components/legalPractice/CalendarModule';
import { CommunicationsModule } from '../components/legalPractice/CommunicationsModule';
import { ReportsModule } from '../components/legalPractice/ReportsModule';
import { TeamModule } from '../components/legalPractice/TeamModule';
import { SettingsModule } from '../components/legalPractice/SettingsModule';
import { CreateMatterModal } from '../components/legalPractice/CreateMatterModal';
import { CheckCircle2, ShieldAlert } from 'lucide-react';

interface LegalPracticePageProps {
  onBackToPaperglow: () => void;
}

export const LegalPracticePage: React.FC<LegalPracticePageProps> = ({
  onBackToPaperglow,
}) => {
  const [currentModule, setCurrentModule] = useState<LegalModule>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCreateMatterOpen, setIsCreateMatterOpen] = useState(false);

  // Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  // LocalStorage-backed state
  const [matters, setMatters] = useState<LegalMatter[]>(() => {
    const saved = localStorage.getItem('paperglow_legal_matters');
    return saved ? JSON.parse(saved) : DEFAULT_LEGAL_MATTERS;
  });

  const [clients, setClients] = useState<LegalClient[]>(() => {
    const saved = localStorage.getItem('paperglow_legal_clients');
    return saved ? JSON.parse(saved) : DEFAULT_LEGAL_CLIENTS;
  });

  const [hearings, setHearings] = useState<CourtHearingEvent[]>(() => {
    const saved = localStorage.getItem('paperglow_legal_hearings');
    return saved ? JSON.parse(saved) : DEFAULT_COURT_HEARINGS;
  });

  const [deadlines, setDeadlines] = useState<LegalDeadline[]>(() => {
    const saved = localStorage.getItem('paperglow_legal_deadlines');
    return saved ? JSON.parse(saved) : DEFAULT_LEGAL_DEADLINES;
  });

  const [documents, setDocuments] = useState<LegalDocument[]>(() => {
    const saved = localStorage.getItem('paperglow_legal_documents');
    return saved ? JSON.parse(saved) : DEFAULT_LEGAL_DOCUMENTS;
  });

  const [tasks, setTasks] = useState<LegalTask[]>(() => {
    const saved = localStorage.getItem('paperglow_legal_tasks');
    return saved ? JSON.parse(saved) : DEFAULT_LEGAL_TASKS;
  });

  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(() => {
    const saved = localStorage.getItem('paperglow_legal_time_entries');
    return saved ? JSON.parse(saved) : DEFAULT_TIME_ENTRIES;
  });

  const [invoices, setInvoices] = useState<LegalInvoice[]>(() => {
    const saved = localStorage.getItem('paperglow_legal_invoices');
    return saved ? JSON.parse(saved) : DEFAULT_LEGAL_INVOICES;
  });

  const [communications, setCommunications] = useState<ClientCommunication[]>(() => {
    const saved = localStorage.getItem('paperglow_legal_communications');
    return saved ? JSON.parse(saved) : DEFAULT_CLIENT_COMMUNICATIONS;
  });

  const [staff, setStaff] = useState<LegalStaff[]>(() => {
    const saved = localStorage.getItem('paperglow_legal_staff');
    return saved ? JSON.parse(saved) : DEFAULT_LEGAL_STAFF;
  });

  const [settings, setSettings] = useState<LawFirmSettings>(() => {
    const saved = localStorage.getItem('paperglow_legal_settings');
    return saved ? JSON.parse(saved) : DEFAULT_LAW_FIRM_SETTINGS;
  });

  const [isDark, setIsDark] = useState<boolean>(() => {
    return document.documentElement.classList.contains('dark');
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('paperglow_legal_matters', JSON.stringify(matters));
  }, [matters]);

  useEffect(() => {
    localStorage.setItem('paperglow_legal_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('paperglow_legal_hearings', JSON.stringify(hearings));
  }, [hearings]);

  useEffect(() => {
    localStorage.setItem('paperglow_legal_deadlines', JSON.stringify(deadlines));
  }, [deadlines]);

  useEffect(() => {
    localStorage.setItem('paperglow_legal_documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('paperglow_legal_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('paperglow_legal_time_entries', JSON.stringify(timeEntries));
  }, [timeEntries]);

  useEffect(() => {
    localStorage.setItem('paperglow_legal_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('paperglow_legal_communications', JSON.stringify(communications));
  }, [communications]);

  useEffect(() => {
    localStorage.setItem('paperglow_legal_staff', JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    localStorage.setItem('paperglow_legal_settings', JSON.stringify(settings));
  }, [settings]);

  // Dark mode toggle
  const toggleDarkMode = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Metrics
  const activeMattersCount = matters.filter((m) => m.status !== 'closed').length;
  const upcomingCourtCount = hearings.filter((h) => h.status === 'upcoming').length;
  const urgentDeadlinesCount = deadlines.filter((d) => !d.isCompleted && d.priority === 'urgent').length;
  const openTasksCount = tasks.filter((t) => t.status !== 'completed').length;
  const overdueInvoicesCount = invoices.filter((inv) => inv.status === 'overdue' || inv.status === 'issued').length;

  // Handlers
  const handleSaveMatter = (
    matterData: Omit<LegalMatter, 'id' | 'totalBilledKes' | 'totalPaidKes' | 'outstandingBalanceKes' | 'totalHoursRecorded' | 'timeline' | 'updatedAt'>
  ) => {
    const newId = `mat-${Date.now().toString().slice(-4)}`;
    const newMatter: LegalMatter = {
      ...matterData,
      id: newId,
      totalBilledKes: 0,
      totalPaidKes: 0,
      outstandingBalanceKes: 0,
      totalHoursRecorded: 0,
      timeline: [
        {
          id: `t-${Date.now().toString().slice(-3)}`,
          date: matterData.filingDate,
          title: 'Matter File Registered in Practice Docket',
          description: `Matter opened under file reference ${matterData.matterNumber}. Lead advocate: ${matterData.assignedAdvocateName}.`,
          performedBy: matterData.assignedAdvocateName,
          category: 'pleading',
        },
      ],
      updatedAt: new Date().toISOString(),
    };

    setMatters((prev) => [newMatter, ...prev]);

    // If court date specified, automatically add to court hearings diary
    if (matterData.nextCourtDate) {
      const newHearing: CourtHearingEvent = {
        id: `hrg-${Date.now().toString().slice(-4)}`,
        matterId: newMatter.id,
        matterNumber: newMatter.matterNumber,
        matterTitle: newMatter.title,
        courtForum: newMatter.courtForum || 'High Court (Commercial & Tax Division)',
        courtRoom: 'Courtroom 4, Milimani Law Courts',
        presidingJudge: newMatter.caseJudge || 'Hon. Judge Assigned',
        hearingType: 'Formal Hearing',
        date: matterData.nextCourtDate,
        time: '09:30 AM',
        advocateInCharge: newMatter.assignedAdvocateName,
        isVirtualCourt: false,
        reminderSent: false,
        notes: matterData.nextCourtPurpose || 'Initial mention / directions',
        status: 'upcoming',
      };
      setHearings((prev) => [newHearing, ...prev]);
    }

    showToast(`Case matter "${newMatter.matterNumber}" registered successfully.`);
  };

  const handleUpdateMatterStatus = (matterId: string, newStatus: MatterStatus) => {
    setMatters((prev) =>
      prev.map((m) =>
        m.id === matterId
          ? {
              ...m,
              status: newStatus,
              updatedAt: new Date().toISOString(),
            }
          : m
      )
    );
    showToast(`Matter status updated to "${newStatus.replace('_', ' ').toUpperCase()}".`);
  };

  const handleDeleteMatter = (matterId: string) => {
    const mat = matters.find((m) => m.id === matterId);
    setMatters((prev) => prev.filter((m) => m.id !== matterId));
    showToast(`Matter "${mat?.matterNumber || matterId}" deleted.`);
  };

  const handleAddClient = (
    clientData: Omit<LegalClient, 'id' | 'clientNumber' | 'totalBilledKes' | 'outstandingBalanceKes' | 'createdAt'>
  ) => {
    const newId = `cl-${Date.now().toString().slice(-4)}`;
    const newClient: LegalClient = {
      ...clientData,
      id: newId,
      clientNumber: `CLI-2026-${Math.floor(100 + Math.random() * 900)}`,
      totalBilledKes: 0,
      outstandingBalanceKes: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setClients((prev) => [newClient, ...prev]);
    showToast(`Client "${newClient.name}" added to practice directory.`);
  };

  const handleAddHearing = (hearingData: Omit<CourtHearingEvent, 'id' | 'reminderSent'>) => {
    const newId = `hrg-${Date.now().toString().slice(-4)}`;
    const newHearing: CourtHearingEvent = {
      ...hearingData,
      id: newId,
      reminderSent: false,
    };
    setHearings((prev) => [newHearing, ...prev]);
    showToast(`Court hearing docketed for ${newHearing.date} (${newHearing.matterNumber}).`);
  };

  const handleAddDeadline = (deadlineData: Omit<LegalDeadline, 'id' | 'isCompleted'>) => {
    const newId = `dl-${Date.now().toString().slice(-4)}`;
    const newDeadline: LegalDeadline = {
      ...deadlineData,
      id: newId,
      isCompleted: false,
    };
    setDeadlines((prev) => [newDeadline, ...prev]);
    showToast(`Deadline "${newDeadline.title}" set for ${newDeadline.dueDate}.`);
  };

  const handleToggleDeadline = (deadlineId: string) => {
    setDeadlines((prev) =>
      prev.map((d) => (d.id === deadlineId ? { ...d, isCompleted: !d.isCompleted } : d))
    );
    showToast('Deadline status updated.');
  };

  const handleUploadDocument = (docData: Omit<LegalDocument, 'id' | 'uploadedAt'>) => {
    const newId = `doc-${Date.now().toString().slice(-4)}`;
    const newDoc: LegalDocument = {
      ...docData,
      id: newId,
      uploadedAt: new Date().toISOString(),
    };
    setDocuments((prev) => [newDoc, ...prev]);
    showToast(`Document "${newDoc.fileName}" indexed successfully.`);
  };

  const handleAddTask = (taskData: Omit<LegalTask, 'id' | 'createdAt'>) => {
    const newId = `tsk-${Date.now().toString().slice(-4)}`;
    const newTask: LegalTask = {
      ...taskData,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTasks((prev) => [newTask, ...prev]);
    showToast(`Task "${newTask.title}" assigned to ${newTask.assignedStaffName}.`);
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
    showToast(`Task status updated to "${newStatus.replace('_', ' ')}".`);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    showToast('Task removed.');
  };

  const handleAddTimeEntry = (entryData: Omit<TimeEntry, 'id'>) => {
    const newId = `time-${Date.now().toString().slice(-4)}`;
    const newEntry: TimeEntry = {
      ...entryData,
      id: newId,
    };
    setTimeEntries((prev) => [newEntry, ...prev]);

    // Update total hours on matter
    setMatters((prev) =>
      prev.map((m) =>
        m.id === entryData.matterId
          ? {
              ...m,
              totalHoursRecorded: m.totalHoursRecorded + entryData.durationMinutes / 60,
            }
          : m
      )
    );

    showToast(`Logged ${(entryData.durationMinutes / 60).toFixed(1)} hrs for ${entryData.matterNumber}.`);
  };

  const handleCreateInvoice = (invoiceData: Omit<LegalInvoice, 'id'>) => {
    const newId = `inv-${Date.now().toString().slice(-4)}`;
    const newInvoice: LegalInvoice = {
      ...invoiceData,
      id: newId,
    };
    setInvoices((prev) => [newInvoice, ...prev]);

    // Update client and matter outstanding balance
    setMatters((prev) =>
      prev.map((m) =>
        m.id === invoiceData.matterId
          ? {
              ...m,
              totalBilledKes: m.totalBilledKes + invoiceData.grandTotalKes,
              outstandingBalanceKes: m.outstandingBalanceKes + invoiceData.balanceDueKes,
            }
          : m
      )
    );

    setClients((prev) =>
      prev.map((c) =>
        c.id === invoiceData.clientId
          ? {
              ...c,
              totalBilledKes: c.totalBilledKes + invoiceData.grandTotalKes,
              outstandingBalanceKes: c.outstandingBalanceKes + invoiceData.balanceDueKes,
            }
          : c
      )
    );

    showToast(`Fee note "${newInvoice.invoiceNumber}" issued (KES ${newInvoice.grandTotalKes.toLocaleString()}).`);
  };

  const handleRecordPayment = (
    invoiceId: string,
    amountPaidKes: number,
    method: PaymentMethod,
    refNumber: string
  ) => {
    const targetInvoice = invoices.find((inv) => inv.id === invoiceId);
    if (!targetInvoice) return;

    const newAmountPaid = targetInvoice.amountPaidKes + amountPaidKes;
    const newBalanceDue = Math.max(0, targetInvoice.grandTotalKes - newAmountPaid);
    const newStatus = newBalanceDue === 0 ? 'paid' : 'partially_paid';

    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId
          ? {
              ...inv,
              amountPaidKes: newAmountPaid,
              balanceDueKes: newBalanceDue,
              status: newStatus,
              paymentMethod: method,
              paymentReference: refNumber,
            }
          : inv
      )
    );

    // Update matter balance
    setMatters((prev) =>
      prev.map((m) =>
        m.id === targetInvoice.matterId
          ? {
              ...m,
              totalPaidKes: m.totalPaidKes + amountPaidKes,
              outstandingBalanceKes: Math.max(0, m.outstandingBalanceKes - amountPaidKes),
            }
          : m
      )
    );

    // Update client balance
    setClients((prev) =>
      prev.map((c) =>
        c.id === targetInvoice.clientId
          ? {
              ...c,
              outstandingBalanceKes: Math.max(0, c.outstandingBalanceKes - amountPaidKes),
            }
          : c
      )
    );

    showToast(`Recorded payment of KES ${amountPaidKes.toLocaleString()} (Ref: ${refNumber}).`);
  };

  const handleAddCommunication = (commData: Omit<ClientCommunication, 'id'>) => {
    const newId = `comm-${Date.now().toString().slice(-4)}`;
    const newComm: ClientCommunication = {
      ...commData,
      id: newId,
    };
    setCommunications((prev) => [newComm, ...prev]);
    showToast(`Logged communication with ${newComm.clientName}.`);
  };

  const handleAddStaff = (staffData: Omit<LegalStaff, 'id' | 'activeMattersCount'>) => {
    const newId = `staff-${Date.now().toString().slice(-4)}`;
    const newStaff: LegalStaff = {
      ...staffData,
      id: newId,
      activeMattersCount: 0,
    };
    setStaff((prev) => [...prev, newStaff]);
    showToast(`Practice member "${newStaff.name}" registered.`);
  };

  const handleResetDemoData = () => {
    setMatters(DEFAULT_LEGAL_MATTERS);
    setClients(DEFAULT_LEGAL_CLIENTS);
    setHearings(DEFAULT_COURT_HEARINGS);
    setDeadlines(DEFAULT_LEGAL_DEADLINES);
    setDocuments(DEFAULT_LEGAL_DOCUMENTS);
    setTasks(DEFAULT_LEGAL_TASKS);
    setTimeEntries(DEFAULT_TIME_ENTRIES);
    setInvoices(DEFAULT_LEGAL_INVOICES);
    setCommunications(DEFAULT_CLIENT_COMMUNICATIONS);
    setStaff(DEFAULT_LEGAL_STAFF);
    setSettings(DEFAULT_LAW_FIRM_SETTINGS);

    localStorage.removeItem('paperglow_legal_matters');
    localStorage.removeItem('paperglow_legal_clients');
    localStorage.removeItem('paperglow_legal_hearings');
    localStorage.removeItem('paperglow_legal_deadlines');
    localStorage.removeItem('paperglow_legal_documents');
    localStorage.removeItem('paperglow_legal_tasks');
    localStorage.removeItem('paperglow_legal_time_entries');
    localStorage.removeItem('paperglow_legal_invoices');
    localStorage.removeItem('paperglow_legal_communications');
    localStorage.removeItem('paperglow_legal_staff');
    localStorage.removeItem('paperglow_legal_settings');

    showToast('Reset to default Paperglow Legal Practice Manager demo data.');
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#0c0e12] text-neutral-900 dark:text-neutral-100 flex flex-col font-['DM_Sans']">
      {/* Top Header */}
      <LegalPracticeHeader
        currentModule={currentModule}
        onOpenCreateMatter={() => setIsCreateMatterOpen(true)}
        onBackToPaperglow={onBackToPaperglow}
        isDark={isDark}
        toggleDarkMode={toggleDarkMode}
        upcomingCourtCount={upcomingCourtCount}
        urgentDeadlinesCount={urgentDeadlinesCount}
        overdueInvoicesCount={overdueInvoicesCount}
        firmName={settings.firmName}
      />

      {/* Main Flex Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <LegalPracticeSidebar
          currentModule={currentModule}
          onSelectModule={(mod) => setCurrentModule(mod)}
          activeMattersCount={activeMattersCount}
          upcomingCourtCount={upcomingCourtCount}
          urgentDeadlinesCount={urgentDeadlinesCount}
          openTasksCount={openTasksCount}
          overdueInvoicesCount={overdueInvoicesCount}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          onOpenCreateMatter={() => setIsCreateMatterOpen(true)}
        />

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
          <div>
            {/* Toast Notification Banner */}
            {toastMessage && (
              <div className="mb-6 p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl flex items-center justify-between text-xs text-red-800 dark:text-red-300 shadow-xs animate-in fade-in duration-200">
                <div className="flex items-center space-x-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{toastMessage}</span>
                </div>
                <button
                  onClick={() => setToastMessage(null)}
                  className="text-red-500 hover:text-red-700 text-xs font-semibold cursor-pointer ml-3"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Module 1: Dashboard */}
            {currentModule === 'dashboard' && (
              <DashboardModule
                matters={matters}
                hearings={hearings}
                deadlines={deadlines}
                invoices={invoices}
                communications={communications}
                onNavigateModule={(mod) => setCurrentModule(mod)}
                onOpenCreateMatter={() => setIsCreateMatterOpen(true)}
                onSelectMatter={(m) => setCurrentModule('matters')}
              />
            )}

            {/* Module 2: Matters */}
            {currentModule === 'matters' && (
              <MattersModule
                matters={matters}
                clients={clients}
                staff={staff}
                onOpenCreateMatter={() => setIsCreateMatterOpen(true)}
                onSelectMatter={(m) => {}}
                onUpdateMatterStatus={handleUpdateMatterStatus}
                onDeleteMatter={handleDeleteMatter}
              />
            )}

            {/* Module 3: Clients */}
            {currentModule === 'clients' && (
              <ClientsModule
                clients={clients}
                matters={matters}
                onAddClient={handleAddClient}
                onSelectClientMatters={(clientId) => {
                  setCurrentModule('matters');
                }}
              />
            )}

            {/* Module 4: Court & Deadlines */}
            {currentModule === 'court_deadlines' && (
              <CourtDeadlinesModule
                hearings={hearings}
                deadlines={deadlines}
                matters={matters}
                staff={staff}
                onAddHearing={handleAddHearing}
                onAddDeadline={handleAddDeadline}
                onToggleDeadline={handleToggleDeadline}
              />
            )}

            {/* Module 5: Documents */}
            {currentModule === 'documents' && (
              <DocumentsModule
                documents={documents}
                matters={matters}
                onUploadDocument={handleUploadDocument}
              />
            )}

            {/* Module 6: Tasks */}
            {currentModule === 'tasks' && (
              <TasksModule
                tasks={tasks}
                matters={matters}
                staff={staff}
                onAddTask={handleAddTask}
                onUpdateTaskStatus={handleUpdateTaskStatus}
                onDeleteTask={handleDeleteTask}
              />
            )}

            {/* Module 7: Time Tracking */}
            {currentModule === 'time_tracking' && (
              <TimeTrackingModule
                timeEntries={timeEntries}
                matters={matters}
                staff={staff}
                onAddTimeEntry={handleAddTimeEntry}
              />
            )}

            {/* Module 8: Billing */}
            {currentModule === 'billing' && (
              <BillingModule
                invoices={invoices}
                matters={matters}
                clients={clients}
                onCreateInvoice={handleCreateInvoice}
                onRecordPayment={handleRecordPayment}
              />
            )}

            {/* Module 9: Calendar */}
            {currentModule === 'calendar' && (
              <CalendarModule
                hearings={hearings}
                deadlines={deadlines}
                communications={communications}
              />
            )}

            {/* Module 10: Communications */}
            {currentModule === 'communications' && (
              <CommunicationsModule
                communications={communications}
                clients={clients}
                matters={matters}
                staff={staff}
                onAddCommunication={handleAddCommunication}
              />
            )}

            {/* Module 11: Reports */}
            {currentModule === 'reports' && (
              <ReportsModule
                matters={matters}
                invoices={invoices}
                timeEntries={timeEntries}
                staff={staff}
                deadlines={deadlines}
              />
            )}

            {/* Module 12: Team */}
            {currentModule === 'team' && (
              <TeamModule
                staff={staff}
                onAddStaff={handleAddStaff}
              />
            )}

            {/* Module 13: Settings */}
            {currentModule === 'settings' && (
              <SettingsModule
                settings={settings}
                onUpdateSettings={(updated) => {
                  setSettings(updated);
                  showToast('Firm profile settings updated.');
                }}
                onResetDemoData={handleResetDemoData}
              />
            )}
          </div>

          {/* Operational Footer Disclaimer (Non-Legal Advice) */}
          <footer className="mt-12 pt-4 border-t border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-400 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center space-x-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span>
                Operational Practice Management System — This software manages law firm administration and does not provide legal advice, legal recommendations, or formal attorney-client opinions.
              </span>
            </div>
            <span className="font-mono text-[10px]">LSK Compliance Ready • KES Active</span>
          </footer>
        </div>
      </div>

      {/* Modal: Create New Matter */}
      <CreateMatterModal
        isOpen={isCreateMatterOpen}
        onClose={() => setIsCreateMatterOpen(false)}
        clients={clients}
        staff={staff}
        onSaveMatter={handleSaveMatter}
      />
    </div>
  );
};
