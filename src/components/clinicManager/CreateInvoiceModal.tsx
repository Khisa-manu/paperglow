import React, { useState } from 'react';
import {
  Invoice,
  Patient,
  MedicalService,
  InvoiceItem,
  PaymentMethod,
} from '../../types/clinicManager';
import { Receipt, Plus, Trash2, X } from 'lucide-react';

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  patients: Patient[];
  services: MedicalService[];
  initialPatientId?: string;
  onCreateInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber'>) => void;
}

export const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({
  isOpen,
  onClose,
  patients,
  services,
  initialPatientId,
  onCreateInvoice,
}) => {
  const [patientId, setPatientId] = useState(initialPatientId || patients[0]?.id || '');
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: 'itm-init-1',
      description: 'General Doctor Consultation',
      category: 'Consultation',
      quantity: 1,
      unitPriceKes: 2500,
      amountKes: 2500,
    },
  ]);

  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('M-Pesa');
  const [amountPaidNow, setAmountPaidNow] = useState(2500);
  const [discountKes, setDiscountKes] = useState(0);

  if (!isOpen) return null;

  const subtotalKes = items.reduce((s, itm) => s + itm.amountKes, 0);
  const totalAmountKes = Math.max(0, subtotalKes - discountKes);
  const balanceKes = Math.max(0, totalAmountKes - amountPaidNow);

  const handleAddServiceItem = () => {
    const srv = services.find((s) => s.id === selectedServiceId);
    if (!srv) return;

    setItems((prev) => [
      ...prev,
      {
        id: 'itm-' + Date.now(),
        description: srv.name,
        category: srv.category,
        quantity: 1,
        unitPriceKes: srv.priceKes,
        amountKes: srv.priceKes,
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selPatient = patients.find((p) => p.id === patientId) || patients[0];

    onCreateInvoice({
      patientId: selPatient.id,
      patientName: selPatient.fullName,
      patientNumber: selPatient.patientNumber,
      patientPhone: selPatient.phone,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      items,
      subtotalKes,
      discountKes,
      totalAmountKes,
      amountPaidKes: amountPaidNow,
      balanceKes,
      status: balanceKes === 0 ? 'paid' : amountPaidNow > 0 ? 'partial' : 'pending',
      paymentMethod: amountPaidNow > 0 ? paymentMethod : undefined,
      paymentReference: amountPaidNow > 0 ? `MPESA-QA${Math.floor(100000 + Math.random() * 900000)}` : undefined,
      servedBy: 'Lucy Auma (Cashier)',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-[#11141a] rounded-2xl max-w-xl w-full border border-neutral-200 dark:border-neutral-800 p-6 space-y-4 shadow-xl text-xs my-8 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
          <div className="flex items-center space-x-2">
            <Receipt className="w-5 h-5 text-red-600" />
            <h3 className="text-base font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
              Create Outpatient Invoice &amp; Settle Bill
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
              Select Patient *
            </label>
            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-bold"
              required
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.patientNumber} — {p.fullName} ({p.paymentModePreference})
                </option>
              ))}
            </select>
          </div>

          {/* Add Services to Bill */}
          <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 space-y-2">
            <label className="block text-neutral-700 dark:text-neutral-300 font-bold">
              Add Medical Service / Test to Bill:
            </label>
            <div className="flex gap-2">
              <select
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
              >
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} — KES {s.priceKes.toLocaleString()}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAddServiceItem}
                className="px-3.5 py-1.5 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-bold"
              >
                Add Item
              </button>
            </div>
          </div>

          {/* Line items list */}
          <div className="space-y-1.5">
            <span className="font-bold text-neutral-900 dark:text-neutral-100 block">
              Billed Items ({items.length}):
            </span>
            {items.map((itm) => (
              <div
                key={itm.id}
                className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-between"
              >
                <div>
                  <span className="font-bold">{itm.description}</span>
                  <span className="block text-[10px] text-neutral-500">
                    Category: {itm.category} &middot; Qty: {itm.quantity}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold">KES {itm.amountKes.toLocaleString()}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(itm.id)}
                    className="text-neutral-400 hover:text-red-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing calculations */}
          <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-mono font-bold">KES {subtotalKes.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Discount / Waiver (KES):</span>
              <input
                type="number"
                value={discountKes}
                onChange={(e) => setDiscountKes(parseInt(e.target.value) || 0)}
                className="w-24 px-2 py-1 rounded border border-neutral-300 dark:border-neutral-700 font-mono text-right"
              />
            </div>
            <div className="flex justify-between font-bold text-sm border-t pt-1">
              <span>Total Bill (KES):</span>
              <span className="font-mono text-red-600">KES {totalAmountKes.toLocaleString()}</span>
            </div>
          </div>

          {/* Payment execution */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                Payment Channel
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
              >
                <option value="M-Pesa">M-Pesa</option>
                <option value="Cash">Cash</option>
                <option value="Credit Card">Credit Card</option>
                <option value="SHA / NHIF">SHA / Social Health Authority</option>
                <option value="Private Insurance">Private Insurance</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                Amount Paying Now (KES)
              </label>
              <input
                type="number"
                value={amountPaidNow}
                onChange={(e) => setAmountPaidNow(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-mono font-bold"
              />
            </div>
          </div>

          <div className="flex justify-between text-xs font-semibold px-1">
            <span>Remaining Balance:</span>
            <span className={balanceKes > 0 ? 'text-amber-600' : 'text-emerald-600'}>
              KES {balanceKes.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold cursor-pointer"
          >
            Generate &amp; Print Invoice
          </button>
        </div>
      </form>
    </div>
  );
};
