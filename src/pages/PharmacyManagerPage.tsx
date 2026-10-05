import React, { useState, useEffect } from 'react';
import {
  PharmModule,
  MedicineProduct,
  StockMovement,
  SaleTransaction,
  PurchaseOrder,
  PharmacyCustomer,
  PharmacySupplier,
  PharmacyExpense,
  PharmacyStaff,
  PharmacySettings,
  StockMovementType,
} from '../types/pharmacyManager';
import {
  DEFAULT_PHARMACY_SETTINGS,
  DEFAULT_MEDICINES,
  DEFAULT_STOCK_MOVEMENTS,
  DEFAULT_SALES,
  DEFAULT_PURCHASE_ORDERS,
  DEFAULT_CUSTOMERS,
  DEFAULT_SUPPLIERS,
  DEFAULT_EXPENSES,
  DEFAULT_STAFF,
} from '../data/defaultPharmacyManagerData';

import { PharmSidebar } from '../components/pharmacyManager/PharmSidebar';
import { PharmHeader } from '../components/pharmacyManager/PharmHeader';
import { PharmDashboardModule } from '../components/pharmacyManager/PharmDashboardModule';
import { PharmInventoryModule } from '../components/pharmacyManager/PharmInventoryModule';
import { PharmStockManagementModule } from '../components/pharmacyManager/PharmStockManagementModule';
import { PharmSalesModule } from '../components/pharmacyManager/PharmSalesModule';
import { PharmPurchasesModule } from '../components/pharmacyManager/PharmPurchasesModule';
import { PharmCustomersModule } from '../components/pharmacyManager/PharmCustomersModule';
import { PharmSuppliersModule } from '../components/pharmacyManager/PharmSuppliersModule';
import { PharmReportsModule } from '../components/pharmacyManager/PharmReportsModule';
import { PharmExpensesModule } from '../components/pharmacyManager/PharmExpensesModule';
import { PharmStaffModule } from '../components/pharmacyManager/PharmStaffModule';
import { PharmSettingsModule } from '../components/pharmacyManager/PharmSettingsModule';

interface PharmacyManagerPageProps {
  onBackToDirectory?: () => void;
  onNavigateHome: () => void;
}

export const PharmacyManagerPage: React.FC<PharmacyManagerPageProps> = ({
  onBackToDirectory,
  onNavigateHome,
}) => {
  const [currentModule, setCurrentModule] = useState<PharmModule>('dashboard');
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dark Mode Sync
  const [isDark, setIsDark] = useState<boolean>(() => {
    return document.documentElement.classList.contains('dark');
  });

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  // State with LocalStorage Persistence
  const [medicines, setMedicines] = useState<MedicineProduct[]>(() => {
    const saved = localStorage.getItem('paperglow_pharm_medicines');
    return saved ? JSON.parse(saved) : DEFAULT_MEDICINES;
  });

  const [movements, setMovements] = useState<StockMovement[]>(() => {
    const saved = localStorage.getItem('paperglow_pharm_movements');
    return saved ? JSON.parse(saved) : DEFAULT_STOCK_MOVEMENTS;
  });

  const [sales, setSales] = useState<SaleTransaction[]>(() => {
    const saved = localStorage.getItem('paperglow_pharm_sales');
    return saved ? JSON.parse(saved) : DEFAULT_SALES;
  });

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => {
    const saved = localStorage.getItem('paperglow_pharm_pos');
    return saved ? JSON.parse(saved) : DEFAULT_PURCHASE_ORDERS;
  });

  const [customers, setCustomers] = useState<PharmacyCustomer[]>(() => {
    const saved = localStorage.getItem('paperglow_pharm_customers');
    return saved ? JSON.parse(saved) : DEFAULT_CUSTOMERS;
  });

  const [suppliers, setSuppliers] = useState<PharmacySupplier[]>(() => {
    const saved = localStorage.getItem('paperglow_pharm_suppliers');
    return saved ? JSON.parse(saved) : DEFAULT_SUPPLIERS;
  });

  const [expenses, setExpenses] = useState<PharmacyExpense[]>(() => {
    const saved = localStorage.getItem('paperglow_pharm_expenses');
    return saved ? JSON.parse(saved) : DEFAULT_EXPENSES;
  });

  const [staffList, setStaffList] = useState<PharmacyStaff[]>(() => {
    const saved = localStorage.getItem('paperglow_pharm_staff');
    return saved ? JSON.parse(saved) : DEFAULT_STAFF;
  });

  const [settings, setSettings] = useState<PharmacySettings>(() => {
    const saved = localStorage.getItem('paperglow_pharm_settings');
    return saved ? JSON.parse(saved) : DEFAULT_PHARMACY_SETTINGS;
  });

  // LocalStorage Sync Effects
  useEffect(() => {
    localStorage.setItem('paperglow_pharm_medicines', JSON.stringify(medicines));
  }, [medicines]);

  useEffect(() => {
    localStorage.setItem('paperglow_pharm_movements', JSON.stringify(movements));
  }, [movements]);

  useEffect(() => {
    localStorage.setItem('paperglow_pharm_sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('paperglow_pharm_pos', JSON.stringify(purchaseOrders));
  }, [purchaseOrders]);

  useEffect(() => {
    localStorage.setItem('paperglow_pharm_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('paperglow_pharm_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem('paperglow_pharm_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('paperglow_pharm_staff', JSON.stringify(staffList));
  }, [staffList]);

  useEffect(() => {
    localStorage.setItem('paperglow_pharm_settings', JSON.stringify(settings));
  }, [settings]);

  // Derived counts for alerts
  const lowStockCount = medicines.filter(
    (m) => m.quantityInStock <= (m.minStockLevel || settings.lowStockThresholdDefault)
  ).length;

  const todayIso = '2026-10-05';
  const ninetyDaysIso = '2027-01-05';
  const expiringCount = medicines.filter(
    (m) => m.expiryDate <= ninetyDaysIso && m.expiryDate >= todayIso
  ).length;

  // Handlers for Inventory
  const handleAddMedicine = (newMedData: Omit<MedicineProduct, 'id'>) => {
    const newId = `med-${Date.now()}`;
    const newMed: MedicineProduct = {
      ...newMedData,
      id: newId,
    };
    setMedicines((prev) => [newMed, ...prev]);

    // Record initial stock movement
    if (newMed.quantityInStock > 0) {
      const movement: StockMovement = {
        id: `mv-${Date.now()}`,
        movementNumber: `STK-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        productId: newId,
        productName: newMed.name,
        batchNumber: newMed.batchNumber,
        movementType: 'purchase_receipt',
        quantityChange: newMed.quantityInStock,
        balanceAfter: newMed.quantityInStock,
        reason: 'Initial inventory intake',
        performedBy: 'System Admin',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      };
      setMovements((prev) => [movement, ...prev]);
    }

    showToast(`Medicine "${newMed.name}" added to catalog.`);
  };

  const handleUpdateMedicine = (updated: MedicineProduct) => {
    setMedicines((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    showToast(`Updated details for "${updated.name}".`);
  };

  // Handlers for Stock Management
  const handleAddStock = (
    productId: string,
    quantityToAdd: number,
    batchNumber: string,
    reason: string
  ) => {
    const product = medicines.find((m) => m.id === productId);
    if (!product) return;

    const newQty = product.quantityInStock + quantityToAdd;
    setMedicines((prev) =>
      prev.map((m) =>
        m.id === productId
          ? {
              ...m,
              quantityInStock: newQty,
              batchNumber: batchNumber || m.batchNumber,
            }
          : m
      )
    );

    const movement: StockMovement = {
      id: `mv-${Date.now()}`,
      movementNumber: `STK-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      productId,
      productName: product.name,
      batchNumber: batchNumber || product.batchNumber,
      movementType: 'purchase_receipt',
      quantityChange: quantityToAdd,
      balanceAfter: newQty,
      reason,
      performedBy: 'Staff Pharmacist',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    setMovements((prev) => [movement, ...prev]);
    showToast(`Added ${quantityToAdd} units of ${product.name} to stock.`);
  };

  const handleAdjustStock = (
    productId: string,
    quantityToDeduct: number,
    reason: string,
    type: StockMovementType
  ) => {
    const product = medicines.find((m) => m.id === productId);
    if (!product) return;

    const newQty = Math.max(0, product.quantityInStock - quantityToDeduct);
    setMedicines((prev) =>
      prev.map((m) => (m.id === productId ? { ...m, quantityInStock: newQty } : m))
    );

    const movement: StockMovement = {
      id: `mv-${Date.now()}`,
      movementNumber: `STK-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      productId,
      productName: product.name,
      batchNumber: product.batchNumber,
      movementType: type,
      quantityChange: -quantityToDeduct,
      balanceAfter: newQty,
      reason,
      performedBy: 'Staff Pharmacist',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    setMovements((prev) => [movement, ...prev]);
    showToast(`Deducted ${quantityToDeduct} units of ${product.name} (${reason}).`);
  };

  // Handlers for Sales
  const handleRecordSale = (saleData: Omit<SaleTransaction, 'id' | 'receiptNumber'>) => {
    const receiptNumber = `RX-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newSale: SaleTransaction = {
      ...saleData,
      id: `sale-${Date.now()}`,
      receiptNumber,
    };

    setSales((prev) => [newSale, ...prev]);

    // Decrement stock for sold products & log movement
    saleData.items.forEach((item) => {
      setMedicines((prev) =>
        prev.map((m) => {
          if (m.id === item.productId) {
            const updatedStock = Math.max(0, m.quantityInStock - item.quantity);
            return { ...m, quantityInStock: updatedStock };
          }
          return m;
        })
      );

      const mvt: StockMovement = {
        id: `mv-${Date.now()}-${Math.random()}`,
        movementNumber: `STK-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        productId: item.productId,
        productName: item.productName,
        batchNumber: item.batchNumber,
        movementType: 'sale_dispense',
        quantityChange: -item.quantity,
        balanceAfter: 0,
        reason: `Dispensed on ${receiptNumber}`,
        performedBy: saleData.dispensedBy,
        timestamp: saleData.timestamp,
      };
      setMovements((prev) => [mvt, ...prev]);
    });

    // Update customer spend if registered
    if (saleData.customerId) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === saleData.customerId
            ? {
                ...c,
                totalSpendKes: c.totalSpendKes + saleData.totalAmountKes,
                lastVisitDate: saleData.timestamp.slice(0, 10),
              }
            : c
        )
      );
    }

    showToast(`Sale #${receiptNumber} processed • KES ${saleData.totalAmountKes.toLocaleString()} received.`);
  };

  // Handlers for Purchases
  const handleCreatePO = (poData: Omit<PurchaseOrder, 'id' | 'poNumber'>) => {
    const poNumber = `PO-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newPO: PurchaseOrder = {
      ...poData,
      id: `po-${Date.now()}`,
      poNumber,
    };
    setPurchaseOrders((prev) => [newPO, ...prev]);

    // Increase supplier balance
    setSuppliers((prev) =>
      prev.map((s) =>
        s.id === poData.supplierId
          ? { ...s, outstandingBalanceKes: s.outstandingBalanceKes + poData.totalCostKes }
          : s
      )
    );

    showToast(`Purchase Order ${poNumber} issued to ${poData.supplierName}.`);
  };

  const handleReceiveStockPO = (poId: string) => {
    const po = purchaseOrders.find((p) => p.id === poId);
    if (!po || po.status === 'received') return;

    setPurchaseOrders((prev) =>
      prev.map((p) =>
        p.id === poId
          ? {
              ...p,
              status: 'received',
              receivedDate: new Date().toISOString().slice(0, 10),
              items: p.items.map((i) => ({ ...i, quantityReceived: i.quantityOrdered })),
            }
          : p
      )
    );

    // Add items to medicine inventory
    po.items.forEach((item) => {
      setMedicines((prev) =>
        prev.map((m) => {
          if (m.id === item.productId) {
            return {
              ...m,
              quantityInStock: m.quantityInStock + item.quantityOrdered,
              batchNumber: item.batchNumber || m.batchNumber,
              expiryDate: item.expiryDate || m.expiryDate,
              buyingPriceKes: item.buyingPriceKes || m.buyingPriceKes,
            };
          }
          return m;
        })
      );

      const mvt: StockMovement = {
        id: `mv-${Date.now()}-${Math.random()}`,
        movementNumber: `STK-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        productId: item.productId,
        productName: item.productName,
        batchNumber: item.batchNumber,
        movementType: 'purchase_receipt',
        quantityChange: item.quantityOrdered,
        balanceAfter: item.quantityOrdered,
        reason: `Restocked from ${po.poNumber} (${po.supplierName})`,
        performedBy: 'Dispensary Incharge',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      };
      setMovements((prev) => [mvt, ...prev]);
    });

    showToast(`Stock received for ${po.poNumber}. Shelves restocked.`);
  };

  const handleRecordPaymentPO = (poId: string, amount: number) => {
    const po = purchaseOrders.find((p) => p.id === poId);
    if (!po) return;

    const newAmountPaid = po.amountPaidKes + amount;
    const isPaid = newAmountPaid >= po.totalCostKes;

    setPurchaseOrders((prev) =>
      prev.map((p) =>
        p.id === poId
          ? {
              ...p,
              amountPaidKes: newAmountPaid,
              paymentStatus: isPaid ? 'paid' : 'partial',
            }
          : p
      )
    );

    // Reduce supplier balance
    setSuppliers((prev) =>
      prev.map((s) =>
        s.id === po.supplierId
          ? { ...s, outstandingBalanceKes: Math.max(0, s.outstandingBalanceKes - amount) }
          : s
      )
    );

    showToast(`KES ${amount.toLocaleString()} paid towards ${po.poNumber}.`);
  };

  // Handlers for Customers
  const handleAddCustomer = (
    custData: Omit<PharmacyCustomer, 'id' | 'totalSpendKes' | 'lastVisitDate'>
  ) => {
    const newCustomer: PharmacyCustomer = {
      ...custData,
      id: `cust-${Date.now()}`,
      totalSpendKes: 0,
      lastVisitDate: new Date().toISOString().slice(0, 10),
    };
    setCustomers((prev) => [newCustomer, ...prev]);
    showToast(`Patient profile for "${newCustomer.name}" created.`);
  };

  const handleUpdateCustomer = (updated: PharmacyCustomer) => {
    setCustomers((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    showToast(`Updated details for patient "${updated.name}".`);
  };

  // Handlers for Suppliers
  const handleAddSupplier = (
    supData: Omit<PharmacySupplier, 'id' | 'outstandingBalanceKes'>
  ) => {
    const newSup: PharmacySupplier = {
      ...supData,
      id: `sup-${Date.now()}`,
      outstandingBalanceKes: 0,
    };
    setSuppliers((prev) => [newSup, ...prev]);
    showToast(`Supplier "${newSup.companyName}" registered.`);
  };

  const handlePaySupplierBalance = (supplierId: string, amount: number) => {
    setSuppliers((prev) =>
      prev.map((s) =>
        s.id === supplierId
          ? { ...s, outstandingBalanceKes: Math.max(0, s.outstandingBalanceKes - amount) }
          : s
      )
    );
    showToast(`Payment of KES ${amount.toLocaleString()} remitted to distributor.`);
  };

  // Handlers for Expenses
  const handleAddExpense = (expData: Omit<PharmacyExpense, 'id' | 'voucherNumber'>) => {
    const voucherNumber = `PH-EXP-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newExpense: PharmacyExpense = {
      ...expData,
      id: `exp-${Date.now()}`,
      voucherNumber,
    };
    setExpenses((prev) => [newExpense, ...prev]);
    showToast(`Voucher ${voucherNumber} recorded (KES ${expData.amountKes.toLocaleString()}).`);
  };

  // Handlers for Staff
  const handleAddStaff = (staffData: Omit<PharmacyStaff, 'id'>) => {
    const newStaff: PharmacyStaff = {
      ...staffData,
      id: `stf-${Date.now()}`,
    };
    setStaffList((prev) => [...prev, newStaff]);
    showToast(`Staff member "${newStaff.name}" added to roster.`);
  };

  const handleToggleStaffStatus = (staffId: string) => {
    setStaffList((prev) =>
      prev.map((s) =>
        s.id === staffId ? { ...s, status: s.status === 'active' ? 'on_leave' : 'active' } : s
      )
    );
  };

  // Settings
  const handleSaveSettings = (newSettings: PharmacySettings) => {
    setSettings(newSettings);
    showToast('Pharmacy premises settings updated.');
  };

  return (
    <div className="min-h-screen bg-neutral-100/70 dark:bg-[#0c0e12] text-neutral-900 dark:text-neutral-100 flex">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-semibold shadow-xl border border-neutral-700 animate-in fade-in slide-in-from-bottom-2">
          {toastMessage}
        </div>
      )}

      {/* Sidebar Navigation */}
      <PharmSidebar
        currentModule={currentModule}
        onSelectModule={setCurrentModule}
        isOpenMobile={isSidebarMobileOpen}
        onCloseMobile={() => setIsSidebarMobileOpen(false)}
        lowStockCount={lowStockCount}
        expiringCount={expiringCount}
        onBackToDirectory={onBackToDirectory}
        onNavigateHome={onNavigateHome}
      />

      {/* Main App Container */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        {/* Top Header */}
        <PharmHeader
          currentModule={currentModule}
          onOpenMobileMenu={() => setIsSidebarMobileOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          lowStockCount={lowStockCount}
          expiringCount={expiringCount}
          onOpenAlerts={() => setCurrentModule('stock')}
          onQuickNewSale={() => setCurrentModule('sales')}
          onQuickAddMedicine={() => setCurrentModule('inventory')}
          onQuickAddPO={() => setCurrentModule('purchases')}
          isDark={isDark}
          onToggleDarkMode={toggleDarkMode}
        />

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentModule === 'dashboard' && (
            <PharmDashboardModule
              medicines={medicines}
              sales={sales}
              purchaseOrders={purchaseOrders}
              onNavigateModule={setCurrentModule}
              onQuickNewSale={() => setCurrentModule('sales')}
              onQuickAddMedicine={() => setCurrentModule('inventory')}
              onQuickAddPO={() => setCurrentModule('purchases')}
            />
          )}

          {currentModule === 'inventory' && (
            <PharmInventoryModule
              medicines={medicines}
              onAddMedicine={handleAddMedicine}
              onUpdateMedicine={handleUpdateMedicine}
              onNavigateToStock={() => setCurrentModule('stock')}
            />
          )}

          {currentModule === 'stock' && (
            <PharmStockManagementModule
              medicines={medicines}
              movements={movements}
              onAddStock={handleAddStock}
              onAdjustStock={handleAdjustStock}
            />
          )}

          {currentModule === 'sales' && (
            <PharmSalesModule
              medicines={medicines}
              sales={sales}
              customers={customers}
              settings={settings}
              onRecordSale={handleRecordSale}
            />
          )}

          {currentModule === 'purchases' && (
            <PharmPurchasesModule
              purchaseOrders={purchaseOrders}
              suppliers={suppliers}
              medicines={medicines}
              onCreatePO={handleCreatePO}
              onReceiveStockPO={handleReceiveStockPO}
              onRecordPaymentPO={handleRecordPaymentPO}
            />
          )}

          {currentModule === 'customers' && (
            <PharmCustomersModule
              customers={customers}
              sales={sales}
              settings={settings}
              onAddCustomer={handleAddCustomer}
              onUpdateCustomer={handleUpdateCustomer}
            />
          )}

          {currentModule === 'suppliers' && (
            <PharmSuppliersModule
              suppliers={suppliers}
              purchaseOrders={purchaseOrders}
              onAddSupplier={handleAddSupplier}
              onPaySupplierBalance={handlePaySupplierBalance}
            />
          )}

          {currentModule === 'reports' && (
            <PharmReportsModule
              medicines={medicines}
              sales={sales}
              purchaseOrders={purchaseOrders}
              expenses={expenses}
            />
          )}

          {currentModule === 'expenses' && (
            <PharmExpensesModule
              expenses={expenses}
              onAddExpense={handleAddExpense}
            />
          )}

          {currentModule === 'staff' && (
            <PharmStaffModule
              staffList={staffList}
              sales={sales}
              onAddStaff={handleAddStaff}
              onToggleStaffStatus={handleToggleStaffStatus}
            />
          )}

          {currentModule === 'settings' && (
            <PharmSettingsModule
              settings={settings}
              onSaveSettings={handleSaveSettings}
            />
          )}
        </main>
      </div>
    </div>
  );
};
