import React, { useState, useEffect } from 'react';
import {
  TicketingModule,
  Ticket,
  TicketMessage,
  TicketActivity,
  TicketCategory,
  StaffMember,
  Customer,
  KnowledgeArticle,
  SLAEscalationPolicy,
  TicketNotification,
  TicketStatus,
  TicketPriority,
} from '../types/ticketing';
import {
  DEFAULT_TICKETS,
  DEFAULT_TICKET_CATEGORIES,
  DEFAULT_STAFF_MEMBERS,
  DEFAULT_CUSTOMERS,
  DEFAULT_TICKET_MESSAGES,
  DEFAULT_TICKET_ACTIVITIES,
  DEFAULT_KNOWLEDGE_ARTICLES,
  DEFAULT_SLA_POLICIES,
  DEFAULT_TICKET_NOTIFICATIONS,
} from '../data/defaultTicketingData';

import { TicketingHeader } from '../components/ticketing/TicketingHeader';
import { TicketingSidebar } from '../components/ticketing/TicketingSidebar';
import { DashboardModule } from '../components/ticketing/DashboardModule';
import { TicketsModule } from '../components/ticketing/TicketsModule';
import { TicketDetailModule } from '../components/ticketing/TicketDetailModule';
import { CustomersModule } from '../components/ticketing/CustomersModule';
import { TeamModule } from '../components/ticketing/TeamModule';
import { CategoriesModule } from '../components/ticketing/CategoriesModule';
import { SLAModule } from '../components/ticketing/SLAModule';
import { KnowledgeBaseModule } from '../components/ticketing/KnowledgeBaseModule';
import { ReportsModule } from '../components/ticketing/ReportsModule';
import { CreateTicketModal } from '../components/ticketing/CreateTicketModal';

interface TicketingPageProps {
  onBackToPaperglow: () => void;
}

export const TicketingPage: React.FC<TicketingPageProps> = ({ onBackToPaperglow }) => {
  const [currentModule, setCurrentModule] = useState<TicketingModule>('dashboard');
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [quickFilter, setQuickFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // LocalStorage-backed state
  const [tickets, setTickets] = useState<Ticket[]>(() => {
    const saved = localStorage.getItem('paperglow_ticketing_tickets');
    return saved ? JSON.parse(saved) : DEFAULT_TICKETS;
  });

  const [categories, setCategories] = useState<TicketCategory[]>(() => {
    const saved = localStorage.getItem('paperglow_ticketing_categories');
    return saved ? JSON.parse(saved) : DEFAULT_TICKET_CATEGORIES;
  });

  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem('paperglow_ticketing_staff');
    return saved ? JSON.parse(saved) : DEFAULT_STAFF_MEMBERS;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('paperglow_ticketing_customers');
    return saved ? JSON.parse(saved) : DEFAULT_CUSTOMERS;
  });

  const [messages, setMessages] = useState<TicketMessage[]>(() => {
    const saved = localStorage.getItem('paperglow_ticketing_messages');
    return saved ? JSON.parse(saved) : DEFAULT_TICKET_MESSAGES;
  });

  const [activities, setActivities] = useState<TicketActivity[]>(() => {
    const saved = localStorage.getItem('paperglow_ticketing_activities');
    return saved ? JSON.parse(saved) : DEFAULT_TICKET_ACTIVITIES;
  });

  const [notifications, setNotifications] = useState<TicketNotification[]>(() => {
    const saved = localStorage.getItem('paperglow_ticketing_notifications');
    return saved ? JSON.parse(saved) : DEFAULT_TICKET_NOTIFICATIONS;
  });

  const [articles, setArticles] = useState<KnowledgeArticle[]>(() => {
    const saved = localStorage.getItem('paperglow_ticketing_articles');
    return saved ? JSON.parse(saved) : DEFAULT_KNOWLEDGE_ARTICLES;
  });

  const [currentStaffId, setCurrentStaffId] = useState<string>('staff-wanjiku');

  const [isDark, setIsDark] = useState<boolean>(() => {
    return document.documentElement.classList.contains('dark');
  });

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('paperglow_ticketing_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('paperglow_ticketing_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('paperglow_ticketing_staff', JSON.stringify(staffMembers));
  }, [staffMembers]);

  useEffect(() => {
    localStorage.setItem('paperglow_ticketing_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('paperglow_ticketing_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('paperglow_ticketing_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('paperglow_ticketing_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('paperglow_ticketing_articles', JSON.stringify(articles));
  }, [articles]);

  const toggleDarkMode = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const currentStaff = staffMembers.find((s) => s.id === currentStaffId) || staffMembers[0];

  // Helper count badges
  const openCount = tickets.filter((t) => t.status === 'open' || t.status === 'in_progress').length;
  const overdueCount = tickets.filter((t) => t.isOverdue || t.isResponseOverdue).length;
  const urgentCount = tickets.filter(
    (t) => (t.priority === 'urgent' || t.priority === 'high') && t.status !== 'resolved' && t.status !== 'closed'
  ).length;

  // Handlers
  const handleNavigateTicketDetail = (ticketId: string) => {
    setActiveTicketId(ticketId);
    setCurrentModule('ticket_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateTicket = (newTicket: Ticket) => {
    setTickets((prev) => [newTicket, ...prev]);

    // Create activity
    const newAct: TicketActivity = {
      id: `act_${Date.now()}`,
      ticketId: newTicket.id,
      actorName: newTicket.customerName,
      action: 'Created new ticket',
      details: `Subject: "${newTicket.subject}"`,
      timestamp: new Date().toISOString(),
    };
    setActivities((prev) => [newAct, ...prev]);

    // Create notification
    const newNotif: TicketNotification = {
      id: `notif_${Date.now()}`,
      title: 'New Support Ticket Created',
      message: `${newTicket.customerName} submitted ${newTicket.id} (${newTicket.categoryName})`,
      type: 'new_ticket',
      ticketId: newTicket.id,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Navigate to ticket details
    handleNavigateTicketDetail(newTicket.id);
  };

  const handleSendMessage = (ticketId: string, messageText: string, isInternal: boolean) => {
    const newMessage: TicketMessage = {
      id: `msg_${Date.now()}`,
      ticketId,
      senderType: 'staff',
      senderName: currentStaff.name,
      senderEmail: currentStaff.email,
      senderAvatar: currentStaff.avatar,
      message: messageText,
      isInternalNote: isInternal,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMessage]);

    // Update ticket activity and updated timestamp
    const targetTicket = tickets.find((t) => t.id === ticketId);
    if (targetTicket) {
      setTickets((prev) =>
        prev.map((t) =>
          t.id === ticketId
            ? {
                ...t,
                updatedAt: new Date().toISOString(),
                status: t.status === 'open' && !isInternal ? 'in_progress' : t.status,
                firstResponseAt: t.firstResponseAt || new Date().toISOString(),
              }
            : t
        )
      );
    }

    const newAct: TicketActivity = {
      id: `act_${Date.now()}`,
      ticketId,
      actorName: currentStaff.name,
      action: isInternal ? 'Added an internal team note' : 'Replied to customer',
      details: messageText.slice(0, 60) + '...',
      timestamp: new Date().toISOString(),
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  const handleUpdateStatus = (ticketId: string, newStatus: TicketStatus) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status: newStatus,
              updatedAt: new Date().toISOString(),
              resolvedAt: newStatus === 'resolved' || newStatus === 'closed' ? new Date().toISOString() : t.resolvedAt,
            }
          : t
      )
    );

    const newAct: TicketActivity = {
      id: `act_${Date.now()}`,
      ticketId,
      actorName: currentStaff.name,
      action: `Changed status to ${newStatus.replace('_', ' ')}`,
      timestamp: new Date().toISOString(),
    };
    setActivities((prev) => [newAct, ...prev]);

    const newNotif: TicketNotification = {
      id: `notif_${Date.now()}`,
      title: 'Ticket Status Updated',
      message: `${ticketId} changed to ${newStatus.replace('_', ' ')} by ${currentStaff.name}`,
      type: 'status_change',
      ticketId,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleUpdatePriority = (ticketId: string, newPriority: TicketPriority) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              priority: newPriority,
              updatedAt: new Date().toISOString(),
            }
          : t
      )
    );

    const newAct: TicketActivity = {
      id: `act_${Date.now()}`,
      ticketId,
      actorName: currentStaff.name,
      action: `Updated priority to ${newPriority}`,
      timestamp: new Date().toISOString(),
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  const handleUpdateAssignee = (ticketId: string, newStaffId: string) => {
    const staff = staffMembers.find((s) => s.id === newStaffId);

    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              assignedStaffId: staff?.id,
              assignedStaffName: staff?.name,
              assignedStaffAvatar: staff?.avatar,
              assignedStaffRole: staff?.role,
              updatedAt: new Date().toISOString(),
            }
          : t
      )
    );

    const newAct: TicketActivity = {
      id: `act_${Date.now()}`,
      ticketId,
      actorName: currentStaff.name,
      action: staff ? `Assigned ticket to ${staff.name}` : 'Unassigned ticket',
      timestamp: new Date().toISOString(),
    };
    setActivities((prev) => [newAct, ...prev]);

    if (staff) {
      const newNotif: TicketNotification = {
        id: `notif_${Date.now()}`,
        title: 'Ticket Reassigned',
        message: `${ticketId} was assigned to ${staff.name}`,
        type: 'assignment',
        ticketId,
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }
  };

  const handleUpdateCategory = (ticketId: string, newCategoryId: string) => {
    const category = categories.find((c) => c.id === newCategoryId);
    if (!category) return;

    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              categoryId: category.id,
              categoryName: category.name,
              updatedAt: new Date().toISOString(),
            }
          : t
      )
    );
  };

  const handleAddCustomer = (newCust: Omit<Customer, 'id' | 'totalTickets' | 'openTickets' | 'satisfactionRating' | 'notes' | 'createdAt'>) => {
    const created: Customer = {
      ...newCust,
      id: `cust_${Date.now()}`,
      totalTickets: 0,
      openTickets: 0,
      satisfactionRating: 5.0,
      notes: [],
      createdAt: new Date().toISOString(),
    };
    setCustomers((prev) => [created, ...prev]);
  };

  const handleAddCustomerNote = (customerId: string, noteText: string, authorName: string) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === customerId
          ? {
              ...c,
              notes: [
                ...c.notes,
                {
                  id: `note_${Date.now()}`,
                  authorName,
                  content: noteText,
                  createdAt: new Date().toISOString(),
                },
              ],
            }
          : c
      )
    );
  };

  const handleAddStaff = (newStaff: Omit<StaffMember, 'id' | 'activeTicketsCount' | 'resolvedCount' | 'avgResolutionHours'>) => {
    const created: StaffMember = {
      ...newStaff,
      id: `staff_${Date.now()}`,
      activeTicketsCount: 0,
      resolvedCount: 0,
      avgResolutionHours: 2.5,
    };
    setStaffMembers((prev) => [...prev, created]);
  };

  const handleUpdateStaffStatus = (staffId: string, status: StaffMember['status']) => {
    setStaffMembers((prev) =>
      prev.map((s) => (s.id === staffId ? { ...s, status } : s))
    );
  };

  const handleAddCategory = (newCat: Omit<TicketCategory, 'id' | 'ticketCount'>) => {
    const created: TicketCategory = {
      ...newCat,
      id: `cat_${Date.now()}`,
      ticketCount: 0,
    };
    setCategories((prev) => [...prev, created]);
  };

  const handleUpdateCategoryItem = (id: string, updated: Partial<TicketCategory>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
    );
  };

  const handleEscalateTicket = (ticketId: string) => {
    // Reassign to Support Lead (Wanjiku Kamau) & mark Priority Urgent
    const leadStaff = staffMembers.find((s) => s.role === 'Support Lead') || staffMembers[0];
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              priority: 'urgent',
              assignedStaffId: leadStaff.id,
              assignedStaffName: leadStaff.name,
              assignedStaffAvatar: leadStaff.avatar,
              assignedStaffRole: leadStaff.role,
              updatedAt: new Date().toISOString(),
            }
          : t
      )
    );

    const newAct: TicketActivity = {
      id: `act_${Date.now()}`,
      ticketId,
      actorName: 'System SLA Escalation Engine',
      action: `Escalated directly to ${leadStaff.name}`,
      details: 'Priority raised to Urgent under SLA breach policy',
      timestamp: new Date().toISOString(),
    };
    setActivities((prev) => [newAct, ...prev]);

    const newNotif: TicketNotification = {
      id: `notif_${Date.now()}`,
      title: 'Ticket Escalated to Lead',
      message: `${ticketId} was escalated to ${leadStaff.name} due to SLA breach`,
      type: 'overdue',
      ticketId,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);

    alert(`Ticket ${ticketId} has been escalated to ${leadStaff.name} with Urgent priority.`);
  };

  const handleAddArticle = (newArt: Omit<KnowledgeArticle, 'id' | 'views' | 'helpfulCount' | 'notHelpfulCount' | 'updatedAt'>) => {
    const created: KnowledgeArticle = {
      ...newArt,
      id: `art_${Date.now()}`,
      views: 1,
      helpfulCount: 0,
      notHelpfulCount: 0,
      updatedAt: new Date().toISOString(),
    };
    setArticles((prev) => [created, ...prev]);
  };

  const handleRateArticle = (articleId: string, isHelpful: boolean) => {
    setArticles((prev) =>
      prev.map((a) =>
        a.id === articleId
          ? {
              ...a,
              helpfulCount: isHelpful ? a.helpfulCount + 1 : a.helpfulCount,
              notHelpfulCount: !isHelpful ? a.notHelpfulCount + 1 : a.notHelpfulCount,
            }
          : a
      )
    );
  };

  // Find active ticket if detail module
  const activeTicket = tickets.find((t) => t.id === activeTicketId) || tickets[0];
  const activeCustomer = activeTicket ? customers.find((c) => c.id === activeTicket.customerId || c.email === activeTicket.customerEmail) : undefined;

  return (
    <div className="min-h-screen bg-neutral-100/70 dark:bg-[#0b0d11] text-neutral-900 dark:text-neutral-100 flex flex-col font-['DM_Sans'] antialiased">
      {/* Top Header */}
      <TicketingHeader
        currentModule={currentModule}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        staffMembers={staffMembers}
        currentStaffId={currentStaffId}
        onSelectCurrentStaff={setCurrentStaffId}
        notifications={notifications}
        onMarkNotificationRead={(id) =>
          setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
          )
        }
        onMarkAllNotificationsRead={() =>
          setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
        }
        onOpenCreateTicket={() => setIsCreateTicketOpen(true)}
        onNavigateTicketDetail={handleNavigateTicketDetail}
        onBackToPortal={onBackToPaperglow}
        isDark={isDark}
        toggleDarkMode={toggleDarkMode}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <TicketingSidebar
          currentModule={currentModule}
          onSelectModule={(mod) => {
            setCurrentModule(mod);
            if (mod !== 'ticket_detail') setActiveTicketId(null);
          }}
          openTicketsCount={openCount}
          overdueTicketsCount={overdueCount}
          urgentTicketsCount={urgentCount}
          onQuickFilter={(type) => {
            setQuickFilter(type);
            setCurrentModule('tickets');
          }}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Workspace Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Module Routing */}
          {currentModule === 'dashboard' && (
            <DashboardModule
              tickets={tickets}
              activities={activities}
              categories={categories}
              staffMembers={staffMembers}
              onNavigateTickets={(filterStatus) => {
                if (filterStatus) setQuickFilter(filterStatus);
                setCurrentModule('tickets');
              }}
              onNavigateTicketDetail={handleNavigateTicketDetail}
              onOpenCreateTicket={() => setIsCreateTicketOpen(true)}
            />
          )}

          {currentModule === 'tickets' && (
            <TicketsModule
              tickets={tickets}
              categories={categories}
              staffMembers={staffMembers}
              initialFilter={quickFilter}
              onNavigateTicketDetail={handleNavigateTicketDetail}
              onOpenCreateTicket={() => setIsCreateTicketOpen(true)}
              onUpdateTicketStatus={handleUpdateStatus}
              onUpdateTicketAssignee={handleUpdateAssignee}
            />
          )}

          {currentModule === 'ticket_detail' && activeTicket && (
            <TicketDetailModule
              ticket={activeTicket}
              messages={messages}
              activities={activities}
              categories={categories}
              staffMembers={staffMembers}
              customer={activeCustomer}
              currentStaff={currentStaff}
              onBack={() => {
                setCurrentModule('tickets');
                setActiveTicketId(null);
              }}
              onSendMessage={handleSendMessage}
              onUpdateStatus={handleUpdateStatus}
              onUpdatePriority={handleUpdatePriority}
              onUpdateAssignee={handleUpdateAssignee}
              onUpdateCategory={handleUpdateCategory}
            />
          )}

          {currentModule === 'customers' && (
            <CustomersModule
              customers={customers}
              tickets={tickets}
              onNavigateTicketDetail={handleNavigateTicketDetail}
              onAddCustomer={handleAddCustomer}
              onAddCustomerNote={handleAddCustomerNote}
            />
          )}

          {currentModule === 'team' && (
            <TeamModule
              staffMembers={staffMembers}
              tickets={tickets}
              onAddStaffMember={handleAddStaff}
              onUpdateStaffStatus={handleUpdateStaffStatus}
              onReassignTicket={handleUpdateAssignee}
              onNavigateTicketDetail={handleNavigateTicketDetail}
            />
          )}

          {currentModule === 'categories' && (
            <CategoriesModule
              categories={categories}
              tickets={tickets}
              staffMembers={staffMembers}
              onAddCategory={handleAddCategory}
              onUpdateCategory={handleUpdateCategoryItem}
              onNavigateTicketsByCategory={(catId) => {
                setCurrentModule('tickets');
              }}
            />
          )}

          {currentModule === 'sla' && (
            <SLAModule
              policies={DEFAULT_SLA_POLICIES}
              tickets={tickets}
              staffMembers={staffMembers}
              onNavigateTicketDetail={handleNavigateTicketDetail}
              onEscalateTicket={handleEscalateTicket}
            />
          )}

          {currentModule === 'knowledge_base' && (
            <KnowledgeBaseModule
              articles={articles}
              onAddArticle={handleAddArticle}
              onRateArticle={handleRateArticle}
              onOpenCreateTicket={() => setIsCreateTicketOpen(true)}
            />
          )}

          {currentModule === 'reports' && (
            <ReportsModule
              tickets={tickets}
              categories={categories}
              staffMembers={staffMembers}
            />
          )}
        </main>
      </div>

      {/* Global Create Ticket Modal */}
      <CreateTicketModal
        isOpen={isCreateTicketOpen}
        onClose={() => setIsCreateTicketOpen(false)}
        customers={customers}
        categories={categories}
        staffMembers={staffMembers}
        onCreateTicket={handleCreateTicket}
      />
    </div>
  );
};
