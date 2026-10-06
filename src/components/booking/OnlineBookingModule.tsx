import React, { useState } from 'react';
import {
  Globe,
  Sparkles,
  User,
  Calendar,
  Clock,
  CheckCircle2,
  Phone,
  Mail,
  Copy,
  Check,
  CreditCard,
  ArrowRight,
  ArrowLeft,
  Share2,
} from 'lucide-react';
import {
  ServiceItem,
  StaffMember,
  BookingAppointment,
  BookingBusinessSettings,
} from '../../types/booking';

interface OnlineBookingModuleProps {
  services: ServiceItem[];
  staff: StaffMember[];
  settings: BookingBusinessSettings;
  onCompleteBooking: (newBooking: BookingAppointment) => void;
}

export const OnlineBookingModule: React.FC<OnlineBookingModuleProps> = ({
  services,
  staff,
  settings,
  onCompleteBooking,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [copiedLink, setCopiedLink] = useState(false);

  // Flow State
  const [selectedServiceId, setSelectedServiceId] = useState<string>(services[0]?.id || '');
  const [selectedStaffId, setSelectedStaffId] = useState<string>('any');
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('11:00');

  // Customer Contact Fields
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custNotes, setCustNotes] = useState('');

  // Confirmed booking state
  const [confirmedBooking, setConfirmedBooking] = useState<BookingAppointment | null>(null);

  const selectedService = services.find((s) => s.id === selectedServiceId) || services[0];
  const eligibleStaff = staff.filter(
    (st) => selectedStaffId === 'any' || st.id === selectedStaffId
  );
  const resolvedStaff =
    selectedStaffId === 'any'
      ? staff.find((st) => st.providedServiceIds.includes(selectedService.id)) || staff[0]
      : staff.find((st) => st.id === selectedStaffId) || staff[0];

  const availableSlots = [
    '09:00', '09:45', '10:30', '11:15', '12:00', '13:00',
    '14:00', '14:45', '15:30', '16:15', '17:00', '17:45',
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://paperglow.co.ke/book/${settings.businessName.toLowerCase().replace(/\s+/g, '-')}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleFinalizeBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName.trim() || !custPhone.trim()) return;

    // Calculate end time
    const [hh, mm] = selectedTimeSlot.split(':').map(Number);
    const endMinutesTotal = hh * 60 + mm + selectedService.durationMinutes;
    const endH = Math.floor(endMinutesTotal / 60)
      .toString()
      .padStart(2, '0');
    const endM = (endMinutesTotal % 60).toString().padStart(2, '0');
    const endTime = `${endH}:${endM}`;

    const newId = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    const depositKes = Math.round((selectedService.priceKes * settings.depositPercentage) / 100);

    const bookingRecord: BookingAppointment = {
      id: newId,
      customerId: `cust_${Date.now()}`,
      customerName: custName,
      customerPhone: custPhone,
      customerEmail: custEmail || `${custName.toLowerCase().replace(/\s+/g, '.')}@client.paperglow.io`,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      serviceDuration: selectedService.durationMinutes,
      priceKes: selectedService.priceKes,
      depositAmountKes: depositKes,
      staffId: resolvedStaff.id,
      staffName: resolvedStaff.name,
      date: selectedDate,
      startTime: selectedTimeSlot,
      endTime,
      status: 'confirmed',
      paymentStatus: 'deposit_paid',
      notes: custNotes || 'Online booking portal reservation',
      source: 'Online Booking Page',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      reminderSent: true,
    };

    onCompleteBooking(bookingRecord);
    setConfirmedBooking(bookingRecord);
    setStep(5);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Public Link Simulator Controls */}
      <div className="p-4 sm:p-5 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-['Poppins']">
              Client Online Booking Portal (Live Simulator)
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              Customer View Active
            </span>
          </div>
          <p className="text-xs text-neutral-500">
            This interactive simulator reflects the exact customer experience on your branded booking page.
          </p>
        </div>

        {/* Public Share Link Tool */}
        <div className="flex items-center space-x-2 shrink-0">
          <div className="hidden sm:flex items-center px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xs font-mono text-neutral-600 dark:text-neutral-300">
            <span>paperglow.co.ke/book/studio</span>
          </div>
          <button
            onClick={handleCopyLink}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied!' : 'Copy Booking Link'}</span>
          </button>
        </div>
      </div>

      {/* Main Container: Customer-Facing Booking Page Mockup */}
      <div className="max-w-3xl mx-auto bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Customer Header Brand Card */}
        <div className="p-6 bg-gradient-to-r from-neutral-900 to-neutral-800 text-white relative">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-red-400">
                Official Booking Portal
              </span>
              <h3 className="text-xl font-bold font-['Poppins'] mt-0.5">
                {settings.businessName}
              </h3>
              <p className="text-xs text-neutral-300 mt-1">{settings.tagline}</p>
              <div className="text-[11px] text-neutral-400 mt-2">
                📍 {settings.address}, {settings.city} · 📞 {settings.phone}
              </div>
            </div>

            <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-lg shadow-md shrink-0">
              PG
            </div>
          </div>

          {/* Stepper Wizard Progress */}
          {step < 5 && (
            <div className="flex items-center space-x-2 mt-6 pt-4 border-t border-neutral-700/60 text-xs font-semibold">
              <span className={step === 1 ? 'text-red-400' : 'text-neutral-400'}>1. Service</span>
              <span className="text-neutral-600">→</span>
              <span className={step === 2 ? 'text-red-400' : 'text-neutral-400'}>2. Specialist</span>
              <span className="text-neutral-600">→</span>
              <span className={step === 3 ? 'text-red-400' : 'text-neutral-400'}>3. Date &amp; Time</span>
              <span className="text-neutral-600">→</span>
              <span className={step === 4 ? 'text-red-400' : 'text-neutral-400'}>4. Details</span>
            </div>
          )}
        </div>

        {/* STEP 1: Select Service */}
        {step === 1 && (
          <div className="p-6 space-y-4">
            <h4 className="text-sm font-bold text-neutral-900 dark:text-white font-['Poppins']">
              Step 1: Choose Your Desired Service
            </h4>

            <div className="space-y-3">
              {services.map((srv) => (
                <div
                  key={srv.id}
                  onClick={() => setSelectedServiceId(srv.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedServiceId === srv.id
                      ? 'border-red-600 bg-red-50/20 dark:bg-red-950/20 ring-1 ring-red-600'
                      : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300'
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-red-600">
                      {srv.categoryName}
                    </span>
                    <h5 className="text-sm font-bold text-neutral-900 dark:text-white mt-0.5">
                      {srv.name}
                    </h5>
                    <p className="text-xs text-neutral-500 mt-1 line-clamp-1">{srv.description}</p>
                    <div className="flex items-center space-x-2 text-[11px] text-neutral-400 mt-2">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{srv.durationMinutes} minutes session</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0 ml-4">
                    <div className="text-base font-bold font-mono text-neutral-900 dark:text-white">
                      KES {srv.priceKes.toLocaleString()}
                    </div>
                    <button
                      type="button"
                      className={`mt-2 px-3 py-1 text-xs font-semibold rounded-lg ${
                        selectedServiceId === srv.id
                          ? 'bg-red-600 text-white'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      {selectedServiceId === srv.id ? 'Selected' : 'Select'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="flex items-center space-x-2 px-5 py-2.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs cursor-pointer"
              >
                <span>Continue to Specialist</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Select Specialist */}
        {step === 2 && (
          <div className="p-6 space-y-4">
            <h4 className="text-sm font-bold text-neutral-900 dark:text-white font-['Poppins']">
              Step 2: Select a Specialist / Therapist
            </h4>

            <div className="space-y-3">
              {/* Option: Any Available Specialist */}
              <div
                onClick={() => setSelectedStaffId('any')}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  selectedStaffId === 'any'
                    ? 'border-red-600 bg-red-50/20 dark:bg-red-950/20 ring-1 ring-red-600'
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center font-bold text-neutral-700 dark:text-neutral-300">
                    <Sparkles className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-neutral-900 dark:text-white">
                      Any Available Specialist
                    </h5>
                    <p className="text-[11px] text-neutral-500">
                      We will assign the first available qualified professional.
                    </p>
                  </div>
                </div>

                <div className="text-xs font-semibold text-neutral-500">
                  {selectedStaffId === 'any' ? 'Selected' : 'Choose'}
                </div>
              </div>

              {/* Individual Staff Members qualified for this service */}
              {staff
                .filter((st) => st.providedServiceIds.includes(selectedService.id))
                .map((st) => (
                  <div
                    key={st.id}
                    onClick={() => setSelectedStaffId(st.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      selectedStaffId === st.id
                        ? 'border-red-600 bg-red-50/20 dark:bg-red-950/20 ring-1 ring-red-600'
                        : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={st.avatar}
                        alt={st.name}
                        className="w-10 h-10 rounded-full object-cover border border-neutral-200 dark:border-neutral-700"
                      />
                      <div>
                        <h5 className="text-xs font-bold text-neutral-900 dark:text-white">
                          {st.name}
                        </h5>
                        <p className="text-[11px] text-neutral-500">{st.title}</p>
                        <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1">
                          ★ {st.rating} rating · Available on duty
                        </div>
                      </div>
                    </div>

                    <div className="text-xs font-semibold text-neutral-500">
                      {selectedStaffId === st.id ? 'Selected' : 'Choose'}
                    </div>
                  </div>
                ))}
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className="flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex items-center space-x-2 px-5 py-2.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs cursor-pointer"
              >
                <span>Continue to Date &amp; Time</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Select Date & Time Slot */}
        {step === 3 && (
          <div className="p-6 space-y-5">
            <h4 className="text-sm font-bold text-neutral-900 dark:text-white font-['Poppins']">
              Step 3: Select Your Date &amp; Time Slot
            </h4>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Choose Preferred Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full sm:w-64 px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Available Time Slots ({selectedDate})
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`py-2 px-3 text-xs font-mono font-bold rounded-lg border transition-all cursor-pointer ${
                        selectedTimeSlot === slot
                          ? 'border-red-600 bg-red-600 text-white shadow-xs'
                          : 'border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={() => setStep(2)}
                className="flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setStep(4)}
                className="flex items-center space-x-2 px-5 py-2.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs cursor-pointer"
              >
                <span>Continue to Client Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Client Contact Details & Confirmation */}
        {step === 4 && (
          <form onSubmit={handleFinalizeBooking} className="p-6 space-y-4">
            <h4 className="text-sm font-bold text-neutral-900 dark:text-white font-['Poppins']">
              Step 4: Enter Client Details &amp; Confirm
            </h4>

            {/* Summary preview bar */}
            <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="font-bold text-neutral-900 dark:text-white">
                  {selectedService.name}
                </span>{' '}
                · <span>{selectedDate} at {selectedTimeSlot}</span>
              </div>
              <div className="font-mono font-bold text-red-600">
                Total: KES {selectedService.priceKes.toLocaleString()}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  placeholder="e.g. Grace Njeri"
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Phone Number (M-Pesa SMS Confirmation) *
                  </label>
                  <input
                    type="text"
                    required
                    value={custPhone}
                    onChange={(e) => setCustPhone(e.target.value)}
                    placeholder="+254 712 345 678"
                    className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={custEmail}
                    onChange={(e) => setCustEmail(e.target.value)}
                    placeholder="grace@example.com"
                    className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Special Requests or Preferences (Optional)
                </label>
                <textarea
                  rows={2}
                  value={custNotes}
                  onChange={(e) => setCustNotes(e.target.value)}
                  placeholder="Any skin allergies, styling notes, or arrival notes..."
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                />
              </div>

              {/* M-Pesa Deposit Notice */}
              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                <span>
                  Deposit Required ({settings.depositPercentage}%): <strong>KES {Math.round((selectedService.priceKes * settings.depositPercentage) / 100).toLocaleString()}</strong>
                </span>
                <span>Paybill: {settings.mpesaPaybill}</span>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                type="submit"
                className="flex items-center space-x-2 px-6 py-2.5 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm &amp; Place Reservation</span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 5: Instant Booking Confirmation Voucher */}
        {step === 5 && confirmedBooking && (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Reservation Confirmed
              </span>
              <h4 className="text-xl font-bold font-['Poppins'] text-neutral-900 dark:text-white mt-2">
                Thank You, {confirmedBooking.customerName}!
              </h4>
              <p className="text-xs text-neutral-500 mt-1 max-w-md mx-auto">
                Your appointment voucher has been recorded in the live registry. An automated SMS confirmation has been queued for {confirmedBooking.customerPhone}.
              </p>
            </div>

            {/* Official Confirmation Card */}
            <div className="max-w-md mx-auto p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-left text-xs space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
                <span className="text-neutral-500">Booking Reference:</span>
                <span className="font-mono font-bold text-red-600 text-sm">
                  {confirmedBooking.id}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Service:</span>
                <span className="font-bold text-neutral-900 dark:text-white">
                  {confirmedBooking.serviceName}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Specialist:</span>
                <span>{confirmedBooking.staffName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Date &amp; Time:</span>
                <span className="font-mono font-bold text-neutral-900 dark:text-white">
                  {confirmedBooking.date} ({confirmedBooking.startTime} – {confirmedBooking.endTime})
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Total Price:</span>
                <span className="font-mono font-bold text-neutral-900 dark:text-white">
                  KES {confirmedBooking.priceKes.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <span className="text-neutral-500">M-Pesa Deposit Settled:</span>
                <span className="font-mono font-bold text-emerald-600">
                  KES {confirmedBooking.depositAmountKes.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-center space-x-3">
              <button
                onClick={() => {
                  setStep(1);
                  setConfirmedBooking(null);
                }}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 cursor-pointer"
              >
                Book Another Appointment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
