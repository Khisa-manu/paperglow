import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  BMModule,
  BusinessSettings,
  SalesDocument,
  InventoryItem,
  Customer,
  ExpenseRecord,
  Employee,
  AttendanceRecord,
  BusinessOrder,
  CustomerMessage,
  PaymentTransaction,
  ActivityLog,
  StockAdjustment,
  OrderStatus,
  PaymentMethod,
} from '../types/businessManager';
import {
  DEFAULT_BUSINESS_SETTINGS,
  DEFAULT_CUSTOMERS,
  DEFAULT_INVENTORY,
  DEFAULT_SALES_DOCUMENTS,
  DEFAULT_EXPENSES,
  DEFAULT_EMPLOYEES,
  DEFAULT_ATTENDANCE,
  DEFAULT_ORDERS,
  DEFAULT_MESSAGE_TEMPLATES,
  DEFAULT_MESSAGES,
  DEFAULT_PAYMENTS,
  DEFAULT_ACTIVITY_LOGS,
} from '../data/defaultBusinessManagerData';

import { BMSidebar } from '../components/businessManager/BMSidebar';
import { BMHeader } from '../components/businessManager/BMHeader';
import { DashboardModule } from '../components/businessManager/DashboardModule';
import { SalesModule } from '../components/businessManager/SalesModule';
import { InventoryModule } from '../components/businessManager/InventoryModule';
import { CustomersModule } from '../components/businessManager/CustomersModule';
import { ExpensesModule } from '../components/businessManager/ExpensesModule';
import { ReportsModule } from '../components/businessManager/ReportsModule';
import { EmployeesModule } from '../components/businessManager/EmployeesModule';
import { OrdersAppointmentsModule } from '../components/businessManager/OrdersAppointmentsModule';
import { MessagesModule } from '../components/businessManager/MessagesModule';
import { PaymentsModule } from '../components/businessManager/PaymentsModule';
import { SettingsModule } from '../components/businessManager/SettingsModule';
import { PrintDocumentModal } from '../components/businessManager/PrintDocumentModal';
import { CloudSyncIndicator } from '../components/ui/CloudSyncIndicator';

interface BusinessManagerPageProps {
  onBackToDirectory?: () => void;
  onNavigateHome: () => void;
  onOpenAccount?: (tab?: 'overview' | 'subscribed' | 'available' | 'merch' | 'orders' | 'profile') => void;
}

export const BusinessManagerPage: React.FC<BusinessManagerPageProps> = ({
  onNavigateHome,
}) => {
  // Navigation State
  const [currentModule, setCurrentModule] = useState<BMModule>('dashboard');
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Primary Data Collections (with localStorage persistence)
  const [settings, setSettings] = useState<BusinessSettings>(() => {
    const saved = localStorage.getItem('paperglow_bm_settings');
    return saved ? JSON.parse(saved) : DEFAULT_BUSINESS_SETTINGS;
  });

  const [documents, setDocuments] = useState<SalesDocument[]>(() => {
    const saved = localStorage.getItem('paperglow_bm_documents');
    return saved ? JSON.parse(saved) : DEFAULT_SALES_DOCUMENTS;
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('paperglow_bm_inventory');
    return saved ? JSON.parse(saved) : DEFAULT_INVENTORY;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('paperglow_bm_customers');
    return saved ? JSON.parse(saved) : DEFAULT_CUSTOMERS;
  });

  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() => {
    const saved = localStorage.getItem('paperglow_bm_expenses');
    return saved ? JSON.parse(saved) : DEFAULT_EXPENSES;
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('paperglow_bm_employees');
    return saved ? JSON.parse(saved) : DEFAULT_EMPLOYEES;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('paperglow_bm_attendance');
    return saved ? JSON.parse(saved) : DEFAULT_ATTENDANCE;
  });

  const [orders, setOrders] = useState<BusinessOrder[]>(() => {
    const saved = localStorage.getItem('paperglow_bm_orders');
    return saved ? JSON.parse(saved) : DEFAULT_ORDERS;
  });

  const [messages, setMessages] = useState<CustomerMessage[]>(() => {
    const saved = localStorage.getItem('paperglow_bm_messages');
    return saved ? JSON.parse(saved) : DEFAULT_MESSAGES;
  });

  const [payments, setPayments] = useState<PaymentTransaction[]>(() => {
    const saved = localStorage.getItem('paperglow_bm_payments');
    return saved ? JSON.parse(saved) : DEFAULT_PAYMENTS;
  });

  const [activities, setActivities] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('paperglow_bm_activities');
    return saved ? JSON.parse(saved) : DEFAULT_ACTIVITY_LOGS;
  });

  // Print Document Modal
  const [activePrintDoc, setActivePrintDoc] = useState<SalesDocument | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('paperglow_bm_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('paperglow_bm_documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('paperglow_bm_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('paperglow_bm_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('paperglow_bm_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('paperglow_bm_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('paperglow_bm_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('paperglow_bm_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('paperglow_bm_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('paperglow_bm_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('paperglow_bm_activities', JSON.stringify(activities));
  }, [activities]);

  // Cloud Synchronization State
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const [isCloudOnline, setIsCloudOnline] = useState(true);

  const fetchCloudBusinessData = async () => {
    setIsCloudSyncing(true);
    try {
      const [custRes, prodRes, expRes, empRes, ordRes] = await Promise.allSettled([
        api.business.getCustomers(),
        api.business.getProducts(),
        api.business.getExpenses(),
        api.business.getEmployees(),
        api.business.getOrders(),
      ]);

      if (custRes.status === 'fulfilled' && custRes.value?.data && custRes.value.data.length > 0) {
        const cloudCusts: Customer[] = custRes.value.data.map((c: any) => ({
          id: String(c.id || c.uuid),
          name: c.name || '',
          company: c.company || c.notes || '',
          email: c.email || '',
          phone: c.phone || '',
          address: c.address || '',
          city: c.city || 'Nairobi',
          kraPin: c.kra_pin || 'P051000000X',
          outstandingBalance: Number(c.balance || 0),
          totalSpent: Number(c.total_invoiced || 0),
          notes: [],
          createdAt: c.created_at || new Date().toISOString(),
        }));
        setCustomers(cloudCusts);
      }

      if (prodRes.status === 'fulfilled' && prodRes.value?.data && prodRes.value.data.length > 0) {
        const cloudProds: InventoryItem[] = prodRes.value.data.map((p: any) => ({
          id: String(p.id || p.uuid),
          name: p.name || '',
          sku: p.sku || `SKU-${p.id}`,
          type: (p.type as any) || 'product',
          category: p.category || 'General',
          stockQuantity: Number(p.stock_quantity ?? p.stockQuantity ?? 10),
          minStockThreshold: Number(p.reorder_level ?? p.reorderLevel ?? 5),
          buyingPrice: Number(p.unit_cost ?? p.unitCost ?? 0),
          sellingPrice: Number(p.selling_price ?? p.sellingPrice ?? 0),
          unit: p.unit || 'pcs',
          description: p.description || '',
          lastAdjusted: p.updated_at || new Date().toISOString(),
        }));
        setInventory(cloudProds);
      }

      if (expRes.status === 'fulfilled' && expRes.value?.data && expRes.value.data.length > 0) {
        const cloudExps: ExpenseRecord[] = expRes.value.data.map((e: any) => ({
          id: String(e.id || e.uuid),
          voucherNumber: e.voucher_number || `EXP-${String(e.id || '01').padStart(4, '0')}`,
          date: e.date || new Date().toISOString().split('T')[0],
          category: (e.category as any) || 'Miscellaneous',
          description: e.title || e.description || '',
          amount: Number(e.amount || 0),
          payee: e.paid_to || e.payee || '',
          paymentMethod: e.payment_method || 'M-Pesa',
          status: (e.status === 'Paid' || e.status === 'Pending') ? e.status : 'Paid',
          receiptAttached: Boolean(e.receipt_attached),
        }));
        setExpenses(cloudExps);
      }

      setIsCloudOnline(true);
    } catch (err) {
      console.warn('[Business Cloud] Using offline cache:', err);
      setIsCloudOnline(false);
    } finally {
      setIsCloudSyncing(false);
    }
  };

  useEffect(() => {
    fetchCloudBusinessData();
  }, []);

  // Activity Logger Helper
  const logActivity = (actor: string, action: string, module: BMModule, detail: string) => {
    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      actor,
      action,
      module,
      detail,
    };
    setActivities((prev) => [newLog, ...prev.slice(0, 19)]);
  };

  // Reset to Demo Data
  const handleResetDemoData = () => {
    if (window.confirm('Reset all business data to factory demo state? This will repopulate all modules with realistic Kenyan business demo records.')) {
      setSettings(DEFAULT_BUSINESS_SETTINGS);
      setDocuments(DEFAULT_SALES_DOCUMENTS);
      setInventory(DEFAULT_INVENTORY);
      setCustomers(DEFAULT_CUSTOMERS);
      setExpenses(DEFAULT_EXPENSES);
      setEmployees(DEFAULT_EMPLOYEES);
      setAttendance(DEFAULT_ATTENDANCE);
      setOrders(DEFAULT_ORDERS);
      setMessages(DEFAULT_MESSAGES);
      setPayments(DEFAULT_PAYMENTS);
      setActivities(DEFAULT_ACTIVITY_LOGS);
    }
  };

  // CRUD Handlers for Documents
  const handleSaveDocument = (doc: SalesDocument) => {
    setDocuments((prev) => {
      const exists = prev.some((d) => d.id === doc.id);
      if (exists) {
        return prev.map((d) => (d.id === doc.id ? doc : d));
      }
      return [doc, ...prev];
    });

    api.business.createInvoice({
      invoice_number: doc.documentNumber,
      customer_name: doc.customerName,
      total_amount: doc.grandTotal,
      status: doc.status,
      issue_date: doc.issueDate,
      due_date: doc.dueDate,
    }).catch(() => {});

    logActivity(
      'Operations Lead',
      `Saved ${doc.documentType}`,
      'sales',
      `${doc.documentNumber} issued to ${doc.customerName} for ${settings.currency} ${doc.grandTotal.toLocaleString()}`
    );
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    logActivity('Operations Lead', 'Deleted Document', 'sales', `Document ID ${id} removed.`);
  };

  // CRUD Handlers for Inventory
  const handleSaveProduct = (item: InventoryItem) => {
    setInventory((prev) => {
      const exists = prev.some((p) => p.id === item.id);
      if (exists) {
        return prev.map((p) => (p.id === item.id ? item : p));
      }
      return [item, ...prev];
    });

    api.business.createProduct({
      name: item.name,
      sku: item.sku,
      category: item.category,
      unit: item.unit,
      unit_cost: item.buyingPrice,
      selling_price: item.sellingPrice,
      stock_quantity: item.stockQuantity,
      reorder_level: item.minStockThreshold,
    }).catch(() => {});

    logActivity('Stock Officer', 'Saved Item', 'inventory', `${item.name} (${item.sku}) updated.`);
  };

  const handleDeleteProduct = (id: string) => {
    setInventory((prev) => prev.filter((p) => p.id !== id));
    logActivity('Stock Officer', 'Deleted Item', 'inventory', `Product removed from catalog.`);
  };

  const handleRecordStockAdjustment = (adj: StockAdjustment) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === adj.productId) {
          return {
            ...item,
            stockQuantity: adj.newQuantity,
            lastAdjusted: adj.date,
          };
        }
        return item;
      })
    );

    logActivity(
      'Stock Officer',
      'Stock Adjustment',
      'inventory',
      `${adj.productName}: ${adj.quantityChange > 0 ? '+' : ''}${adj.quantityChange} (${adj.reason})`
    );
  };

  // CRUD Handlers for Customers
  const handleSaveCustomer = (cust: Customer) => {
    setCustomers((prev) => {
      const exists = prev.some((c) => c.id === cust.id);
      if (exists) {
        return prev.map((c) => (c.id === cust.id ? cust : c));
      }
      return [cust, ...prev];
    });

    api.business.createCustomer({
      name: cust.name,
      email: cust.email,
      phone: cust.phone,
      address: cust.address,
      status: 'active',
      notes: cust.company || '',
    }).catch((err) => console.warn('Could not sync customer to backend:', err));

    logActivity('Commercial Desk', 'Customer Saved', 'customers', `${cust.name} (${cust.company}) profile updated.`);
  };

  const handleDeleteCustomer = (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    api.business.deleteCustomer(id).catch(() => {});
  };

  const handleAddCustomerNote = (customerId: string, noteText: string) => {
    const newNote = {
      id: `note-${Date.now()}`,
      content: noteText,
      author: 'Operations Lead',
      createdAt: 'Today',
    };

    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === customerId) {
          return {
            ...c,
            notes: [newNote, ...(c.notes || [])],
          };
        }
        return c;
      })
    );

    logActivity('Commercial Desk', 'Added Customer Note', 'customers', `Note recorded on customer account.`);
  };

  // CRUD Handlers for Expenses
  const handleSaveExpense = (exp: ExpenseRecord) => {
    setExpenses((prev) => [exp, ...prev]);

    api.business.createExpense({
      title: exp.description,
      category: exp.category,
      amount: exp.amount,
      date: exp.date,
      paid_to: exp.payee || 'Vendor',
      payment_method: exp.paymentMethod,
    }).catch((err) => console.warn('Could not sync expense to backend:', err));

    logActivity(
      'Finance Lead',
      'Recorded Expense',
      'expenses',
      `${exp.voucherNumber}: ${settings.currency} ${exp.amount.toLocaleString()} for ${exp.description}`
    );
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  // CRUD Handlers for Employees
  const handleSaveEmployee = (emp: Employee) => {
    setEmployees((prev) => {
      const exists = prev.some((e) => e.id === emp.id);
      if (exists) {
        return prev.map((e) => (e.id === emp.id ? emp : e));
      }
      return [emp, ...prev];
    });

    api.business.createEmployee({
      name: emp.fullName,
      role: emp.role,
      department: emp.department,
      phone: emp.phone,
      email: emp.email,
      salary: emp.baseSalary,
      status: 'active',
    }).catch((err) => console.warn('Could not sync employee to backend:', err));
  };

  const handleDeleteEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  };

  const handleToggleClockIn = (employeeId: string) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === employeeId) {
          const isNowClocked = emp.todayStatus !== 'Clocked In';
          return {
            ...emp,
            todayStatus: isNowClocked ? 'Clocked In' : 'Clocked Out',
            clockInTime: isNowClocked ? '08:00 AM' : undefined,
          };
        }
        return emp;
      })
    );
  };

  // CRUD Handlers for Orders & Appointments
  const handleSaveOrder = (order: BusinessOrder) => {
    setOrders((prev) => {
      const exists = prev.some((o) => o.id === order.id);
      if (exists) {
        return prev.map((o) => (o.id === order.id ? order : o));
      }
      return [order, ...prev];
    });

    api.business.createOrder({
      order_number: order.orderNumber,
      customer_name: order.customerName,
      total_amount: order.totalAmount,
      status: order.status,
    }).catch(() => {});

    logActivity(
      'Front Desk',
      'Saved Booking',
      'orders',
      `${order.orderNumber} for ${order.customerName} (${order.title})`
    );
  };

  const handleDeleteOrder = (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  // Messages Handler
  const handleSendMessage = (msg: CustomerMessage) => {
    setMessages((prev) => [msg, ...prev]);
    logActivity('Communications', 'Dispatched Message', 'messages', `Sent ${msg.channel} to ${msg.customerName}.`);
  };

  // Payments & Invoicing Settlement
  const handleRecordPayment = (txn: PaymentTransaction) => {
    setPayments((prev) => [txn, ...prev]);
    logActivity(
      'Accounts',
      'Received Payment',
      'payments',
      `${txn.transactionReference}: ${settings.currency} ${txn.amount.toLocaleString()} via ${txn.method}`
    );
  };

  const handleSettleInvoice = (docId: string, amount: number, method: PaymentMethod, refCode: string) => {
    setDocuments((prev) =>
      prev.map((d) => {
        if (d.id === docId) {
          const newPaid = (d.amountPaid || 0) + amount;
          const isFullyPaid = newPaid >= d.grandTotal;
          return {
            ...d,
            amountPaid: newPaid,
            status: isFullyPaid ? 'paid' : d.status,
            paymentMethod: method,
            paidAt: '2026-03-31',
          };
        }
        return d;
      })
    );
  };

  // Counts for Badges
  const lowStockCount = inventory.filter(
    (i) => i.type === 'product' && i.stockQuantity <= i.minStockThreshold
  ).length;

  const unpaidInvoiceCount = documents.filter(
    (d) => d.documentType === 'invoice' && (d.status === 'unpaid' || d.status === 'overdue')
  ).length;

  const pendingOrderCount = orders.filter(
    (o) => o.status === 'pending' || o.status === 'in_progress'
  ).length;

  return (
    <div className="min-h-screen bg-neutral-100/70 dark:bg-[#0d0e12] text-neutral-900 dark:text-neutral-100 flex flex-col lg:flex-row">
      {/* Professional Vertical Sidebar */}
      <BMSidebar
        currentModule={currentModule}
        onSelectModule={(mod) => {
          setCurrentModule(mod);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isOpenMobile={isSidebarOpenMobile}
        onCloseMobile={() => setIsSidebarOpenMobile(false)}
        lowStockCount={lowStockCount}
        unpaidInvoiceCount={unpaidInvoiceCount}
        pendingOrderCount={pendingOrderCount}
      />

      {/* Main Viewport Content Area (offset by 72px / 288px on lg) */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        {/* Top Header */}
        <BMHeader
          currentModule={currentModule}
          onOpenMobileSidebar={() => setIsSidebarOpenMobile(true)}
          onNavigateHome={onNavigateHome}
          onResetDemoData={handleResetDemoData}
          onQuickAction={(action) => {
            if (action === 'new-invoice' || action === 'new-quotation' || action === 'new-receipt') {
              setCurrentModule('sales');
            } else if (action === 'new-product') {
              setCurrentModule('inventory');
            } else if (action === 'new-customer') {
              setCurrentModule('customers');
            } else if (action === 'new-expense') {
              setCurrentModule('expenses');
            } else if (action === 'new-order') {
              setCurrentModule('orders');
            }
          }}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          businessName={settings.legalTradingName}
        />

        {/* Module Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <div className="flex items-center justify-between gap-3 mb-4">
            <span className="text-xs text-neutral-500 font-mono">WORKSPACE: PAPERGLOW-BUSINESS-MANAGER</span>
            <CloudSyncIndicator
              appName="Business Manager"
              isSyncing={isCloudSyncing}
              isOnline={isCloudOnline}
              onManualSync={fetchCloudBusinessData}
            />
          </div>
          {currentModule === 'dashboard' && (
            <DashboardModule
              documents={documents}
              inventory={inventory}
              expenses={expenses}
              orders={orders}
              activities={activities}
              currencySymbol={settings.currencySymbol}
              onNavigateModule={(mod) => setCurrentModule(mod)}
              onOpenDocumentModal={(type) => setCurrentModule('sales')}
              onOpenExpenseModal={() => setCurrentModule('expenses')}
              onOpenOrderModal={() => setCurrentModule('orders')}
            />
          )}

          {currentModule === 'sales' && (
            <SalesModule
              documents={documents}
              customers={customers}
              inventory={inventory}
              settings={settings}
              currencySymbol={settings.currencySymbol}
              onSaveDocument={handleSaveDocument}
              onDeleteDocument={handleDeleteDocument}
              onPrintDocument={(doc) => setActivePrintDoc(doc)}
            />
          )}

          {currentModule === 'inventory' && (
            <InventoryModule
              inventory={inventory}
              currencySymbol={settings.currencySymbol}
              onSaveProduct={handleSaveProduct}
              onDeleteProduct={handleDeleteProduct}
              onRecordAdjustment={handleRecordStockAdjustment}
            />
          )}

          {currentModule === 'customers' && (
            <CustomersModule
              customers={customers}
              documents={documents}
              orders={orders}
              currencySymbol={settings.currencySymbol}
              onSaveCustomer={handleSaveCustomer}
              onDeleteCustomer={handleDeleteCustomer}
              onAddNote={handleAddCustomerNote}
            />
          )}

          {currentModule === 'expenses' && (
            <ExpensesModule
              expenses={expenses}
              currencySymbol={settings.currencySymbol}
              onSaveExpense={handleSaveExpense}
              onDeleteExpense={handleDeleteExpense}
            />
          )}

          {currentModule === 'reports' && (
            <ReportsModule
              documents={documents}
              expenses={expenses}
              inventory={inventory}
              customers={customers}
              currencySymbol={settings.currencySymbol}
            />
          )}

          {currentModule === 'employees' && (
            <EmployeesModule
              employees={employees}
              attendance={attendance}
              currencySymbol={settings.currencySymbol}
              onSaveEmployee={handleSaveEmployee}
              onDeleteEmployee={handleDeleteEmployee}
              onToggleClockIn={handleToggleClockIn}
            />
          )}

          {currentModule === 'orders' && (
            <OrdersAppointmentsModule
              orders={orders}
              customers={customers}
              employees={employees}
              currencySymbol={settings.currencySymbol}
              onSaveOrder={handleSaveOrder}
              onDeleteOrder={handleDeleteOrder}
              onUpdateStatus={handleUpdateOrderStatus}
            />
          )}

          {currentModule === 'messages' && (
            <MessagesModule
              messages={messages}
              templates={DEFAULT_MESSAGE_TEMPLATES}
              customers={customers}
              settings={settings}
              onSendMessage={handleSendMessage}
            />
          )}

          {currentModule === 'payments' && (
            <PaymentsModule
              payments={payments}
              documents={documents}
              settings={settings}
              currencySymbol={settings.currencySymbol}
              onRecordPayment={handleRecordPayment}
              onSettleInvoice={handleSettleInvoice}
            />
          )}

          {currentModule === 'settings' && (
            <SettingsModule
              settings={settings}
              onSaveSettings={(newSettings) => setSettings(newSettings)}
            />
          )}
        </main>
      </div>

      {/* Printable Document Modal */}
      {activePrintDoc && (
        <PrintDocumentModal
          document={activePrintDoc}
          settings={settings}
          onClose={() => setActivePrintDoc(null)}
        />
      )}
    </div>
  );
};
