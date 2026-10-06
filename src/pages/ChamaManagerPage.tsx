import React, { useState, useEffect } from 'react';
import {
  ChamaModule,
  Member,
  GroupProfile,
  ContributionRecord,
  LoanRecord,
  WelfareClaim,
  Meeting,
  CashTransaction,
  GroupAsset,
  ChamaNotification,
} from '../types/chamaManager';

import {
  DEFAULT_GROUP_PROFILE,
  DEFAULT_MEMBERS,
  DEFAULT_CONTRIBUTIONS,
  DEFAULT_LOANS,
  DEFAULT_WELFARE_CLAIMS,
  DEFAULT_MEETINGS,
  DEFAULT_TRANSACTIONS,
  DEFAULT_ASSETS,
  DEFAULT_CHAMA_NOTIFICATIONS,
} from '../data/defaultChamaData';

import { ChamaHeader } from '../components/chamaManager/ChamaHeader';
import { ChamaSidebar } from '../components/chamaManager/ChamaSidebar';
import { DashboardModule } from '../components/chamaManager/DashboardModule';
import { GroupManagementModule } from '../components/chamaManager/GroupManagementModule';
import { MembersModule } from '../components/chamaManager/MembersModule';
import { MembershipDocumentsModule } from '../components/chamaManager/MembershipDocumentsModule';
import { ContributionsModule } from '../components/chamaManager/ContributionsModule';
import { LoansModule } from '../components/chamaManager/LoansModule';
import { WelfareModule } from '../components/chamaManager/WelfareModule';
import { MeetingsModule } from '../components/chamaManager/MeetingsModule';
import { IncomeExpensesModule } from '../components/chamaManager/IncomeExpensesModule';
import { AssetsModule } from '../components/chamaManager/AssetsModule';
import { ReportsModule } from '../components/chamaManager/ReportsModule';
import { NotificationsModule } from '../components/chamaManager/NotificationsModule';
import { RolesPermissionsModule } from '../components/chamaManager/RolesPermissionsModule';

import { AddMemberModal } from '../components/chamaManager/AddMemberModal';
import { RecordContributionModal } from '../components/chamaManager/RecordContributionModal';
import { ApplyLoanModal } from '../components/chamaManager/ApplyLoanModal';
import { RecordRepaymentModal } from '../components/chamaManager/RecordRepaymentModal';
import { RequestWelfareModal } from '../components/chamaManager/RequestWelfareModal';
import { MemberDossierModal } from '../components/chamaManager/MemberDossierModal';

import { CheckCircle2 } from 'lucide-react';

interface ChamaManagerPageProps {
  onBackToPaperglow: () => void;
}

export const ChamaManagerPage: React.FC<ChamaManagerPageProps> = ({
  onBackToPaperglow,
}) => {
  const [currentModule, setCurrentModule] = useState<ChamaModule>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modal States
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isRecordContributionOpen, setIsRecordContributionOpen] = useState(false);
  const [isApplyLoanOpen, setIsApplyLoanOpen] = useState(false);
  const [isRecordRepaymentOpen, setIsRecordRepaymentOpen] = useState(false);
  const [selectedLoanForRepay, setSelectedLoanForRepay] = useState<LoanRecord | null>(null);
  const [isRequestWelfareOpen, setIsRequestWelfareOpen] = useState(false);
  const [dossierMember, setDossierMember] = useState<Member | null>(null);
  const [selectedDocMemberId, setSelectedDocMemberId] = useState<string>('');

  // Toast System
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  // State with LocalStorage Fallbacks
  const [group, setGroup] = useState<GroupProfile>(() => {
    const saved = localStorage.getItem('paperglow_chama_group');
    return saved ? JSON.parse(saved) : DEFAULT_GROUP_PROFILE;
  });

  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('paperglow_chama_members');
    return saved ? JSON.parse(saved) : DEFAULT_MEMBERS;
  });

  const [contributions, setContributions] = useState<ContributionRecord[]>(() => {
    const saved = localStorage.getItem('paperglow_chama_contributions');
    return saved ? JSON.parse(saved) : DEFAULT_CONTRIBUTIONS;
  });

  const [loans, setLoans] = useState<LoanRecord[]>(() => {
    const saved = localStorage.getItem('paperglow_chama_loans');
    return saved ? JSON.parse(saved) : DEFAULT_LOANS;
  });

  const [welfareClaims, setWelfareClaims] = useState<WelfareClaim[]>(() => {
    const saved = localStorage.getItem('paperglow_chama_welfare');
    return saved ? JSON.parse(saved) : DEFAULT_WELFARE_CLAIMS;
  });

  const [meetings, setMeetings] = useState<Meeting[]>(() => {
    const saved = localStorage.getItem('paperglow_chama_meetings');
    return saved ? JSON.parse(saved) : DEFAULT_MEETINGS;
  });

  const [transactions, setTransactions] = useState<CashTransaction[]>(() => {
    const saved = localStorage.getItem('paperglow_chama_transactions');
    return saved ? JSON.parse(saved) : DEFAULT_TRANSACTIONS;
  });

  const [assets, setAssets] = useState<GroupAsset[]>(() => {
    const saved = localStorage.getItem('paperglow_chama_assets');
    return saved ? JSON.parse(saved) : DEFAULT_ASSETS;
  });

  const [notifications, setNotifications] = useState<ChamaNotification[]>(() => {
    const saved = localStorage.getItem('paperglow_chama_notifications');
    return saved ? JSON.parse(saved) : DEFAULT_CHAMA_NOTIFICATIONS;
  });

  const [isDark, setIsDark] = useState<boolean>(() => {
    return document.documentElement.classList.contains('dark');
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('paperglow_chama_group', JSON.stringify(group));
  }, [group]);

  useEffect(() => {
    localStorage.setItem('paperglow_chama_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('paperglow_chama_contributions', JSON.stringify(contributions));
  }, [contributions]);

  useEffect(() => {
    localStorage.setItem('paperglow_chama_loans', JSON.stringify(loans));
  }, [loans]);

  useEffect(() => {
    localStorage.setItem('paperglow_chama_welfare', JSON.stringify(welfareClaims));
  }, [welfareClaims]);

  useEffect(() => {
    localStorage.setItem('paperglow_chama_meetings', JSON.stringify(meetings));
  }, [meetings]);

  useEffect(() => {
    localStorage.setItem('paperglow_chama_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('paperglow_chama_assets', JSON.stringify(assets));
  }, [assets]);

  useEffect(() => {
    localStorage.setItem('paperglow_chama_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Dark Mode Toggle
  const toggleDarkMode = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Handlers
  const handleAddMember = (
    memberData: Omit<Member, 'id' | 'totalContributionsKes' | 'currentLoanBalanceKes' | 'welfareContributionsKes' | 'sharesUnits'>
  ) => {
    const newId = `mem-${Date.now().toString().slice(-4)}`;
    const newMember: Member = {
      ...memberData,
      id: newId,
      totalContributionsKes: 0,
      currentLoanBalanceKes: 0,
      welfareContributionsKes: 0,
      sharesUnits: 0,
    };

    setMembers((prev) => [newMember, ...prev]);
    showToast(`Member ${newMember.fullName} (${newMember.membershipNumber}) registered.`);
  };

  const handleDeleteMember = (memberId: string) => {
    const target = members.find((m) => m.id === memberId);
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
    if (target) {
      showToast(`Member ${target.fullName} record removed.`);
    }
  };

  const handleRecordContribution = (record: Omit<ContributionRecord, 'id'>) => {
    const newId = `cnt-${Date.now().toString().slice(-4)}`;
    const newRecord: ContributionRecord = {
      ...record,
      id: newId,
    };

    setContributions((prev) => [newRecord, ...prev]);

    // Update member's pooled total contributions & welfare
    setMembers((prev) =>
      prev.map((m) =>
        m.id === record.memberId
          ? {
              ...m,
              totalContributionsKes: m.totalContributionsKes + record.amountKes,
              welfareContributionsKes: m.welfareContributionsKes + record.welfareKes,
              sharesUnits: Math.floor((m.totalContributionsKes + record.amountKes) / 10000),
            }
          : m
      )
    );

    // Also record cash transaction in ledger
    const newTx: CashTransaction = {
      id: `tx-${Date.now().toString().slice(-4)}`,
      date: record.paymentDate,
      type: 'income',
      category: 'Member Contributions',
      amountKes: record.totalPaidKes,
      description: `Monthly savings & welfare from ${record.memberName} (${record.month})`,
      reference: record.transactionReference,
      recordedBy: record.recordedBy,
    };
    setTransactions((prev) => [newTx, ...prev]);

    showToast(`Contribution of KES ${record.totalPaidKes.toLocaleString()} posted. Ref #${record.transactionReference}.`);
  };

  const handleApplyLoan = (
    loanData: Omit<LoanRecord, 'id' | 'amountRepaidKes' | 'balanceKes' | 'repayments'>
  ) => {
    const newId = `ln-${Date.now().toString().slice(-4)}`;
    const newLoan: LoanRecord = {
      ...loanData,
      id: newId,
      amountRepaidKes: 0,
      balanceKes: loanData.totalRepayableKes,
      repayments: [],
    };

    setLoans((prev) => [newLoan, ...prev]);
    showToast(`Loan application of KES ${loanData.principalAmountKes.toLocaleString()} queued for committee approval.`);
  };

  const handleApproveLoan = (loanId: string) => {
    setLoans((prev) =>
      prev.map((l) =>
        l.id === loanId
          ? {
              ...l,
              status: 'active',
              approvalDate: new Date().toISOString().split('T')[0],
              disbursementDate: new Date().toISOString().split('T')[0],
            }
          : l
      )
    );

    const target = loans.find((l) => l.id === loanId);
    if (target) {
      // Update member loan balance
      setMembers((prev) =>
        prev.map((m) =>
          m.id === target.memberId
            ? { ...m, currentLoanBalanceKes: target.totalRepayableKes }
            : m
        )
      );

      // Record disbursement in cashbook
      const newTx: CashTransaction = {
        id: `tx-${Date.now().toString().slice(-4)}`,
        date: new Date().toISOString().split('T')[0],
        type: 'expense',
        category: 'Loan Disbursement',
        amountKes: target.principalAmountKes,
        description: `Loan disbursement to ${target.memberName} (${target.loanType})`,
        reference: `DISB-CBK-${Date.now().toString().slice(-4)}`,
        recordedBy: 'CPA Peter Otieno',
        approvedBy: 'Eng. David Koech',
      };
      setTransactions((prev) => [newTx, ...prev]);
    }

    showToast(`Loan approved and funds disbursed.`);
  };

  const handleRejectLoan = (loanId: string) => {
    setLoans((prev) =>
      prev.map((l) => (l.id === loanId ? { ...l, status: 'rejected' } : l))
    );
    showToast(`Loan application rejected by committee.`);
  };

  const handleRecordRepayment = (
    loanId: string,
    amountKes: number,
    reference: string,
    method: 'mpesa' | 'bank_transfer' | 'cash'
  ) => {
    setLoans((prev) =>
      prev.map((l) => {
        if (l.id === loanId) {
          const newRepaid = l.amountRepaidKes + amountKes;
          const newBalance = Math.max(0, l.totalRepayableKes - newRepaid);
          const newStatus = newBalance === 0 ? 'cleared' : 'active';

          return {
            ...l,
            amountRepaidKes: newRepaid,
            balanceKes: newBalance,
            status: newStatus,
            repayments: [
              ...l.repayments,
              {
                id: `rep-${Date.now().toString().slice(-4)}`,
                date: new Date().toISOString().split('T')[0],
                amountKes,
                reference,
                method,
              },
            ],
          };
        }
        return l;
      })
    );

    const target = loans.find((l) => l.id === loanId);
    if (target) {
      setMembers((prev) =>
        prev.map((m) =>
          m.id === target.memberId
            ? { ...m, currentLoanBalanceKes: Math.max(0, m.currentLoanBalanceKes - amountKes) }
            : m
        )
      );

      // Record in cashbook
      const newTx: CashTransaction = {
        id: `tx-${Date.now().toString().slice(-4)}`,
        date: new Date().toISOString().split('T')[0],
        type: 'income',
        category: 'Loan Repayments',
        amountKes,
        description: `Loan repayment from ${target.memberName} (Ref ${reference})`,
        reference,
        recordedBy: 'CPA Peter Otieno',
      };
      setTransactions((prev) => [newTx, ...prev]);
    }

    showToast(`Loan repayment of KES ${amountKes.toLocaleString()} recorded. Receipt #${reference}.`);
  };

  const handleRequestWelfare = (claim: Omit<WelfareClaim, 'id' | 'status' | 'amountApprovedKes'>) => {
    const newClaim: WelfareClaim = {
      ...claim,
      id: `wel-${Date.now().toString().slice(-4)}`,
      amountApprovedKes: claim.amountRequestedKes,
      status: 'pending',
    };

    setWelfareClaims((prev) => [newClaim, ...prev]);
    showToast(`Welfare assistance claim submitted for coordinator review.`);
  };

  const handleApproveWelfare = (claimId: string) => {
    setWelfareClaims((prev) =>
      prev.map((w) =>
        w.id === claimId
          ? {
              ...w,
              status: 'approved',
              approvedDate: new Date().toISOString().split('T')[0],
              approvedBy: 'Grace Achieng (Welfare Coordinator)',
            }
          : w
      )
    );
    showToast(`Welfare assistance claim approved.`);
  };

  const handleDisburseWelfare = (claimId: string, reference: string) => {
    setWelfareClaims((prev) =>
      prev.map((w) =>
        w.id === claimId
          ? {
              ...w,
              status: 'disbursed',
              disbursedDate: new Date().toISOString().split('T')[0],
              paymentReference: reference,
            }
          : w
      )
    );

    const target = welfareClaims.find((w) => w.id === claimId);
    if (target) {
      const newTx: CashTransaction = {
        id: `tx-${Date.now().toString().slice(-4)}`,
        date: new Date().toISOString().split('T')[0],
        type: 'expense',
        category: 'Welfare Payout',
        amountKes: target.amountApprovedKes,
        description: `${target.claimType} assistance payout to ${target.recipientName}`,
        reference,
        recordedBy: 'Grace Achieng',
        approvedBy: 'Eng. David Koech',
      };
      setTransactions((prev) => [newTx, ...prev]);
    }

    showToast(`Welfare funds disbursed. Reference #${reference}.`);
  };

  const handleAddMeeting = (newMtgData: Omit<Meeting, 'id' | 'attendance'>) => {
    const newMeeting: Meeting = {
      ...newMtgData,
      id: `mtg-${Date.now().toString().slice(-4)}`,
      attendance: members.map((m) => ({
        memberId: m.id,
        memberName: m.fullName,
        present: false,
        apology: false,
      })),
    };

    setMeetings((prev) => [newMeeting, ...prev]);
    showToast(`Meeting "${newMeeting.title}" scheduled for ${newMeeting.date}.`);
  };

  const handleAddTransaction = (newTxData: Omit<CashTransaction, 'id'>) => {
    const newTx: CashTransaction = {
      ...newTxData,
      id: `tx-${Date.now().toString().slice(-4)}`,
    };
    setTransactions((prev) => [newTx, ...prev]);
    showToast(`Cashbook transaction recorded.`);
  };

  const handleAddAsset = (newAssetData: Omit<GroupAsset, 'id'>) => {
    const newAsset: GroupAsset = {
      ...newAssetData,
      id: `ast-${Date.now().toString().slice(-4)}`,
    };
    setAssets((prev) => [newAsset, ...prev]);
    showToast(`Chama asset "${newAsset.name}" registered.`);
  };

  const handleSendNotification = (notifData: Omit<ChamaNotification, 'id' | 'isRead'>) => {
    const newNotif: ChamaNotification = {
      ...notifData,
      id: `notif-${Date.now().toString().slice(-4)}`,
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    showToast(`Notification broadcasted.`);
  };

  const handleMarkNotifRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleDeleteNotif = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-neutral-100/70 dark:bg-[#0c0e12] text-neutral-900 dark:text-neutral-100 flex flex-col transition-colors duration-150">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded-xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold shadow-2xl flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Chama Top Header */}
      <ChamaHeader
        group={group}
        notifications={notifications}
        onOpenAddMember={() => setIsAddMemberOpen(true)}
        onOpenRecordContribution={() => setIsRecordContributionOpen(true)}
        onOpenApplyLoan={() => setIsApplyLoanOpen(true)}
        onNavigateModule={(mod) => setCurrentModule(mod)}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        onBackToPaperglow={onBackToPaperglow}
        isDark={isDark}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Main Workspace: Sidebar + Center Stage */}
      <div className="flex-1 flex w-full">
        <ChamaSidebar
          currentModule={currentModule}
          onSelectModule={(mod) => setCurrentModule(mod)}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          counts={{
            totalMembers: members.length,
            activeLoansCount: loans.filter((l) => l.status === 'active').length,
            pendingWelfareCount: welfareClaims.filter((w) => w.status === 'pending').length,
            pendingLoanApplicationsCount: loans.filter((l) => l.status === 'pending_approval').length,
            unreadNotifications: notifications.filter((n) => !n.isRead).length,
          }}
        />

        {/* Content Workspace Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          {currentModule === 'dashboard' && (
            <DashboardModule
              group={group}
              members={members}
              contributions={contributions}
              loans={loans}
              welfareClaims={welfareClaims}
              meetings={meetings}
              transactions={transactions}
              assets={assets}
              onNavigateModule={(mod) => setCurrentModule(mod)}
              onOpenRecordContribution={() => setIsRecordContributionOpen(true)}
              onOpenApplyLoan={() => setIsApplyLoanOpen(true)}
              onOpenAddMember={() => setIsAddMemberOpen(true)}
            />
          )}

          {currentModule === 'group' && (
            <GroupManagementModule
              group={group}
              onUpdateGroup={(updated) => setGroup(updated)}
            />
          )}

          {currentModule === 'members' && (
            <MembersModule
              members={members}
              group={group}
              onOpenAddMember={() => setIsAddMemberOpen(true)}
              onDeleteMember={handleDeleteMember}
              onSelectMemberForDoc={(memberId) => {
                setSelectedDocMemberId(memberId);
                setCurrentModule('documents');
              }}
              onViewMemberDossier={(member) => setDossierMember(member)}
            />
          )}

          {currentModule === 'documents' && (
            <MembershipDocumentsModule
              members={members}
              group={group}
              initialMemberId={selectedDocMemberId}
            />
          )}

          {currentModule === 'contributions' && (
            <ContributionsModule
              contributions={contributions}
              members={members}
              group={group}
              onOpenRecordContribution={() => setIsRecordContributionOpen(true)}
            />
          )}

          {currentModule === 'loans' && (
            <LoansModule
              loans={loans}
              members={members}
              group={group}
              onOpenApplyLoan={() => setIsApplyLoanOpen(true)}
              onApproveLoan={handleApproveLoan}
              onRejectLoan={handleRejectLoan}
              onOpenRecordRepayment={(loan) => {
                setSelectedLoanForRepay(loan);
                setIsRecordRepaymentOpen(true);
              }}
            />
          )}

          {currentModule === 'welfare' && (
            <WelfareModule
              welfareClaims={welfareClaims}
              members={members}
              group={group}
              onOpenRequestWelfare={() => setIsRequestWelfareOpen(true)}
              onApproveClaim={handleApproveWelfare}
              onDisburseClaim={handleDisburseWelfare}
            />
          )}

          {currentModule === 'meetings' && (
            <MeetingsModule
              meetings={meetings}
              members={members}
              group={group}
              onAddMeeting={handleAddMeeting}
            />
          )}

          {currentModule === 'finance' && (
            <IncomeExpensesModule
              transactions={transactions}
              group={group}
              onAddTransaction={handleAddTransaction}
            />
          )}

          {currentModule === 'assets' && (
            <AssetsModule
              assets={assets}
              group={group}
              onAddAsset={handleAddAsset}
            />
          )}

          {currentModule === 'reports' && (
            <ReportsModule
              group={group}
              members={members}
              contributions={contributions}
              loans={loans}
              welfareClaims={welfareClaims}
              transactions={transactions}
              assets={assets}
            />
          )}

          {currentModule === 'notifications' && (
            <NotificationsModule
              notifications={notifications}
              members={members}
              group={group}
              onSendNotification={handleSendNotification}
              onMarkAsRead={handleMarkNotifRead}
              onDeleteNotification={handleDeleteNotif}
            />
          )}

          {currentModule === 'roles' && (
            <RolesPermissionsModule
              group={group}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <AddMemberModal
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        group={group}
        onAddMember={handleAddMember}
      />

      <RecordContributionModal
        isOpen={isRecordContributionOpen}
        onClose={() => setIsRecordContributionOpen(false)}
        members={members}
        group={group}
        onRecordContribution={handleRecordContribution}
      />

      <ApplyLoanModal
        isOpen={isApplyLoanOpen}
        onClose={() => setIsApplyLoanOpen(false)}
        members={members}
        group={group}
        onApplyLoan={handleApplyLoan}
      />

      <RecordRepaymentModal
        isOpen={isRecordRepaymentOpen}
        onClose={() => {
          setIsRecordRepaymentOpen(false);
          setSelectedLoanForRepay(null);
        }}
        loan={selectedLoanForRepay}
        onRecordRepayment={handleRecordRepayment}
      />

      <RequestWelfareModal
        isOpen={isRequestWelfareOpen}
        onClose={() => setIsRequestWelfareOpen(false)}
        members={members}
        group={group}
        onRequestWelfare={handleRequestWelfare}
      />

      <MemberDossierModal
        member={dossierMember}
        onClose={() => setDossierMember(null)}
        group={group}
        contributions={contributions}
        loans={loans}
        welfareClaims={welfareClaims}
        onOpenDocumentsForMember={(memberId) => {
          setSelectedDocMemberId(memberId);
          setDossierMember(null);
          setCurrentModule('documents');
        }}
      />
    </div>
  );
};
