import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  FileSpreadsheet,
  Plus,
  Trash2,
  Copy,
  Edit3,
  Printer,
  Download,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  ArrowLeft,
  ChevronDown,
  Calendar,
  Building,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Eye,
  Check,
  X,
  RefreshCw,
  Send,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  InvoiceDocument,
  InvoiceLineItem,
  DocumentType,
  DocumentStatus,
  BusinessDetails,
  CompanyDetails,
  CustomerDetails,
  PaymentDetails,
} from '../types/invoice';
import {
  DEFAULT_BUSINESS_DETAILS,
  DEFAULT_CUSTOMER_DETAILS,
  DEFAULT_PAYMENT_DETAILS,
  INITIAL_DEMO_DOCUMENTS,
} from '../data/defaultInvoiceData';

interface InvoiceGeneratorPageProps {
  onBackToDirectory?: () => void;
  onNavigateHome?: () => void;
  onOpenAccount?: () => void;
}

export const InvoiceGeneratorPage: React.FC<InvoiceGeneratorPageProps> = ({
  onBackToDirectory,
  onNavigateHome,
}) => {
  // ── Document Store & Persistence ──
  const [documents, setDocuments] = useState<InvoiceDocument[]>(() => {
    const saved = localStorage.getItem('paperglow_invoices_quotations');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse stored invoices:', e);
      }
    }
    return INITIAL_DEMO_DOCUMENTS;
  });

  useEffect(() => {
    localStorage.setItem('paperglow_invoices_quotations', JSON.stringify(documents));
  }, [documents]);

  // ── UI Mode States ──
  // 'list' = Dashboard & Documents Table
  // 'edit' = Document Creator / Editor
  // 'preview' = Full-screen A4 Document Preview
  const [viewMode, setViewMode] = useState<'list' | 'edit' | 'preview'>('list');

  // Active Document Being Edited or Previewed
  const [activeDoc, setActiveDoc] = useState<InvoiceDocument | null>(() => documents[0] || null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'invoice' | 'quotation'>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ── Computed Financial Metrics for Dashboard ──
  const metrics = useMemo(() => {
    let totalInvoicesAmount = 0;
    let totalInvoicesCount = 0;
    let totalQuotationsAmount = 0;
    let totalQuotationsCount = 0;
    let paidAmount = 0;
    let unpaidAmount = 0;
    let overdueAmount = 0;
    let overdueCount = 0;

    documents.forEach((doc) => {
      const docTotal = doc.totalAmount || 0;
      const isInv = (doc.type || doc.documentType) === 'invoice';

      if (isInv) {
        totalInvoicesCount += 1;
        totalInvoicesAmount += docTotal;
        if (doc.status === 'paid') {
          paidAmount += docTotal;
        } else if (doc.status === 'overdue') {
          overdueAmount += docTotal;
          overdueCount += 1;
          unpaidAmount += docTotal;
        } else if (doc.status === 'unpaid' || doc.status === 'pending' || doc.status === 'draft') {
          unpaidAmount += docTotal;
        }
      } else {
        totalQuotationsCount += 1;
        totalQuotationsAmount += docTotal;
      }
    });

    return {
      totalInvoicesAmount,
      totalInvoicesCount,
      totalQuotationsAmount,
      totalQuotationsCount,
      paidAmount,
      unpaidAmount,
      overdueAmount,
      overdueCount,
    };
  }, [documents]);

  // ── Filtered Documents List ──
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      // Type filter
      if (filterType !== 'all') {
        const docType = doc.type || doc.documentType;
        if (docType !== filterType) return false;
      }

      // Status filter
      if (filterStatus !== 'all' && doc.status !== filterStatus) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesNum = doc.documentNumber.toLowerCase().includes(q);
        const clientName = doc.customer.clientName || doc.customer.name || '';
        const matchesClient = clientName.toLowerCase().includes(q);
        const matchesRef = doc.referenceNumber?.toLowerCase().includes(q);
        const matchesItems = doc.items.some((i) =>
          (i.title && i.title.toLowerCase().includes(q)) || (i.description && i.description.toLowerCase().includes(q))
        );
        return matchesNum || matchesClient || matchesRef || matchesItems;
      }

      return true;
    });
  }, [documents, filterType, filterStatus, searchQuery]);

  // ── Helper to Create a New Blank Document ──
  const createNewDocument = (type: DocumentType) => {
    const today = new Date().toISOString().split('T')[0];
    const due = new Date(Date.now() + (type === 'invoice' ? 14 : 21) * 86400000).toISOString().split('T')[0];

    const currentTypeDocs = documents.filter((d) => (d.type || d.documentType) === type);
    const nextSeq = (currentTypeDocs.length + 44).toString().padStart(4, '0');
    const docNumber = type === 'invoice' ? `INV-2026-${nextSeq}` : `QUO-2026-${nextSeq}`;

    const newDoc: InvoiceDocument = {
      id: `doc-${Date.now()}`,
      documentType: type,
      type: type,
      documentNumber: docNumber,
      referenceNumber: '',
      issueDate: today,
      dueDate: due,
      status: 'draft',
      currency: 'KES',
      company: { ...DEFAULT_BUSINESS_DETAILS },
      business: { ...DEFAULT_BUSINESS_DETAILS },
      customer: { ...DEFAULT_CUSTOMER_DETAILS, name: '', clientName: '', contactPerson: '', email: '', phone: '', address: '' },
      items: [
        {
          id: `item-${Date.now()}-1`,
          title: '',
          description: '',
          quantity: 1,
          unitPrice: 0,
          discountPercent: 0,
          taxPercent: 16,
          total: 0,
        },
      ],
      discountType: 'percentage',
      discountValue: 0,
      taxRatePercent: 16,
      subtotal: 0,
      discountAmount: 0,
      taxAmount: 0,
      totalAmount: 0,
      amountPaid: 0,
      notes: type === 'invoice'
        ? 'Thank you for your business. Please quote the invoice number on your payment confirmation.'
        : 'This quotation is valid for 21 days from the date of issue. Prices inclusive of 16% Kenya VAT.',
      paymentTerms: type === 'invoice'
        ? 'Payment due within 14 days. Official electronic tax receipt issued upon clearance.'
        : '50% deposit on acceptance to commence work, 50% balance upon final inspection.',
      paymentDetails: { ...DEFAULT_PAYMENT_DETAILS },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setActiveDoc(newDoc);
    setViewMode('edit');
  };

  // ── Calculation Helper ──
  const recalculateDocumentTotals = (doc: InvoiceDocument): InvoiceDocument => {
    // 1. Recalculate line items
    const updatedItems = doc.items.map((item) => {
      const lineGross = (item.quantity || 0) * (item.unitPrice || 0);
      const lineDisc = lineGross * ((item.discountPercent || 0) / 100);
      const lineNet = Math.max(0, lineGross - lineDisc);
      return {
        ...item,
        total: Math.round(lineNet),
      };
    });

    // 2. Sum Subtotal
    const subtotal = updatedItems.reduce((acc, curr) => acc + (curr.total || 0), 0);

    // 3. Document Discount
    let discountAmount = 0;
    if (doc.discountType === 'percentage') {
      discountAmount = Math.round(subtotal * ((doc.discountValue || 0) / 100));
    } else {
      discountAmount = Math.min(subtotal, doc.discountValue || 0);
    }

    const netTaxable = Math.max(0, subtotal - discountAmount);

    // 4. Tax (e.g. 16% VAT)
    const taxAmount = Math.round(netTaxable * ((doc.taxRatePercent || 0) / 100));

    // 5. Grand Total
    const totalAmount = netTaxable + taxAmount;

    return {
      ...doc,
      items: updatedItems,
      subtotal,
      discountAmount,
      taxAmount,
      totalAmount,
      updatedAt: new Date().toISOString(),
    };
  };

  // ── Document Operations ──
  const handleSaveDocument = (docToSave: InvoiceDocument) => {
    const calculated = recalculateDocumentTotals(docToSave);

    setDocuments((prev) => {
      const exists = prev.some((d) => d.id === calculated.id);
      if (exists) {
        return prev.map((d) => (d.id === calculated.id ? calculated : d));
      } else {
        return [calculated, ...prev];
      }
    });

    setActiveDoc(calculated);
    const docTypeLabel = (calculated.type || calculated.documentType) === 'invoice' ? 'Invoice' : 'Quotation';
    showToast(`${docTypeLabel} ${calculated.documentNumber} saved successfully!`);
  };

  const handleDuplicateDocument = (doc: InvoiceDocument) => {
    const today = new Date().toISOString().split('T')[0];
    const isInv = (doc.type || doc.documentType) === 'invoice';
    const nextSeq = (documents.length + 50).toString().padStart(4, '0');
    const newDocNum = isInv ? `INV-2026-${nextSeq}` : `QUO-2026-${nextSeq}`;

    const cloned: InvoiceDocument = {
      ...doc,
      id: `doc-${Date.now()}`,
      documentNumber: newDocNum,
      issueDate: today,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setDocuments((prev) => [cloned, ...prev]);
    setActiveDoc(cloned);
    showToast(`Duplicated document as ${cloned.documentNumber}`);
  };

  const handleDeleteDocument = (id: string, docNumber: string) => {
    if (window.confirm(`Are you sure you want to delete ${docNumber}?`)) {
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      if (activeDoc?.id === id) {
        setActiveDoc(documents.find((d) => d.id !== id) || null);
      }
      showToast(`${docNumber} deleted.`);
    }
  };

  const handleConvertQuotationToInvoice = (quotation: InvoiceDocument) => {
    const today = new Date().toISOString().split('T')[0];
    const due = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];
    const invCount = documents.filter((d) => (d.type || d.documentType) === 'invoice').length;
    const invNum = `INV-2026-${(invCount + 44).toString().padStart(4, '0')}`;

    // Mark original quotation as 'converted'
    const updatedQuotation: InvoiceDocument = {
      ...quotation,
      status: 'converted',
      updatedAt: new Date().toISOString(),
    };

    // Create new Invoice
    const newInvoice: InvoiceDocument = {
      ...quotation,
      id: `doc-${Date.now()}`,
      documentType: 'invoice',
      type: 'invoice',
      documentNumber: invNum,
      referenceNumber: quotation.documentNumber, // Cross-reference the quotation
      issueDate: today,
      dueDate: due,
      status: 'unpaid',
      notes: `Converted from Quotation ${quotation.documentNumber}. ${quotation.notes || ''}`,
      paymentTerms: 'Payment due within 14 days of invoice date.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setDocuments((prev) => [newInvoice, ...prev.map((d) => (d.id === quotation.id ? updatedQuotation : d))]);
    setActiveDoc(newInvoice);
    setViewMode('edit');
    showToast(`Quotation ${quotation.documentNumber} converted to Invoice ${newInvoice.documentNumber}!`);
  };

  const handleStatusChange = (id: string, newStatus: DocumentStatus) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: newStatus, updatedAt: new Date().toISOString() } : d))
    );
    if (activeDoc?.id === id) {
      setActiveDoc((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    showToast(`Status updated to ${newStatus}`);
  };

  const handlePrintDocument = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#0c0e12] text-neutral-900 dark:text-neutral-100 font-sans pb-16">
      {/* ── Toast Feedback Notification ── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 px-4 py-3 rounded-lg shadow-xl text-xs font-semibold flex items-center space-x-2 border border-neutral-700 dark:border-neutral-300 transition-all animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── Top Application Sub-Header Bar ── */}
      <div className="sticky top-16 z-30 bg-white/95 dark:bg-[#12151b]/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            {onBackToDirectory && (
              <button
                onClick={onBackToDirectory}
                className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                title="Back to Applications Directory"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}

            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center shadow-xs">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-sm sm:text-base font-bold font-['Poppins'] tracking-tight text-neutral-900 dark:text-neutral-100">
                    Invoice &amp; Quotation Generator
                  </h1>
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400">
                    KES / KRA Ready
                  </span>
                </div>
                <div className="text-[11px] text-neutral-500">
                  Paperglow Commercial Business Platform · Live Preview
                </div>
              </div>
            </div>
          </div>

          {/* Top Bar Mode Toggles & CTAs */}
          <div className="flex items-center space-x-2 self-start sm:self-auto">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              Dashboard &amp; Ledgers
            </button>

            {activeDoc && (
              <>
                <button
                  onClick={() => setViewMode('edit')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    viewMode === 'edit'
                      ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  Editor ({activeDoc.documentNumber})
                </button>
                <button
                  onClick={() => setViewMode('preview')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center space-x-1 ${
                    viewMode === 'preview'
                      ? 'bg-red-600 text-white'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>A4 Print Preview</span>
                </button>
              </>
            )}

            <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800 hidden sm:block" />

            <button
              onClick={() => createNewDocument('invoice')}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white flex items-center space-x-1 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ New Invoice</span>
            </button>
            <button
              onClick={() => createNewDocument('quotation')}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center space-x-1 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ New Quote</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* ═════════════════════════════════════════════════════════════════════
            VIEW 1: DASHBOARD & DOCUMENTS LIST
        ══════════════════════════════════════════════════════════════════════ */}
        {viewMode === 'list' && (
          <div className="space-y-6">
            {/* Financial Executive Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Total Invoices Metric */}
              <div className="p-4 sm:p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12151b] shadow-xs space-y-1.5">
                <div className="flex items-center justify-between text-neutral-500">
                  <span className="text-xs font-medium">Total Invoiced</span>
                  <FileText className="w-4 h-4 text-neutral-400" />
                </div>
                <div className="text-lg sm:text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100 tabular-nums">
                  KES {metrics.totalInvoicesAmount.toLocaleString()}
                </div>
                <div className="text-[11px] text-neutral-500">
                  {metrics.totalInvoicesCount} commercial invoice{metrics.totalInvoicesCount === 1 ? '' : 's'} issued
                </div>
              </div>

              {/* Total Paid Revenue */}
              <div className="p-4 sm:p-5 rounded-xl border border-emerald-200 dark:border-emerald-950/60 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400">
                  <span className="text-xs font-medium">Collected Revenue</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-lg sm:text-2xl font-bold font-mono text-emerald-700 dark:text-emerald-400 tabular-nums">
                  KES {metrics.paidAmount.toLocaleString()}
                </div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-500">
                  Verified payments cleared via bank &amp; M-Pesa
                </div>
              </div>

              {/* Unpaid & Outstanding */}
              <div className="p-4 sm:p-5 rounded-xl border border-amber-200 dark:border-amber-950/60 bg-amber-50/40 dark:bg-amber-950/20 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between text-amber-700 dark:text-amber-400">
                  <span className="text-xs font-medium">Outstanding Receivables</span>
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-lg sm:text-2xl font-bold font-mono text-amber-700 dark:text-amber-400 tabular-nums">
                  KES {metrics.unpaidAmount.toLocaleString()}
                </div>
                <div className="text-[11px] text-amber-600 dark:text-amber-500">
                  {metrics.overdueCount > 0 ? (
                    <span className="font-semibold text-red-600">
                      KES {metrics.overdueAmount.toLocaleString()} overdue ({metrics.overdueCount})
                    </span>
                  ) : (
                    'All receivables within terms'
                  )}
                </div>
              </div>

              {/* Total Quotations Pipeline */}
              <div className="p-4 sm:p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12151b] shadow-xs space-y-1.5">
                <div className="flex items-center justify-between text-neutral-500">
                  <span className="text-xs font-medium">Quotations Pipeline</span>
                  <FileSpreadsheet className="w-4 h-4 text-red-600" />
                </div>
                <div className="text-lg sm:text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100 tabular-nums">
                  KES {metrics.totalQuotationsAmount.toLocaleString()}
                </div>
                <div className="text-[11px] text-neutral-500">
                  {metrics.totalQuotationsCount} active client proforma estimate{metrics.totalQuotationsCount === 1 ? '' : 's'}
                </div>
              </div>
            </div>

            {/* Controls Bar: Search, Type Tabs, Status Filters */}
            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12151b] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-xs">
              {/* Search Field */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by invoice number, client, scope, or item title..."
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs focus:outline-none focus:ring-1 focus:ring-red-600"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Segmented Filter Buttons */}
              <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0">
                {/* Document Type Segment */}
                <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg text-xs font-medium">
                  <button
                    onClick={() => setFilterType('all')}
                    className={`px-3 py-1 rounded-md transition-colors ${
                      filterType === 'all'
                        ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs font-semibold'
                        : 'text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    All ({documents.length})
                  </button>
                  <button
                    onClick={() => setFilterType('invoice')}
                    className={`px-3 py-1 rounded-md transition-colors ${
                      filterType === 'invoice'
                        ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs font-semibold'
                        : 'text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    Invoices ({documents.filter((d) => (d.type || d.documentType) === 'invoice').length})
                  </button>
                  <button
                    onClick={() => setFilterType('quotation')}
                    className={`px-3 py-1 rounded-md transition-colors ${
                      filterType === 'quotation'
                        ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs font-semibold'
                        : 'text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    Quotes ({documents.filter((d) => (d.type || d.documentType) === 'quotation').length})
                  </button>
                </div>

                {/* Status Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs text-neutral-700 dark:text-neutral-300 focus:outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="draft">Draft</option>
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid / Sent</option>
                  <option value="overdue">Overdue</option>
                  <option value="accepted">Accepted</option>
                  <option value="converted">Converted</option>
                </select>
              </div>
            </div>

            {/* Documents Data Table */}
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12151b] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 dark:bg-neutral-900/60 text-neutral-500 uppercase font-semibold text-[10px] tracking-wider border-b border-neutral-200 dark:border-neutral-800">
                    <tr>
                      <th className="py-3 px-4">Doc #</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Client</th>
                      <th className="py-3 px-4">Scope / Description</th>
                      <th className="py-3 px-4">Date &amp; Due</th>
                      <th className="py-3 px-4 text-right">Total (KES)</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                    {filteredDocuments.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-neutral-500">
                          <FileText className="w-8 h-8 mx-auto text-neutral-400 mb-2" />
                          <div className="font-semibold text-neutral-800 dark:text-neutral-200">No documents found</div>
                          <div className="text-[11px] mt-0.5">Try clearing filters or create a new invoice or quotation above.</div>
                        </td>
                      </tr>
                    ) : (
                      filteredDocuments.map((doc) => {
                        const isQuote = (doc.type || doc.documentType) === 'quotation';
                        const firstItemTitle = doc.items[0]?.title || doc.items[0]?.description || 'Custom Scope';
                        const clientName = doc.customer.clientName || doc.customer.name || 'Untitled Client';
                        const total = doc.totalAmount || 0;

                        return (
                          <tr
                            key={doc.id}
                            className="hover:bg-neutral-50/60 dark:hover:bg-neutral-900/30 transition-colors group cursor-pointer"
                            onClick={() => {
                              setActiveDoc(doc);
                              setViewMode('edit');
                            }}
                          >
                            <td className="py-3.5 px-4 font-mono font-bold text-neutral-900 dark:text-neutral-100 whitespace-nowrap">
                              {doc.documentNumber}
                              {doc.referenceNumber && (
                                <div className="text-[10px] text-neutral-400 font-normal">
                                  Ref: {doc.referenceNumber}
                                </div>
                              )}
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                  isQuote
                                    ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                                    : 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400'
                                }`}
                              >
                                {isQuote ? 'Quote' : 'Invoice'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-semibold text-neutral-900 dark:text-neutral-100">
                              <div>{clientName}</div>
                              {doc.customer.contactPerson && (
                                <div className="text-[10px] text-neutral-400 font-normal">
                                  {doc.customer.contactPerson}
                                </div>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-400 max-w-xs truncate">
                              {firstItemTitle}
                              {doc.items.length > 1 && (
                                <span className="text-neutral-400 text-[10px] ml-1">
                                  (+{doc.items.length - 1} more)
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap text-[11px]">
                              <div className="text-neutral-700 dark:text-neutral-300">{doc.issueDate}</div>
                              <div className="text-neutral-400 text-[10px]">
                                {isQuote ? `Valid: ${doc.dueDate}` : `Due: ${doc.dueDate}`}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-right font-mono font-bold text-neutral-900 dark:text-neutral-100 whitespace-nowrap tabular-nums">
                              KES {total.toLocaleString()}
                            </td>
                            <td className="py-3.5 px-4 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                              <select
                                value={doc.status}
                                onChange={(e) => handleStatusChange(doc.id, e.target.value as DocumentStatus)}
                                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border ${
                                  doc.status === 'paid'
                                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                                    : doc.status === 'overdue'
                                    ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
                                    : doc.status === 'accepted'
                                    ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                                    : doc.status === 'converted'
                                    ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                                    : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                                }`}
                              >
                                {isQuote ? (
                                  <>
                                    <option value="draft">Draft</option>
                                    <option value="sent">Sent</option>
                                    <option value="accepted">Accepted</option>
                                    <option value="converted">Converted</option>
                                    <option value="declined">Declined</option>
                                  </>
                                ) : (
                                  <>
                                    <option value="draft">Draft</option>
                                    <option value="unpaid">Unpaid</option>
                                    <option value="paid">Paid</option>
                                    <option value="overdue">Overdue</option>
                                  </>
                                )}
                              </select>
                            </td>
                            <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-end space-x-1">
                                {isQuote && doc.status !== 'converted' && (
                                  <button
                                    onClick={() => handleConvertQuotationToInvoice(doc)}
                                    className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-purple-600 dark:text-purple-400"
                                    title="Convert to Commercial Invoice"
                                  >
                                    <Layers className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                <button
                                  onClick={() => {
                                    setActiveDoc(doc);
                                    setViewMode('preview');
                                  }}
                                  className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                                  title="View A4 Preview"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    setActiveDoc(doc);
                                    setViewMode('edit');
                                  }}
                                  className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                                  title="Edit Document"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDuplicateDocument(doc)}
                                  className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                                  title="Duplicate Document"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteDocument(doc.id, doc.documentNumber)}
                                  className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-950/40 text-neutral-400 hover:text-red-600 transition-colors"
                                  title="Delete Document"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════════
            VIEW 2: DOCUMENT CREATOR & INTERACTIVE EDITOR
        ══════════════════════════════════════════════════════════════════════ */}
        {viewMode === 'edit' && activeDoc && (
          <DocumentEditor
            initialDoc={activeDoc}
            onSave={(updated) => handleSaveDocument(updated)}
            onPreview={() => setViewMode('preview')}
            onDuplicate={() => handleDuplicateDocument(activeDoc)}
            onConvert={
              (activeDoc.type || activeDoc.documentType) === 'quotation'
                ? () => handleConvertQuotationToInvoice(activeDoc)
                : undefined
            }
            onBack={() => setViewMode('list')}
            onPrint={() => {
              setViewMode('preview');
              setTimeout(() => window.print(), 300);
            }}
          />
        )}

        {/* ═════════════════════════════════════════════════════════════════════
            VIEW 3: PROFESSIONAL PRINTABLE A4 PREVIEW (WITH PDF DOWNLOAD)
        ══════════════════════════════════════════════════════════════════════ */}
        {viewMode === 'preview' && activeDoc && (
          <DocumentA4Preview
            document={activeDoc}
            onBack={() => setViewMode('edit')}
            onPrint={handlePrintDocument}
            onEdit={() => setViewMode('edit')}
            onConvert={
              (activeDoc.type || activeDoc.documentType) === 'quotation'
                ? () => handleConvertQuotationToInvoice(activeDoc)
                : undefined
            }
          />
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: DocumentEditor (Creation & Customization Form)
// ─────────────────────────────────────────────────────────────────────────────

interface DocumentEditorProps {
  initialDoc: InvoiceDocument;
  onSave: (doc: InvoiceDocument) => void;
  onPreview: () => void;
  onDuplicate: () => void;
  onConvert?: () => void;
  onBack: () => void;
  onPrint: () => void;
}

const DocumentEditor: React.FC<DocumentEditorProps> = ({
  initialDoc,
  onSave,
  onPreview,
  onDuplicate,
  onConvert,
  onBack,
  onPrint,
}) => {
  const [doc, setDoc] = useState<InvoiceDocument>(initialDoc);
  const [isDirty, setIsDirty] = useState(false);

  // Keep state synced if initialDoc changes
  useEffect(() => {
    setDoc(initialDoc);
    setIsDirty(false);
  }, [initialDoc.id]);

  // Recalculate anytime relevant fields change
  const updateDocumentField = <K extends keyof InvoiceDocument>(field: K, value: InvoiceDocument[K]) => {
    setDoc((prev) => {
      const next: InvoiceDocument = { ...prev, [field]: value };
      setIsDirty(true);
      return recalculate(next);
    });
  };

  const updateBusinessField = <K extends keyof BusinessDetails>(field: K, value: BusinessDetails[K]) => {
    setDoc((prev) => {
      const currentBusiness = prev.business || prev.company || DEFAULT_BUSINESS_DETAILS;
      const updatedBusiness: CompanyDetails = {
        ...currentBusiness,
        [field]: value,
      };
      setIsDirty(true);
      return {
        ...prev,
        business: updatedBusiness,
        company: updatedBusiness,
      };
    });
  };

  const updateCustomerField = <K extends keyof CustomerDetails>(field: K, value: CustomerDetails[K]) => {
    setDoc((prev) => {
      const updatedCustomer: CustomerDetails = {
        ...prev.customer,
        [field]: value,
        name: field === 'clientName' ? (value as string) : (prev.customer.name || (value as string)),
        clientName: field === 'name' ? (value as string) : (prev.customer.clientName || (value as string)),
      };
      setIsDirty(true);
      return {
        ...prev,
        customer: updatedCustomer,
      };
    });
  };

  const updatePaymentField = <K extends keyof PaymentDetails>(field: K, value: PaymentDetails[K]) => {
    setDoc((prev) => {
      const updatedPayment: PaymentDetails = {
        ...(prev.paymentDetails || DEFAULT_PAYMENT_DETAILS),
        [field]: value,
      };
      setIsDirty(true);
      return {
        ...prev,
        paymentDetails: updatedPayment,
      };
    });
  };

  // Line Item Handlers
  const handleItemChange = (index: number, field: keyof InvoiceLineItem, val: string | number) => {
    setDoc((prev) => {
      const newItems = [...prev.items];
      const item = { ...newItems[index], [field]: val };

      // Calculate line total
      const gross = (item.quantity || 0) * (item.unitPrice || 0);
      const disc = gross * ((item.discountPercent || 0) / 100);
      item.total = Math.round(Math.max(0, gross - disc));

      newItems[index] = item;
      const next = { ...prev, items: newItems };
      setIsDirty(true);
      return recalculate(next);
    });
  };

  const handleAddItem = () => {
    setDoc((prev) => {
      const newItem: InvoiceLineItem = {
        id: `item-${Date.now()}`,
        title: '',
        description: '',
        quantity: 1,
        unitPrice: 0,
        discountPercent: 0,
        total: 0,
      };
      const next = { ...prev, items: [...prev.items, newItem] };
      setIsDirty(true);
      return recalculate(next);
    });
  };

  const handleRemoveItem = (index: number) => {
    if (doc.items.length <= 1) {
      alert('Documents must have at least one line item.');
      return;
    }
    setDoc((prev) => {
      const newItems = prev.items.filter((_, i) => i !== index);
      const next = { ...prev, items: newItems };
      setIsDirty(true);
      return recalculate(next);
    });
  };

  const handleDuplicateItem = (index: number) => {
    setDoc((prev) => {
      const itemToClone = prev.items[index];
      const clonedItem: InvoiceLineItem = {
        ...itemToClone,
        id: `item-${Date.now()}`,
      };
      const newItems = [...prev.items];
      newItems.splice(index + 1, 0, clonedItem);
      const next = { ...prev, items: newItems };
      setIsDirty(true);
      return recalculate(next);
    });
  };

  // Switch Document Type
  const handleToggleDocType = (targetType: DocumentType) => {
    const currentType = doc.type || doc.documentType;
    if (currentType === targetType) return;
    setDoc((prev) => {
      let newNum = prev.documentNumber;
      if (targetType === 'invoice' && newNum.startsWith('QUO-')) {
        newNum = newNum.replace('QUO-', 'INV-');
      } else if (targetType === 'quotation' && newNum.startsWith('INV-')) {
        newNum = newNum.replace('INV-', 'QUO-');
      }

      const next: InvoiceDocument = {
        ...prev,
        documentType: targetType,
        type: targetType,
        documentNumber: newNum,
        status: targetType === 'invoice' ? 'unpaid' : 'draft',
      };
      setIsDirty(true);
      return next;
    });
  };

  // Recalculation logic
  const recalculate = (current: InvoiceDocument): InvoiceDocument => {
    const subtotal = current.items.reduce((acc, curr) => acc + (curr.total || 0), 0);

    let discountAmount = 0;
    if (current.discountType === 'percentage') {
      discountAmount = Math.round(subtotal * ((current.discountValue || 0) / 100));
    } else {
      discountAmount = Math.min(subtotal, current.discountValue || 0);
    }

    const netTaxable = Math.max(0, subtotal - discountAmount);
    const taxAmount = Math.round(netTaxable * ((current.taxRatePercent || 0) / 100));
    const totalAmount = netTaxable + taxAmount;

    return {
      ...current,
      subtotal,
      discountAmount,
      taxAmount,
      totalAmount,
      updatedAt: new Date().toISOString(),
    };
  };

  const business = doc.business || doc.company || DEFAULT_BUSINESS_DETAILS;
  const payment = doc.paymentDetails || DEFAULT_PAYMENT_DETAILS;
  const isInvoice = (doc.type || doc.documentType) === 'invoice';
  const total = doc.totalAmount || 0;
  const subtotal = doc.subtotal || 0;
  const discountAmount = doc.discountAmount || 0;
  const taxAmount = doc.taxAmount || 0;

  return (
    <div className="space-y-6">
      {/* Top Action Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12151b] shadow-xs">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            title="Return to documents list"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono font-bold text-sm sm:text-base text-neutral-900 dark:text-neutral-100">
                {doc.documentNumber}
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  isInvoice
                    ? 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400'
                    : 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                }`}
              >
                {doc.type || doc.documentType}
              </span>
              {isDirty && (
                <span className="text-[10px] text-amber-600 font-semibold flex items-center gap-1">
                  ● Unsaved Edits
                </span>
              )}
            </div>
            <div className="text-[11px] text-neutral-500">
              Client: {doc.customer.clientName || doc.customer.name || 'Not specified'} · Total: KES {total.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 self-start sm:self-auto flex-wrap gap-y-2">
          {onConvert && !isInvoice && (
            <button
              onClick={onConvert}
              className="px-3 py-1.5 rounded-lg text-xs font-bold border border-purple-300 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 transition-colors flex items-center space-x-1"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Convert to Invoice</span>
            </button>
          )}

          <button
            onClick={onDuplicate}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center space-x-1"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Duplicate</span>
          </button>

          <button
            onClick={onPreview}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center space-x-1"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live A4 Preview</span>
          </button>

          <button
            onClick={onPrint}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center space-x-1"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>

          <button
            onClick={() => {
              onSave(doc);
              setIsDirty(false);
            }}
            className="px-4 py-1.5 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white flex items-center space-x-1 shadow-xs transition-colors cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Save Document</span>
          </button>
        </div>
      </div>

      {/* Editor Form Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3): Primary Document Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Document Metadata & Type Switcher */}
          <div className="p-5 sm:p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12151b] space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <h3 className="text-sm font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
                  Document Identity &amp; Type
                </h3>
                <p className="text-[11px] text-neutral-500">Toggle between official invoice and proforma quotation</p>
              </div>

              {/* Segmented Switcher */}
              <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg text-xs font-medium self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => handleToggleDocType('invoice')}
                  className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                    isInvoice
                      ? 'bg-red-600 text-white font-bold shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                  }`}
                >
                  Commercial Invoice
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleDocType('quotation')}
                  className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                    !isInvoice
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                  }`}
                >
                  Proforma Quotation
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                  {isInvoice ? 'Invoice Number' : 'Quotation Number'}
                </label>
                <input
                  type="text"
                  value={doc.documentNumber}
                  onChange={(e) => updateDocumentField('documentNumber', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-mono font-bold text-neutral-900 dark:text-neutral-100"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Reference / PO Number
                </label>
                <input
                  type="text"
                  value={doc.referenceNumber || ''}
                  onChange={(e) => updateDocumentField('referenceNumber', e.target.value)}
                  placeholder="e.g. PO-8921"
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-mono text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Status
                </label>
                <select
                  value={doc.status}
                  onChange={(e) => updateDocumentField('status', e.target.value as DocumentStatus)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 uppercase font-bold text-xs"
                >
                  {isInvoice ? (
                    <>
                      <option value="draft">Draft</option>
                      <option value="unpaid">Unpaid</option>
                      <option value="paid">Paid</option>
                      <option value="overdue">Overdue</option>
                    </>
                  ) : (
                    <>
                      <option value="draft">Draft</option>
                      <option value="sent">Sent</option>
                      <option value="accepted">Accepted</option>
                      <option value="converted">Converted</option>
                      <option value="declined">Declined</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Issue Date
                </label>
                <input
                  type="date"
                  value={doc.issueDate}
                  onChange={(e) => updateDocumentField('issueDate', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                  {isInvoice ? 'Payment Due Date' : 'Valid Until Date'}
                </label>
                <input
                  type="date"
                  value={doc.dueDate}
                  onChange={(e) => updateDocumentField('dueDate', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Currency
                </label>
                <select
                  value={doc.currency}
                  onChange={(e) => updateDocumentField('currency', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-mono font-bold text-xs"
                >
                  <option value="KES">KES — Kenyan Shillings (Standard)</option>
                  <option value="USD">USD — US Dollars</option>
                  <option value="EUR">EUR — Euros</option>
                  <option value="GBP">GBP — British Pounds</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Products & Services Line Items Table */}
          <div className="p-5 sm:p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12151b] space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <h3 className="text-sm font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
                  Products &amp; Services Breakdown
                </h3>
                <p className="text-[11px] text-neutral-500">Add deliverables, unit pricing, discounts, and line totals</p>
              </div>

              <button
                type="button"
                onClick={handleAddItem}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white flex items-center space-x-1 cursor-pointer transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Item</span>
              </button>
            </div>

            {/* Line Items List */}
            <div className="space-y-3">
              {doc.items.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 space-y-2.5 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-neutral-400 w-4">
                          0{idx + 1}.
                        </span>
                        <input
                          type="text"
                          value={item.title || item.description || ''}
                          onChange={(e) => {
                            handleItemChange(idx, 'title', e.target.value);
                            handleItemChange(idx, 'description', e.target.value);
                          }}
                          placeholder="Item or service name (e.g. Brand Collateral Design)"
                          className="flex-1 px-3 py-1.5 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold"
                          required
                        />
                      </div>
                      <textarea
                        value={item.description || ''}
                        onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                        placeholder="Detailed deliverables description, specs, prepress scope..."
                        rows={2}
                        className="w-full px-3 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700/80 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-[11px]"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-1 shrink-0 pt-0.5">
                      <button
                        type="button"
                        onClick={() => handleDuplicateItem(idx)}
                        className="p-1.5 rounded text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
                        title="Duplicate row"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="p-1.5 rounded text-neutral-400 hover:text-red-600 transition-colors"
                        title="Remove row"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Calculations row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 border-t border-neutral-200/60 dark:border-neutral-800 text-xs">
                    <div>
                      <label className="text-[10px] text-neutral-500 font-medium block mb-0.5">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(idx, 'quantity', parseFloat(e.target.value) || 0)}
                        className="w-full px-2.5 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono text-right"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-neutral-500 font-medium block mb-0.5">Unit Price (KES)</label>
                      <input
                        type="number"
                        min="0"
                        step="100"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(idx, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="w-full px-2.5 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono text-right"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-neutral-500 font-medium block mb-0.5">Discount (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={item.discountPercent || 0}
                        onChange={(e) => handleItemChange(idx, 'discountPercent', parseFloat(e.target.value) || 0)}
                        className="w-full px-2.5 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono text-right"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-neutral-500 font-medium block mb-0.5">Line Total</label>
                      <div className="px-2.5 py-1.5 rounded bg-neutral-100 dark:bg-neutral-800 font-mono font-bold text-right text-neutral-900 dark:text-neutral-100 tabular-nums">
                        KES {(item.total || 0).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddItem}
              className="w-full py-2.5 rounded-lg border-2 border-dashed border-neutral-200 dark:border-neutral-800 hover:border-red-400 text-neutral-500 hover:text-red-600 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Another Deliverable Line Item</span>
            </button>
          </div>

          {/* Section 3: Notes & Terms */}
          <div className="p-5 sm:p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12151b] space-y-4 shadow-xs">
            <h3 className="text-sm font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
              Customer Notes &amp; Payment Terms
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Customer Notes (Appears on Document)
                </label>
                <textarea
                  value={doc.notes || ''}
                  onChange={(e) => updateDocumentField('notes', e.target.value)}
                  rows={4}
                  placeholder="e.g. Thank you for your partnership. All digital files are available in your shared folder."
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Terms &amp; Conditions
                </label>
                <textarea
                  value={doc.paymentTerms || ''}
                  onChange={(e) => updateDocumentField('paymentTerms', e.target.value)}
                  rows={4}
                  placeholder="e.g. Payment due within 14 days of invoice date. Official electronic tax receipt issued upon clearance."
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1/3): Totals, Tax, Customer & Bank Details */}
        <div className="space-y-6">
          {/* Summary & Automatic Totals Card */}
          <div className="p-5 sm:p-6 rounded-xl border-2 border-red-600/30 dark:border-red-900/50 bg-white dark:bg-[#12151b] space-y-4 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                Automatic Calculation
              </span>
              <span className="text-[10px] font-mono font-bold bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
                KES Currency
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>Items Subtotal:</span>
                <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
                  KES {subtotal.toLocaleString()}
                </span>
              </div>

              {/* Document Discount */}
              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-neutral-600 dark:text-neutral-400">Document Discount:</span>
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => updateDocumentField('discountType', 'percentage')}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                        doc.discountType === 'percentage'
                          ? 'bg-red-600 text-white font-bold'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600'
                      }`}
                    >
                      %
                    </button>
                    <button
                      type="button"
                      onClick={() => updateDocumentField('discountType', 'fixed')}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                        doc.discountType === 'fixed'
                          ? 'bg-red-600 text-white font-bold'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600'
                      }`}
                    >
                      KES
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    value={doc.discountValue || 0}
                    onChange={(e) => updateDocumentField('discountValue', parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono text-right"
                  />
                  <div className="text-[11px] font-mono text-neutral-500 whitespace-nowrap">
                    - KES {discountAmount.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Tax Rate (Kenya VAT) */}
              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-neutral-600 dark:text-neutral-400">KRA Value Added Tax (VAT):</span>
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => updateDocumentField('taxRatePercent', 16)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                        doc.taxRatePercent === 16
                          ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-bold'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600'
                      }`}
                    >
                      16%
                    </button>
                    <button
                      type="button"
                      onClick={() => updateDocumentField('taxRatePercent', 0)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                        doc.taxRatePercent === 0
                          ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-bold'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600'
                      }`}
                    >
                      0% (Exempt)
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={doc.taxRatePercent || 0}
                    onChange={(e) => updateDocumentField('taxRatePercent', parseFloat(e.target.value) || 0)}
                    className="w-20 px-2.5 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono text-right"
                  />
                  <span className="text-[11px] text-neutral-400">%</span>
                  <div className="flex-1 text-right text-[11px] font-mono font-semibold text-neutral-700 dark:text-neutral-300 tabular-nums">
                    + KES {taxAmount.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Grand Total */}
              <div className="pt-3 border-t-2 border-neutral-200 dark:border-neutral-800 flex items-baseline justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
                    Grand Total
                  </span>
                  <div className="text-[10px] text-neutral-400">Total payable in KES</div>
                </div>
                <div className="text-2xl font-bold font-mono text-red-600 dark:text-red-500 tabular-nums">
                  KES {total.toLocaleString()}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSave(doc)}
              className="w-full py-2.5 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white flex items-center justify-center space-x-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save &amp; Update Changes</span>
            </button>
          </div>

          {/* Customer Details Card */}
          <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12151b] space-y-3.5 shadow-xs text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-red-600" />
                <h4 className="font-bold text-neutral-900 dark:text-neutral-100">Customer / Client Details</h4>
              </div>
            </div>

            <div>
              <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                Client / Company Name
              </label>
              <input
                type="text"
                value={doc.customer.clientName || doc.customer.name || ''}
                onChange={(e) => updateCustomerField('clientName', e.target.value)}
                placeholder="e.g. Kifaru Media Group"
                className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-neutral-500 block mb-0.5">Contact Person</label>
                <input
                  type="text"
                  value={doc.customer.contactPerson || ''}
                  onChange={(e) => updateCustomerField('contactPerson', e.target.value)}
                  placeholder="e.g. Dennis Mutua"
                  className="w-full px-2.5 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                />
              </div>
              <div>
                <label className="text-[11px] text-neutral-500 block mb-0.5">Client KRA PIN</label>
                <input
                  type="text"
                  value={doc.customer.taxPin || doc.customer.taxId || ''}
                  onChange={(e) => {
                    updateCustomerField('taxPin', e.target.value);
                    updateCustomerField('taxId', e.target.value);
                  }}
                  placeholder="e.g. P051892341M"
                  className="w-full px-2.5 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-neutral-500 block mb-0.5">Email Address</label>
                <input
                  type="email"
                  value={doc.customer.email}
                  onChange={(e) => updateCustomerField('email', e.target.value)}
                  placeholder="billing@client.com"
                  className="w-full px-2.5 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                />
              </div>
              <div>
                <label className="text-[11px] text-neutral-500 block mb-0.5">Phone Number</label>
                <input
                  type="text"
                  value={doc.customer.phone}
                  onChange={(e) => updateCustomerField('phone', e.target.value)}
                  placeholder="+254 712 345 678"
                  className="w-full px-2.5 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-neutral-500 block mb-0.5">Physical / Billing Address</label>
              <textarea
                value={doc.customer.address}
                onChange={(e) => updateCustomerField('address', e.target.value)}
                rows={2}
                placeholder="Building, Street, City"
                className="w-full px-2.5 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
              />
            </div>
          </div>

          {/* Business & Payment Details Accordion */}
          <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12151b] space-y-3.5 shadow-xs text-xs">
            <div className="flex items-center space-x-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <Building className="w-4 h-4 text-red-600" />
              <h4 className="font-bold text-neutral-900 dark:text-neutral-100">Issuer Business &amp; KRA PIN</h4>
            </div>

            <div>
              <label className="text-[11px] text-neutral-500 block mb-0.5">Company Name</label>
              <input
                type="text"
                value={business.companyName || business.name || ''}
                onChange={(e) => {
                  updateBusinessField('companyName', e.target.value);
                  updateBusinessField('name', e.target.value);
                }}
                className="w-full px-2.5 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-neutral-500 block mb-0.5">KRA PIN Number</label>
                <input
                  type="text"
                  value={business.taxPin || business.taxId || ''}
                  onChange={(e) => {
                    updateBusinessField('taxPin', e.target.value);
                    updateBusinessField('taxId', e.target.value);
                  }}
                  className="w-full px-2.5 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] text-neutral-500 block mb-0.5">Business Phone</label>
                <input
                  type="text"
                  value={business.phone}
                  onChange={(e) => updateBusinessField('phone', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono"
                />
              </div>
            </div>

            {/* M-Pesa & Bank Pay details */}
            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
              <div className="flex items-center space-x-1.5 text-emerald-600 font-bold text-[11px]">
                <CreditCard className="w-3.5 h-3.5" />
                <span>Safaricom M-Pesa &amp; Bank Remittance</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-neutral-400 block">M-Pesa Till / Buy Goods</label>
                  <input
                    type="text"
                    value={payment.mpesaTill || ''}
                    onChange={(e) => updatePaymentField('mpesaTill', e.target.value)}
                    className="w-full px-2 py-1 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-neutral-400 block">M-Pesa Paybill</label>
                  <input
                    type="text"
                    value={payment.mpesaPaybill || ''}
                    onChange={(e) => updatePaymentField('mpesaPaybill', e.target.value)}
                    className="w-full px-2 py-1 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-neutral-400 block">Bank Name</label>
                  <input
                    type="text"
                    value={payment.bankName}
                    onChange={(e) => updatePaymentField('bankName', e.target.value)}
                    className="w-full px-2 py-1 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-[11px]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-neutral-400 block">Bank Account #</label>
                  <input
                    type="text"
                    value={payment.accountNumber}
                    onChange={(e) => updatePaymentField('accountNumber', e.target.value)}
                    className="w-full px-2 py-1 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: DocumentA4Preview (Printable & Downloadable A4 Sheet)
// ─────────────────────────────────────────────────────────────────────────────

interface DocumentA4PreviewProps {
  document: InvoiceDocument;
  onBack: () => void;
  onPrint: () => void;
  onEdit: () => void;
  onConvert?: () => void;
}

const DocumentA4Preview: React.FC<DocumentA4PreviewProps> = ({
  document: doc,
  onBack,
  onPrint,
  onEdit,
  onConvert,
}) => {
  const isInvoice = (doc.type || doc.documentType) === 'invoice';
  const business = doc.business || doc.company || DEFAULT_BUSINESS_DETAILS;
  const payment = doc.paymentDetails || DEFAULT_PAYMENT_DETAILS;
  const customer = doc.customer;
  const subtotal = doc.subtotal || 0;
  const discountAmount = doc.discountAmount || 0;
  const taxAmount = doc.taxAmount || 0;
  const totalAmount = doc.totalAmount || 0;

  return (
    <div className="space-y-6">
      {/* Top Floating Control Bar (Hidden when Printing) */}
      <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#12151b] shadow-xs">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            title="Back to editor"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono font-bold text-sm sm:text-base text-neutral-900 dark:text-neutral-100">
                A4 Document Preview — {doc.documentNumber}
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  isInvoice
                    ? 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400'
                    : 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                }`}
              >
                {doc.type || doc.documentType}
              </span>
            </div>
            <p className="text-[11px] text-neutral-500">
              Formatted for standard ISO 216 A4 paper (210mm × 297mm)
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          {onConvert && !isInvoice && doc.status !== 'converted' && (
            <button
              onClick={onConvert}
              className="px-3 py-1.5 rounded-lg text-xs font-bold border border-purple-300 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 transition-colors flex items-center space-x-1"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Convert to Invoice</span>
            </button>
          )}

          <button
            onClick={onEdit}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center space-x-1"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Document</span>
          </button>

          <button
            onClick={onPrint}
            className="px-4 py-1.5 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white flex items-center space-x-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Download / Print PDF</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          TRUE A4 PRINT CANVAS CONTAINER
          Dimensions: approx 800px on desktop screen, prints as standard A4 page
      ───────────────────────────────────────────────────────────── */}
      <div className="flex justify-center">
        <div
          id="printable-a4-document"
          className="w-full max-w-[820px] bg-white text-neutral-900 border border-neutral-200 shadow-2xl rounded-sm p-8 sm:p-12 space-y-8 font-sans print:border-none print:shadow-none print:p-0 print:m-0 print:max-w-none print:w-full"
          style={{ minHeight: '1050px' }}
        >
          {/* Header Row: Company Logo & Document Title */}
          <div className="flex items-start justify-between border-b-2 border-red-600 pb-6">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-3.5 h-3.5 rounded-xs bg-red-600"></span>
                <span className="text-xl font-bold font-['Poppins'] tracking-tight text-neutral-900">
                  {business.companyName || business.name}
                </span>
              </div>
              <div className="text-xs text-neutral-500 mt-1 space-y-0.5">
                <div>{business.address}</div>
                <div>{business.city}, {business.country}</div>
                <div>Email: {business.email} · Tel: {business.phone}</div>
                <div className="font-mono font-bold text-neutral-700">KRA PIN: {business.taxPin || business.taxId}</div>
              </div>
            </div>

            <div className="text-right">
              <h2 className="text-3xl font-extrabold uppercase tracking-tight text-neutral-900 font-['Poppins']">
                {isInvoice ? 'Tax Invoice' : 'Proforma Quotation'}
              </h2>
              <div className="font-mono font-bold text-red-600 text-sm mt-0.5">
                {doc.documentNumber}
              </div>
              {doc.referenceNumber && (
                <div className="text-xs text-neutral-500 font-mono mt-0.5">
                  Ref / PO: {doc.referenceNumber}
                </div>
              )}
              <div className="mt-2 inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider border border-neutral-300 text-neutral-700">
                Status: {doc.status}
              </div>
            </div>
          </div>

          {/* Dates & Client Information Row */}
          <div className="grid grid-cols-2 gap-8 text-xs">
            {/* Bill To */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                {isInvoice ? 'Billed To (Customer):' : 'Quotation Prepared For:'}
              </span>
              <div className="text-base font-bold text-neutral-900 font-['Poppins']">
                {customer.clientName || customer.name || 'Valued Client'}
              </div>
              {customer.contactPerson && (
                <div className="text-neutral-700 font-medium">Attn: {customer.contactPerson}</div>
              )}
              <div className="text-neutral-600 whitespace-pre-line">{customer.address}</div>
              {customer.city && <div className="text-neutral-600">{customer.city}, Kenya</div>}
              <div className="text-neutral-600">Email: {customer.email}</div>
              <div className="text-neutral-600">Tel: {customer.phone}</div>
              {(customer.taxPin || customer.taxId) && (
                <div className="font-mono text-neutral-700 pt-0.5">Customer PIN: {customer.taxPin || customer.taxId}</div>
              )}
            </div>

            {/* Document Dates */}
            <div className="space-y-2 text-right">
              <div className="inline-block text-left bg-neutral-50 p-4 rounded-lg border border-neutral-200 space-y-1.5 min-w-[220px]">
                <div className="flex justify-between text-neutral-500">
                  <span>Issue Date:</span>
                  <span className="font-mono font-bold text-neutral-900">{doc.issueDate}</span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>{isInvoice ? 'Payment Due:' : 'Valid Until:'}</span>
                  <span className="font-mono font-bold text-neutral-900">{doc.dueDate}</span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>Billing Currency:</span>
                  <span className="font-mono font-bold text-neutral-900">{doc.currency}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Table of Line Items */}
          <div className="overflow-hidden border border-neutral-300 rounded-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-100 text-neutral-700 uppercase font-bold text-[10px] tracking-wider border-b border-neutral-300">
                <tr>
                  <th className="py-2.5 px-3 w-8">#</th>
                  <th className="py-2.5 px-3">Description of Deliverables / Services</th>
                  <th className="py-2.5 px-3 text-center w-16">Qty</th>
                  <th className="py-2.5 px-3 text-right w-24">Rate (KES)</th>
                  <th className="py-2.5 px-3 text-right w-20">Disc</th>
                  <th className="py-2.5 px-3 text-right w-28">Amount (KES)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {doc.items.map((item, index) => (
                  <tr key={item.id || index} className="align-top">
                    <td className="py-3 px-3 font-mono text-neutral-400 text-[11px]">{index + 1}</td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-neutral-900">{item.title || item.description}</div>
                      {item.description && item.title && item.description !== item.title && (
                        <div className="text-[11px] text-neutral-600 mt-0.5 leading-relaxed">
                          {item.description}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center font-mono">{item.quantity}</td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums">
                      {item.unitPrice.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-neutral-500 text-[11px]">
                      {item.discountPercent ? `${item.discountPercent}%` : '—'}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-neutral-900 tabular-nums">
                      {(item.total || 0).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals & Tax Calculation Ledger Block */}
          <div className="flex flex-col sm:flex-row justify-between gap-6 pt-2">
            {/* Payment & Remittance Information */}
            <div className="flex-1 space-y-2 text-xs text-neutral-600">
              <div className="font-bold uppercase tracking-wider text-neutral-800 text-[10px]">
                Remittance &amp; Banking Details:
              </div>
              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 space-y-1 font-mono text-[11px]">
                <div>Bank: <strong>{payment.bankName}</strong></div>
                <div>Account Name: <strong>{payment.accountName}</strong></div>
                <div>Account Number: <strong>{payment.accountNumber}</strong></div>
                {payment.branchName && <div>Branch: {payment.branchName}</div>}
                {payment.mpesaTill && (
                  <div className="text-emerald-700 pt-1 border-t border-neutral-200 font-bold">
                    Safaricom M-Pesa Buy Goods / Till: {payment.mpesaTill}
                  </div>
                )}
                {payment.mpesaPaybill && (
                  <div className="text-emerald-700 font-bold">
                    M-Pesa Paybill: {payment.mpesaPaybill} (A/C: {payment.accountNumber})
                  </div>
                )}
              </div>
            </div>

            {/* Subtotal, Tax, and Grand Total */}
            <div className="w-full sm:w-72 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-neutral-200 text-neutral-600">
                <span>Subtotal:</span>
                <span className="font-mono font-bold text-neutral-900 tabular-nums">
                  KES {subtotal.toLocaleString()}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between py-1 border-b border-neutral-200 text-emerald-700">
                  <span>Discount ({doc.discountType === 'percentage' ? `${doc.discountValue}%` : 'Fixed'}):</span>
                  <span className="font-mono font-bold tabular-nums">
                    - KES {discountAmount.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex justify-between py-1 border-b border-neutral-200 text-neutral-600">
                <span>Kenya VAT ({doc.taxRatePercent || 0}%):</span>
                <span className="font-mono font-bold text-neutral-900 tabular-nums">
                  KES {taxAmount.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between py-2.5 border-b-2 border-neutral-900 text-sm font-bold text-neutral-900 font-['Poppins']">
                <span>Total Amount Due:</span>
                <span className="font-mono text-red-600 tabular-nums text-base">
                  KES {totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Notes and Payment Terms */}
          {(doc.notes || doc.paymentTerms) && (
            <div className="pt-4 border-t border-neutral-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {doc.notes && (
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                    Customer Notes:
                  </span>
                  <p className="text-neutral-600 leading-relaxed">{doc.notes}</p>
                </div>
              )}
              {doc.paymentTerms && (
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                    Terms &amp; Conditions:
                  </span>
                  <p className="text-neutral-600 leading-relaxed">{doc.paymentTerms}</p>
                </div>
              )}
            </div>
          )}

          {/* Signature & Stamp Footer */}
          <div className="pt-10 flex justify-between items-end text-xs border-t border-neutral-200">
            <div className="space-y-1">
              <div className="text-[10px] text-neutral-400">Electronic verification document</div>
              <div className="font-mono text-[9px] text-neutral-400">
                Generated via Paperglow Business Applications · SHA: {doc.id.slice(-8)}
              </div>
            </div>

            <div className="text-center w-52 space-y-1">
              <div className="border-b border-neutral-400 pb-8"></div>
              <div className="font-bold text-neutral-900 text-xs">Authorized Signatory</div>
              <div className="text-[10px] text-neutral-500">{business.companyName || business.name}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
