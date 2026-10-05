import React, { useState, useMemo } from 'react';
import {
  SalesDocument,
  BMDocumentType,
  BMDocumentStatus,
  Customer,
  InventoryItem,
  BusinessSettings,
  BMDocumentLineItem,
} from '../../types/businessManager';
import {
  Plus,
  Search,
  Filter,
  Printer,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Receipt,
  FileSpreadsheet,
  X,
} from 'lucide-react';

interface SalesModuleProps {
  documents: SalesDocument[];
  customers: Customer[];
  inventory: InventoryItem[];
  settings: BusinessSettings;
  currencySymbol: string;
  onSaveDocument: (doc: SalesDocument) => void;
  onDeleteDocument: (id: string) => void;
  onPrintDocument: (doc: SalesDocument) => void;
}

export const SalesModule: React.FC<SalesModuleProps> = ({
  documents,
  customers,
  inventory,
  settings,
  currencySymbol,
  onSaveDocument,
  onDeleteDocument,
  onPrintDocument,
}) => {
  const [filterType, setFilterType] = useState<'all' | BMDocumentType>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | BMDocumentStatus>('all');
  const [search, setSearch] = useState('');

  // Editor Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<SalesDocument | null>(null);

  // Form Fields
  const [docType, setDocType] = useState<BMDocumentType>('invoice');
  const [docNumber, setDocNumber] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [issueDate, setIssueDate] = useState('2026-03-31');
  const [dueDate, setDueDate] = useState('2026-04-14');
  const [docStatus, setDocStatus] = useState<BMDocumentStatus>('unpaid');
  const [paymentTerms, setPaymentTerms] = useState(settings.defaultPaymentTerms);
  const [notes, setNotes] = useState('');
  const [lineItems, setLineItems] = useState<BMDocumentLineItem[]>([
    {
      id: 'item-1',
      description: '',
      quantity: 1,
      unitPrice: 0,
      discountPercent: 0,
      taxRatePercent: 16,
      total: 0,
    },
  ]);

  // Open Create Modal
  const handleOpenCreate = (type: BMDocumentType) => {
    const prefix = type === 'receipt' ? settings.receiptPrefix : type === 'quotation' ? settings.quotationPrefix : settings.invoicePrefix;
    const randomSeq = Math.floor(100 + Math.random() * 900);
    const newDocNum = `${prefix}${randomSeq}`;

    setEditingDoc(null);
    setDocType(type);
    setDocNumber(newDocNum);
    setSelectedCustomerId(customers[0]?.id || '');
    setIssueDate('2026-03-31');
    setDueDate('2026-04-14');
    setDocStatus(type === 'receipt' ? 'paid' : 'unpaid');
    setPaymentTerms(settings.defaultPaymentTerms);
    setNotes('');
    setLineItems([
      {
        id: `item-${Date.now()}`,
        productId: inventory[0]?.id,
        description: inventory[0]?.name || 'Standard Commercial Service',
        quantity: 1,
        unitPrice: inventory[0]?.sellingPrice || 1000,
        discountPercent: 0,
        taxRatePercent: 16,
        total: inventory[0]?.sellingPrice || 1000,
      },
    ]);
    setIsEditorOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (doc: SalesDocument) => {
    setEditingDoc(doc);
    setDocType(doc.documentType);
    setDocNumber(doc.documentNumber);
    setSelectedCustomerId(doc.customerId);
    setIssueDate(doc.issueDate);
    setDueDate(doc.dueDate);
    setDocStatus(doc.status);
    setPaymentTerms(doc.paymentTerms);
    setNotes(doc.notes);
    setLineItems(doc.items);
    setIsEditorOpen(true);
  };

  // Calculate totals
  const subtotal = lineItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const discountAmount = lineItems.reduce(
    (sum, item) => sum + (item.quantity * item.unitPrice * (item.discountPercent / 100)),
    0
  );
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = settings.enableVat ? taxableAmount * (settings.vatRatePercent / 100) : 0;
  const grandTotal = taxableAmount + taxAmount;

  const handleLineItemChange = (index: number, field: keyof BMDocumentLineItem, value: string | number) => {
    setLineItems((prev) => {
      const updated = [...prev];
      const item = { ...updated[index], [field]: value };

      if (field === 'productId') {
        const prod = inventory.find((p) => p.id === value);
        if (prod) {
          item.description = prod.name;
          item.unitPrice = prod.sellingPrice;
        }
      }

      const lineGross = Number(item.quantity || 0) * Number(item.unitPrice || 0);
      const lineDisc = lineGross * (Number(item.discountPercent || 0) / 100);
      item.total = lineGross - lineDisc;

      updated[index] = item;
      return updated;
    });
  };

  const handleAddLineItem = () => {
    setLineItems((prev) => [
      ...prev,
      {
        id: `item-${Date.now()}-${Math.random()}`,
        description: '',
        quantity: 1,
        unitPrice: 0,
        discountPercent: 0,
        taxRatePercent: 16,
        total: 0,
      },
    ]);
  };

  const handleRemoveLineItem = (index: number) => {
    if (lineItems.length === 1) return;
    setLineItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find((c) => c.id === selectedCustomerId) || customers[0];

    const savedDoc: SalesDocument = {
      id: editingDoc?.id || `doc-${Date.now()}`,
      documentNumber: docNumber,
      documentType: docType,
      customerId: cust.id,
      customerName: cust.name,
      customerEmail: cust.email,
      customerPhone: cust.phone,
      customerAddress: cust.address,
      customerKraPin: cust.kraPin,
      issueDate,
      dueDate,
      items: lineItems,
      subtotal,
      taxRate: settings.vatRatePercent,
      taxAmount,
      discountAmount,
      grandTotal,
      amountPaid: docStatus === 'paid' ? grandTotal : (editingDoc?.amountPaid || 0),
      notes,
      paymentTerms,
      status: docStatus,
      paidAt: docStatus === 'paid' ? '2026-03-31' : undefined,
    };

    onSaveDocument(savedDoc);
    setIsEditorOpen(false);
  };

  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      const matchesType = filterType === 'all' || doc.documentType === filterType;
      const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
      const matchesSearch =
        doc.documentNumber.toLowerCase().includes(search.toLowerCase()) ||
        doc.customerName.toLowerCase().includes(search.toLowerCase()) ||
        doc.items.some((i) => i.description.toLowerCase().includes(search.toLowerCase()));

      return matchesType && matchesStatus && matchesSearch;
    });
  }, [documents, filterType, statusFilter, search]);

  return (
    <div className="space-y-6">
      {/* Top Controls: Filter tabs & Action buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Document Type Filter */}
        <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-md">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-sm transition-colors ${
              filterType === 'all'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            All Documents ({documents.length})
          </button>
          <button
            onClick={() => setFilterType('invoice')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-sm transition-colors ${
              filterType === 'invoice'
                ? 'bg-white dark:bg-neutral-900 text-red-600 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Invoices ({documents.filter((d) => d.documentType === 'invoice').length})
          </button>
          <button
            onClick={() => setFilterType('quotation')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-sm transition-colors ${
              filterType === 'quotation'
                ? 'bg-white dark:bg-neutral-900 text-amber-600 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Quotations ({documents.filter((d) => d.documentType === 'quotation').length})
          </button>
          <button
            onClick={() => setFilterType('receipt')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-sm transition-colors ${
              filterType === 'receipt'
                ? 'bg-white dark:bg-neutral-900 text-emerald-600 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Receipts ({documents.filter((d) => d.documentType === 'receipt').length})
          </button>
        </div>

        {/* Create Document Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenCreate('invoice')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Invoice</span>
          </button>
          <button
            onClick={() => handleOpenCreate('quotation')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Quotation</span>
          </button>
          <button
            onClick={() => handleOpenCreate('receipt')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Receipt</span>
          </button>
        </div>
      </div>

      {/* Search & Status Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by document #, customer name, or item description..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-hidden focus:ring-1 focus:ring-red-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as BMDocumentStatus | 'all')}
          className="px-3 py-2 text-xs rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 focus:outline-hidden focus:ring-1 focus:ring-red-500"
        >
          <option value="all">All Payment Statuses</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
          <option value="overdue">Overdue</option>
          <option value="sent">Sent</option>
          <option value="accepted">Accepted</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Documents Table */}
      <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Doc #</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Issue Date</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-right">Grand Total ({currencySymbol})</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-neutral-500">
                    No documents matching current search or filters.
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => {
                  const statusColors: Record<BMDocumentStatus, string> = {
                    paid: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800',
                    unpaid: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800',
                    overdue: 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-400 border border-red-200 dark:border-red-800',
                    sent: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-800',
                    accepted: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800',
                    draft: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
                    cancelled: 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400',
                  };

                  return (
                    <tr
                      key={doc.id}
                      className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-neutral-900 dark:text-neutral-100">
                        {doc.documentNumber}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold uppercase text-[10px] text-neutral-500">
                          {doc.documentType}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                          {doc.customerName}
                        </div>
                        <div className="text-[11px] text-neutral-400">{doc.customerPhone}</div>
                      </td>
                      <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400 font-mono">
                        {doc.issueDate}
                      </td>
                      <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400 font-mono">
                        {doc.dueDate}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-neutral-900 dark:text-neutral-100 tabular-nums">
                        {doc.grandTotal.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase rounded-sm ${
                            statusColors[doc.status]
                          }`}
                        >
                          {doc.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onPrintDocument(doc)}
                            title="Print / PDF Preview"
                            className="p-1.5 text-neutral-600 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-400 rounded-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(doc)}
                            title="Edit Document"
                            className="p-1.5 text-neutral-600 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteDocument(doc.id)}
                            title="Delete Document"
                            className="p-1.5 text-neutral-400 hover:text-red-600 dark:hover:text-red-400 rounded-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
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

      {/* Editor Modal for Invoices, Quotations, and Receipts */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-neutral-900 rounded-lg max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-neutral-200 dark:border-neutral-800">
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                  {editingDoc ? 'Edit' : 'Create'}{' '}
                  {docType === 'invoice' ? 'Commercial Invoice' : docType === 'quotation' ? 'Quotation' : 'Official Receipt'}
                </h3>
                <p className="text-xs text-neutral-500">Calculate line items with Kenyan VAT (16%)</p>
              </div>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              {/* Document Meta Row */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Document Type
                  </label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value as BMDocumentType)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                  >
                    <option value="invoice">Invoice</option>
                    <option value="quotation">Quotation</option>
                    <option value="receipt">Receipt</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Document Number
                  </label>
                  <input
                    type="text"
                    required
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    className="w-full px-2.5 py-1.5 font-mono rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    required
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                  />
                </div>
              </div>

              {/* Customer & Status Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Select Customer
                  </label>
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.company}) · {c.phone}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Status
                  </label>
                  <select
                    value={docStatus}
                    onChange={(e) => setDocStatus(e.target.value as BMDocumentStatus)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                  >
                    <option value="draft">Draft</option>
                    <option value="unpaid">Unpaid</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                    <option value="sent">Sent</option>
                    <option value="accepted">Accepted</option>
                  </select>
                </div>
              </div>

              {/* Line Items Builder */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                    Products &amp; Line Items
                  </label>
                  <button
                    type="button"
                    onClick={handleAddLineItem}
                    className="text-xs text-red-600 hover:text-red-700 font-semibold inline-flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Line Item
                  </button>
                </div>

                <div className="space-y-2 border border-neutral-200 dark:border-neutral-800 rounded-md p-3 bg-neutral-50 dark:bg-neutral-800/40">
                  {lineItems.map((item, idx) => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-5">
                        <input
                          type="text"
                          placeholder="Item description..."
                          required
                          value={item.description}
                          onChange={(e) => handleLineItemChange(idx, 'description', e.target.value)}
                          className="w-full px-2 py-1 rounded-sm border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 text-xs"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          placeholder="Qty"
                          min="1"
                          required
                          value={item.quantity}
                          onChange={(e) => handleLineItemChange(idx, 'quantity', parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1 rounded-sm border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 text-xs text-right font-mono"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          placeholder="Price"
                          min="0"
                          required
                          value={item.unitPrice}
                          onChange={(e) => handleLineItemChange(idx, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1 rounded-sm border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 text-xs text-right font-mono"
                        />
                      </div>
                      <div className="col-span-2 text-right font-mono font-bold text-neutral-900 dark:text-neutral-100">
                        {currencySymbol} {item.total.toLocaleString()}
                      </div>
                      <div className="col-span-1 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveLineItem(idx)}
                          className="text-neutral-400 hover:text-red-600 p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals Summary */}
              <div className="p-3 rounded-md bg-neutral-100 dark:bg-neutral-800 text-xs space-y-1.5">
                <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                  <span>Subtotal:</span>
                  <span className="font-mono font-semibold text-neutral-900 dark:text-neutral-100">
                    {currencySymbol} {subtotal.toLocaleString()}
                  </span>
                </div>
                {settings.enableVat && (
                  <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                    <span>KRA 16% VAT:</span>
                    <span className="font-mono font-semibold text-neutral-900 dark:text-neutral-100">
                      {currencySymbol} {Math.round(taxAmount).toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold border-t border-neutral-200 dark:border-neutral-700 pt-1 text-neutral-900 dark:text-neutral-100">
                  <span>Grand Total:</span>
                  <span className="font-mono text-red-600">
                    {currencySymbol} {grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Notes & Terms */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Customer Notes
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Delivery instructions or extra note..."
                    className="w-full px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Payment Terms
                  </label>
                  <textarea
                    rows={2}
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-md font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-semibold text-xs shadow-xs"
                >
                  Save Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
