import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  User,
  Sparkles,
  DollarSign,
  CheckCircle2,
} from 'lucide-react';
import {
  BookingAppointment,
  BookingCustomer,
  ServiceItem,
  StaffMember,
  BookingStatus,
  PaymentStatus,
} from '../../types/booking';

interface CreateBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: BookingCustomer[];
  services: ServiceItem[];
  staff: StaffMember[];
  initialDate?: string;
  initialTime?: string;
  initialStaffId?: string;
  onCreateBooking: (newBooking: BookingAppointment) => void;
}

export const CreateBookingModal: React.FC<CreateBookingModalProps> = ({
  isOpen,
  onClose,
  customers,
  services,
  staff,
  initialDate,
  initialTime,
  initialStaffId,
  onCreateBooking,
}) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || 'new');
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState<string>(services[0]?.id || '');
  const [selectedStaffId, setSelectedStaffId] = useState<string>(initialStaffId || staff[0]?.id || '');

  const [date, setDate] = useState<string>(initialDate || new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState<string>(initialTime || '10:00');
  const [status, setStatus] = useState<BookingStatus>('confirmed');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const selectedService = services.find((s) => s.id === selectedServiceId) || services[0];
  const selectedStaff = staff.find((s) => s.id === selectedStaffId) || staff[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let customerName = newCustName;
    let customerPhone = newCustPhone;
    let customerId = `cust_${Date.now()}`;
    let customerEmail = 'client@paperglow.io';

    if (selectedCustomerId !== 'new') {
      const existing = customers.find((c) => c.id === selectedCustomerId);
      if (existing) {
        customerName = existing.name;
        customerPhone = existing.phone;
        customerId = existing.id;
        customerEmail = existing.email;
      }
    }

    if (!customerName.trim()) return;

    // Calculate end time
    const [hh, mm] = startTime.split(':').map(Number);
    const endMinutes = hh * 60 + mm + selectedService.durationMinutes;
    const endH = Math.floor(endMinutes / 60)
      .toString()
      .padStart(2, '0');
    const endM = (endMinutes % 60).toString().padStart(2, '0');
    const endTime = `${endH}:${endM}`;

    const newId = `BK-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking: BookingAppointment = {
      id: newId,
      customerId,
      customerName,
      customerPhone,
      customerEmail,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      serviceDuration: selectedService.durationMinutes,
      priceKes: selectedService.priceKes,
      depositAmountKes: paymentStatus === 'paid' ? selectedService.priceKes : Math.round(selectedService.priceKes * 0.3),
      staffId: selectedStaff.id,
      staffName: selectedStaff.name,
      date,
      startTime,
      endTime,
      status,
      paymentStatus,
      notes,
      source: 'In-person / Walk-in',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      reminderSent: true,
    };

    onCreateBooking(newBooking);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#14171d] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 sm:p-6 max-w-lg w-full space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-red-600" />
            <h3 className="text-base font-bold text-neutral-900 dark:text-white font-['Poppins']">
              Schedule New Appointment
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Customer Dossier *
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
            >
              <option value="new">+ Enter New Client</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone})
                </option>
              ))}
            </select>

            {selectedCustomerId === 'new' && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <input
                  type="text"
                  required
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  placeholder="Client full name *"
                  className="px-3 py-1.5 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                />
                <input
                  type="text"
                  required
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  placeholder="+254 712 ... *"
                  className="px-3 py-1.5 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                />
              </div>
            )}
          </div>

          {/* Service & Specialist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Service *
              </label>
              <select
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
              >
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} (KES {s.priceKes})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Specialist / Staff *
              </label>
              <select
                value={selectedStaffId}
                onChange={(e) => setSelectedStaffId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
              >
                {staff.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} ({st.title})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Start Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Start Time *
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono"
              />
            </div>
          </div>

          {/* Status & Payment */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Appointment Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as BookingStatus)}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
              >
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Payment Status
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
              >
                <option value="pending">Pending Balance</option>
                <option value="deposit_paid">Deposit Paid</option>
                <option value="paid">Fully Settled</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Internal Reception Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Walk-in client, requested beverage upon arrival..."
              className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
            />
          </div>

          {/* Summary Footer */}
          <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-xs flex items-center justify-between border border-neutral-200 dark:border-neutral-800">
            <span className="text-neutral-500">Service Fee:</span>
            <span className="font-mono font-bold text-neutral-900 dark:text-white">
              KES {selectedService.priceKes.toLocaleString()} ({selectedService.durationMinutes} mins)
            </span>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs"
            >
              Create Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
