import React, { useState, useEffect } from 'react';
import {
  InventoryModule,
  InventoryProduct,
  ProductCategory,
  Supplier,
  StockMovement,
  PurchaseOrder,
  StockSale,
  StockAlert,
  InventorySettings,
  MovementType,
  StockStatus,
} from '../types/stockInventory';

import {
  DEFAULT_INVENTORY_SETTINGS,
  DEFAULT_CATEGORIES,
  DEFAULT_PRODUCTS,
  DEFAULT_SUPPLIERS,
  DEFAULT_MOVEMENTS,
  DEFAULT_PURCHASES,
  DEFAULT_SALES,
  DEFAULT_ALERTS,
} from '../data/defaultStockInventoryData';

import { StockInventoryHeader } from '../components/stockInventory/StockInventoryHeader';
import { StockInventorySidebar } from '../components/stockInventory/StockInventorySidebar';
import { DashboardModule } from '../components/stockInventory/DashboardModule';
import { ProductsModule } from '../components/stockInventory/ProductsModule';
import { StockManagementModule } from '../components/stockInventory/StockManagementModule';
import { LowStockAlertsModule } from '../components/stockInventory/LowStockAlertsModule';
import { SuppliersModule } from '../components/stockInventory/SuppliersModule';
import { PurchasesModule } from '../components/stockInventory/PurchasesModule';
import { SalesModule } from '../components/stockInventory/SalesModule';
import { CategoriesModule } from '../components/stockInventory/CategoriesModule';
import { BarcodeScannerModule } from '../components/stockInventory/BarcodeScannerModule';
import { ReportsModule } from '../components/stockInventory/ReportsModule';
import { InventorySettingsModule } from '../components/stockInventory/InventorySettingsModule';
import { AddProductModal } from '../components/stockInventory/AddProductModal';
import { StockAdjustmentModal } from '../components/stockInventory/StockAdjustmentModal';
import { CheckCircle2 } from 'lucide-react';

interface StockInventoryPageProps {
  onBackToPaperglow: () => void;
}

export const StockInventoryPage: React.FC<StockInventoryPageProps> = ({
  onBackToPaperglow,
}) => {
  const [currentModule, setCurrentModule] = useState<InventoryModule>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modal States
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<InventoryProduct | null>(null);
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [adjustmentProductId, setAdjustmentProductId] = useState<string | undefined>();

  // Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  // LocalStorage-backed state
  const [products, setProducts] = useState<InventoryProduct[]>(() => {
    const saved = localStorage.getItem('paperglow_inventory_products');
    return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
  });

  const [categories, setCategories] = useState<ProductCategory[]>(() => {
    const saved = localStorage.getItem('paperglow_inventory_categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem('paperglow_inventory_suppliers');
    return saved ? JSON.parse(saved) : DEFAULT_SUPPLIERS;
  });

  const [movements, setMovements] = useState<StockMovement[]>(() => {
    const saved = localStorage.getItem('paperglow_inventory_movements');
    return saved ? JSON.parse(saved) : DEFAULT_MOVEMENTS;
  });

  const [purchases, setPurchases] = useState<PurchaseOrder[]>(() => {
    const saved = localStorage.getItem('paperglow_inventory_purchases');
    return saved ? JSON.parse(saved) : DEFAULT_PURCHASES;
  });

  const [sales, setSales] = useState<StockSale[]>(() => {
    const saved = localStorage.getItem('paperglow_inventory_sales');
    return saved ? JSON.parse(saved) : DEFAULT_SALES;
  });

  const [alerts, setAlerts] = useState<StockAlert[]>(() => {
    const saved = localStorage.getItem('paperglow_inventory_alerts');
    return saved ? JSON.parse(saved) : DEFAULT_ALERTS;
  });

  const [settings, setSettings] = useState<InventorySettings>(() => {
    const saved = localStorage.getItem('paperglow_inventory_settings');
    return saved ? JSON.parse(saved) : DEFAULT_INVENTORY_SETTINGS;
  });

  const [isDark, setIsDark] = useState<boolean>(() => {
    return document.documentElement.classList.contains('dark');
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('paperglow_inventory_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('paperglow_inventory_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('paperglow_inventory_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem('paperglow_inventory_movements', JSON.stringify(movements));
  }, [movements]);

  useEffect(() => {
    localStorage.setItem('paperglow_inventory_purchases', JSON.stringify(purchases));
  }, [purchases]);

  useEffect(() => {
    localStorage.setItem('paperglow_inventory_sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('paperglow_inventory_alerts', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem('paperglow_inventory_settings', JSON.stringify(settings));
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

  // Helper to recompute product status
  const computeProductStatus = (qty: number, min: number, max: number): StockStatus => {
    if (qty === 0) return 'out_of_stock';
    if (qty <= min) return 'low_stock';
    if (max > 0 && qty > max) return 'overstock';
    return 'in_stock';
  };

  // Count metrics
  const lowStockCount = products.filter(
    (p) => p.currentQuantity > 0 && p.currentQuantity <= p.minStockLevel
  ).length;

  const outOfStockCount = products.filter((p) => p.currentQuantity === 0).length;

  const pendingPurchasesCount = purchases.filter((po) => po.status === 'ordered').length;

  // Handlers
  const handleSaveProduct = (
    productData: Omit<InventoryProduct, 'id' | 'updatedAt' | 'status'> & { id?: string }
  ) => {
    const status = computeProductStatus(
      productData.currentQuantity,
      productData.minStockLevel,
      productData.maxStockLevel
    );

    if (productData.id) {
      // Edit
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productData.id
            ? {
                ...p,
                ...productData,
                status,
                updatedAt: new Date().toISOString(),
              }
            : p
        )
      );
      showToast(`Product "${productData.name}" updated successfully.`);
    } else {
      // Create new
      const newId = `prod-${Date.now().toString().slice(-5)}`;
      const newProduct: InventoryProduct = {
        ...productData,
        id: newId,
        status,
        updatedAt: new Date().toISOString(),
      };
      setProducts((prev) => [newProduct, ...prev]);

      // Create initial stock in movement if quantity > 0
      if (newProduct.currentQuantity > 0) {
        const initialMov: StockMovement = {
          id: `MOV-${Date.now().toString().slice(-4)}`,
          productId: newProduct.id,
          productName: newProduct.name,
          sku: newProduct.sku,
          type: 'stock_in',
          quantity: newProduct.currentQuantity,
          previousQuantity: 0,
          newQuantity: newProduct.currentQuantity,
          reason: 'Initial opening inventory setup',
          referenceNumber: 'INIT-SETUP',
          performedBy: 'System Administrator',
          timestamp: new Date().toISOString(),
        };
        setMovements((prev) => [initialMov, ...prev]);
      }

      showToast(`Product "${newProduct.name}" added to catalog.`);
    }

    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast(`Product "${prod?.name || productId}" removed from catalog.`);
  };

  const handleRecordMovement = (
    productId: string,
    type: MovementType,
    quantity: number,
    reason: string,
    referenceNumber: string,
    notes?: string
  ) => {
    const targetProduct = products.find((p) => p.id === productId);
    if (!targetProduct) return;

    let newQty = targetProduct.currentQuantity;
    if (type === 'stock_in') {
      newQty += quantity;
    } else if (type === 'stock_out' || type === 'damaged_lost') {
      newQty = Math.max(0, targetProduct.currentQuantity - quantity);
    } else if (type === 'adjustment' || type === 'transfer') {
      // adjust
      newQty = Math.max(0, targetProduct.currentQuantity + quantity);
    }

    const newStatus = computeProductStatus(
      newQty,
      targetProduct.minStockLevel,
      targetProduct.maxStockLevel
    );

    // Update Product
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              currentQuantity: newQty,
              status: newStatus,
              updatedAt: new Date().toISOString(),
            }
          : p
      )
    );

    // Add Movement Log
    const newMovement: StockMovement = {
      id: `MOV-${Math.floor(1000 + Math.random() * 9000)}`,
      productId: targetProduct.id,
      productName: targetProduct.name,
      sku: targetProduct.sku,
      type,
      quantity,
      previousQuantity: targetProduct.currentQuantity,
      newQuantity: newQty,
      reason,
      referenceNumber,
      performedBy: 'Hassan Juma (Storekeeper)',
      timestamp: new Date().toISOString(),
      notes,
    };

    setMovements((prev) => [newMovement, ...prev]);
    showToast(`Stock updated for ${targetProduct.name}: New Balance = ${newQty} ${targetProduct.unit}.`);
  };

  const handleReceiveStock = (poId: string) => {
    const po = purchases.find((p) => p.id === poId);
    if (!po) return;

    // Update PO status
    setPurchases((prev) =>
      prev.map((p) => (p.id === poId ? { ...p, status: 'received' } : p))
    );

    // Increment inventory for each item and add movements
    po.items.forEach((item) => {
      handleRecordMovement(
        item.productId,
        'stock_in',
        item.quantity,
        `Received delivery for Purchase Order ${po.poNumber}`,
        po.poNumber,
        `Vendor Delivery: ${po.supplierName}`
      );
    });

    showToast(`Purchase Order ${po.poNumber} received into warehouse balance!`);
  };

  const handleRecordSale = (saleData: Omit<StockSale, 'id' | 'createdAt'>) => {
    const newSaleId = `SALE-${Date.now().toString().slice(-4)}`;
    const newSale: StockSale = {
      ...saleData,
      id: newSaleId,
      createdAt: new Date().toISOString(),
    };

    setSales((prev) => [newSale, ...prev]);

    // Decrement stock for each item
    saleData.items.forEach((item) => {
      handleRecordMovement(
        item.productId,
        'stock_out',
        item.quantity,
        `Customer sale dispatched to ${saleData.customerName}`,
        saleData.receiptNumber,
        `Settled via ${saleData.paymentMethod.toUpperCase()}`
      );
    });

    showToast(`Sales order ${saleData.receiptNumber} completed (KES ${saleData.totalAmountKes.toLocaleString()})!`);
  };

  const handleUpdateMinStock = (productId: string, newMinStock: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const status = computeProductStatus(p.currentQuantity, newMinStock, p.maxStockLevel);
          return { ...p, minStockLevel: newMinStock, status };
        }
        return p;
      })
    );
    showToast('Product minimum threshold updated.');
  };

  const handleAddSupplier = (
    supplierData: Omit<Supplier, 'id' | 'outstandingBalanceKes' | 'totalPurchasesKes'>
  ) => {
    const newId = `sup-${Date.now().toString().slice(-4)}`;
    const newSupplier: Supplier = {
      ...supplierData,
      id: newId,
      outstandingBalanceKes: 0,
      totalPurchasesKes: 0,
    };
    setSuppliers((prev) => [...prev, newSupplier]);
    showToast(`Supplier "${newSupplier.name}" added.`);
  };

  const handleAddCategory = (categoryData: Omit<ProductCategory, 'id'>) => {
    const newId = `cat-${Date.now().toString().slice(-4)}`;
    const newCategory: ProductCategory = {
      ...categoryData,
      id: newId,
    };
    setCategories((prev) => [...prev, newCategory]);
    showToast(`Category "${newCategory.name}" created.`);
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    showToast('Category deleted.');
  };

  const handleResetDemoData = () => {
    setProducts(DEFAULT_PRODUCTS);
    setCategories(DEFAULT_CATEGORIES);
    setSuppliers(DEFAULT_SUPPLIERS);
    setMovements(DEFAULT_MOVEMENTS);
    setPurchases(DEFAULT_PURCHASES);
    setSales(DEFAULT_SALES);
    setAlerts(DEFAULT_ALERTS);
    setSettings(DEFAULT_INVENTORY_SETTINGS);
    localStorage.removeItem('paperglow_inventory_products');
    localStorage.removeItem('paperglow_inventory_categories');
    localStorage.removeItem('paperglow_inventory_suppliers');
    localStorage.removeItem('paperglow_inventory_movements');
    localStorage.removeItem('paperglow_inventory_purchases');
    localStorage.removeItem('paperglow_inventory_sales');
    localStorage.removeItem('paperglow_inventory_alerts');
    localStorage.removeItem('paperglow_inventory_settings');
    showToast('Reset to default Paperglow Stock Inventory demo data.');
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#0c0e12] text-neutral-900 dark:text-neutral-100 flex flex-col font-['DM_Sans']">
      {/* Top Header */}
      <StockInventoryHeader
        currentModule={currentModule}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenAddProduct={() => {
          setEditingProduct(null);
          setIsAddProductOpen(true);
        }}
        onNavigateBarcode={() => setCurrentModule('barcode')}
        onBackToPaperglow={onBackToPaperglow}
        isDark={isDark}
        toggleDarkMode={toggleDarkMode}
        lowStockCount={lowStockCount}
        outOfStockCount={outOfStockCount}
      />

      {/* Main Flex Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <StockInventorySidebar
          currentModule={currentModule}
          onSelectModule={(mod) => setCurrentModule(mod)}
          totalProductsCount={products.length}
          lowStockCount={lowStockCount}
          outOfStockCount={outOfStockCount}
          pendingPurchasesCount={pendingPurchasesCount}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          onOpenAddProduct={() => {
            setEditingProduct(null);
            setIsAddProductOpen(true);
          }}
        />

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
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
              products={products}
              movements={movements}
              purchases={purchases}
              onNavigateModule={(mod) => setCurrentModule(mod)}
              onOpenAddProduct={() => {
                setEditingProduct(null);
                setIsAddProductOpen(true);
              }}
              onOpenStockAdjustment={(prodId) => {
                setAdjustmentProductId(prodId);
                setIsAdjustmentModalOpen(true);
              }}
            />
          )}

          {/* Module 2: Products & SKUs */}
          {currentModule === 'products' && (
            <ProductsModule
              products={products}
              categories={categories}
              suppliers={suppliers}
              onOpenAddProduct={() => {
                setEditingProduct(null);
                setIsAddProductOpen(true);
              }}
              onOpenEditProduct={(prod) => {
                setEditingProduct(prod);
                setIsAddProductOpen(true);
              }}
              onDeleteProduct={handleDeleteProduct}
              onOpenStockAdjustment={(prodId) => {
                setAdjustmentProductId(prodId);
                setIsAdjustmentModalOpen(true);
              }}
            />
          )}

          {/* Module 3: Stock Management */}
          {currentModule === 'stock_management' && (
            <StockManagementModule
              products={products}
              movements={movements}
              onRecordMovement={handleRecordMovement}
            />
          )}

          {/* Module 4: Low Stock Alerts */}
          {currentModule === 'alerts' && (
            <LowStockAlertsModule
              products={products}
              alerts={alerts}
              onDismissAlert={(altId) =>
                setAlerts((prev) => prev.map((a) => (a.id === altId ? { ...a, isDismissed: true } : a)))
              }
              onUpdateMinStock={handleUpdateMinStock}
              onCreatePOForProduct={(prod) => {
                setCurrentModule('purchases');
              }}
            />
          )}

          {/* Module 5: Suppliers */}
          {currentModule === 'suppliers' && (
            <SuppliersModule
              suppliers={suppliers}
              products={products}
              purchases={purchases}
              onAddSupplier={handleAddSupplier}
            />
          )}

          {/* Module 6: Purchases */}
          {currentModule === 'purchases' && (
            <PurchasesModule
              purchases={purchases}
              suppliers={suppliers}
              products={products}
              onCreatePurchaseOrder={(poData) => {
                const newPo: PurchaseOrder = {
                  ...poData,
                  id: `PO-${Date.now().toString().slice(-4)}`,
                  createdAt: new Date().toISOString(),
                };
                setPurchases((prev) => [newPo, ...prev]);
                showToast(`Purchase order ${newPo.poNumber} created successfully!`);
              }}
              onReceiveStock={handleReceiveStock}
            />
          )}

          {/* Module 7: Sales / Stock Out */}
          {currentModule === 'sales' && (
            <SalesModule
              sales={sales}
              products={products}
              onRecordSale={handleRecordSale}
            />
          )}

          {/* Module 8: Categories */}
          {currentModule === 'categories' && (
            <CategoriesModule
              categories={categories}
              products={products}
              onAddCategory={handleAddCategory}
              onDeleteCategory={handleDeleteCategory}
              onSelectCategoryFilter={(catId) => {
                setCurrentModule('products');
              }}
            />
          )}

          {/* Module 9: Barcode Scanner */}
          {currentModule === 'barcode' && (
            <BarcodeScannerModule
              products={products}
              onOpenStockAdjustment={(prodId) => {
                setAdjustmentProductId(prodId);
                setIsAdjustmentModalOpen(true);
              }}
              onOpenEditProduct={(prod) => {
                setEditingProduct(prod);
                setIsAddProductOpen(true);
              }}
            />
          )}

          {/* Module 10: Reports */}
          {currentModule === 'reports' && (
            <ReportsModule
              products={products}
              movements={movements}
              purchases={purchases}
              sales={sales}
              categories={categories}
              suppliers={suppliers}
            />
          )}

          {/* Module 11: Settings */}
          {currentModule === 'settings' && (
            <InventorySettingsModule
              settings={settings}
              onUpdateSettings={(updated) => {
                setSettings(updated);
                showToast('Inventory settings updated.');
              }}
              onResetDemoData={handleResetDemoData}
            />
          )}
        </div>
      </div>

      {/* Modal: Add/Edit Product */}
      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => {
          setIsAddProductOpen(false);
          setEditingProduct(null);
        }}
        categories={categories}
        suppliers={suppliers}
        editingProduct={editingProduct}
        onSaveProduct={handleSaveProduct}
      />

      {/* Modal: Stock Adjustment */}
      <StockAdjustmentModal
        isOpen={isAdjustmentModalOpen}
        onClose={() => setIsAdjustmentModalOpen(false)}
        products={products}
        initialProductId={adjustmentProductId}
        onRecordMovement={handleRecordMovement}
      />
    </div>
  );
};
