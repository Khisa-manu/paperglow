import React from 'react';
import {
  X,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  CreditCard,
  FileText,
  Printer,
  Sparkles,
} from 'lucide-react';
import {
  BookingAppointment,
  BookingStatus,
} from '../../types/booking';

interface BookingDetailModalProps {
  appointment: BookingAppointment | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: BookingStatus) => void;
  onOpenRecordPayment: (appointment: BookingAppointment) => void;
}

export const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
  appointment,
  onClose,
  onUpdateStatus,
  onOpenRecordPayment,
}) => {
  if (!appointment) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#14171d] border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 max-w-lg w-full space-y-5 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-red-600"></span>
            <span className="text-base font-bold text-neutral-900 dark:text-white font-['Poppins']">
              Appointment Dossier
            </span>
            <span className="text-xs font-mono font-bold text-red-600">({appointment.id})</span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Client & Service Info */}
        <div className="space-y-3 text-xs">
          <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Client:</span>
              <span className="font-bold text-sm text-neutral-900 dark:text-white">
                {appointment.customerName}
              </span>
            </div>
            <div className="flex items-center justify-between text-neutral-500">
              <span>Contact:</span>
              <span>{appointment.customerPhone} · {appointment.customerEmail}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Reserved Service:</span>
              <span className="font-bold text-neutral-900 dark:text-white">
                {appointment.serviceName}
              </span>
            </div>
            <div className="flex items-center justify-between text-neutral-500">
              <span>Assigned Specialist:</span>
              <span className="font-medium text-neutral-800 dark:text-neutral-200">{appointment.staffName}</span>
            </div>
            <div className="flex items-center justify-between text-neutral-500">
              <span>Scheduled Slot:</span>
              <span className="font-mono font-bold text-neutral-900 dark:text-white">
                {appointment.date} ({appointment.startTime} – {appointment.endTime}) · {appointment.serviceDuration} mins
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Total Price:</span>
              <span className="font-mono font-bold text-sm text-neutral-900 dark:text-white">
                KES {appointment.priceKes.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Payment Status:</span>
              <span className="font-bold uppercase text-[10px] text-emerald-600">
                {appointment.paymentStatus.replace('_', ' ')} (KES {appointment.depositAmountKes} paid)
              </span>
            </div>
            {appointment.notes && (
              <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 text-neutral-500">
                <span>Notes: </span>
                <span className="italic text-neutral-700 dark:text-neutral-300">{appointment.notes}</span>
              </div>
            )}
          </div>
        </div>

        {/* Status Actions */}
        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => {
                onUpdateStatus(appointment.id, 'confirmed');
                onClose();
              }}
              className="px-2.5 py-1 text-xs font-semibold rounded bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 hover:bg-blue-100 cursor-pointer"
            >
              Confirm
            </button>
            <button
              onClick={() => {
                onUpdateStatus(appointment.id, 'completed');
                onClose();
              }}
              className="px-2.5 py-1 text-xs font-semibold rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 hover:bg-emerald-100 cursor-pointer"
            >
              Completed
            </button>
            <button
              onClick={() => {
                onUpdateStatus(appointment.id, 'cancelled');
                onClose();
              }}
              className="px-2.5 py-1 text-xs font-semibold rounded bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 hover:bg-neutral-200 cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                onClose();
                onOpenRecordPayment(appointment);
              }}
              className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Collect KES</span>
            </button>
            <button
              onClick={handlePrint}
              className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 border border-neutral-200 dark:border-neutral-700 rounded-lg cursor-pointer"
              title="Print voucher slip"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
