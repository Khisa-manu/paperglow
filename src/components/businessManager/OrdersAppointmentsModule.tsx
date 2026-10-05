import React, { useState, useMemo } from 'react';
import {
  BusinessOrder,
  OrderAppointmentType,
  OrderStatus,
  Customer,
  Employee,
} from '../../types/businessManager';
import {
  CalendarCheck2,
  Plus,
  Search,
  Filter,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Trash2,
  Edit,
  X,
} from 'lucide-react';

interface OrdersAppointmentsModuleProps {
  orders: BusinessOrder[];
  customers: Customer[];
  employees: Employee[];
  currencySymbol: string;
  onSaveOrder: (order: BusinessOrder) => void;
  onDeleteOrder: (id: string) => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}

export const OrdersAppointmentsModule: React.FC<OrdersAppointmentsModuleProps> = ({
  orders,
  customers,
  employees,
  currencySymbol,
  onSaveOrder,
  onDeleteOrder,
  onUpdateStatus,
}) => {
  const [filterType, setFilterType] = useState<'all' | OrderAppointmentType>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [search, setSearch] = useState('');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<BusinessOrder | null>(null);

  // Form fields
  const [orderType, setOrderType] = useState<OrderAppointmentType>('order');
  const [orderNumber, setOrderNumber] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [title, setTitle] = useState('');
  const [scheduledDate, setScheduledDate] = useState('2026-04-03');
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 11:30 AM');
  const [assignedEmployee, setAssignedEmployee] = useState('');
  const [totalAmount, setTotalAmount] = useState<number>(25000);
  const [depositPaid, setDepositPaid] = useState<number>(10000);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<OrderStatus>('pending');

  const handleOpenCreate = (type: OrderAppointmentType) => {
    setEditingOrder(null);
    setOrderType(type);
    setOrderNumber(`${type === 'appointment' ? 'APT-2026-' : 'ORD-2026-'}${Math.floor(100 + Math.random() * 900)}`);
    setCustomerId(customers[0]?.id || '');
    setTitle(type === 'appointment' ? 'Brand Strategy & Print Review Session' : 'Commercial Print & Embroidery Order');
    setScheduledDate('2026-04-03');
    setTimeSlot('10:00 AM - 11:30 AM');
    setAssignedEmployee(employees[0]?.fullName || 'David Mwangi');
    setTotalAmount(type === 'appointment' ? 15000 : 35000);
    setDepositPaid(type === 'appointment' ? 15000 : 15000);
    setNotes('');
    setStatus('pending');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (order: BusinessOrder) => {
    setEditingOrder(order);
    setOrderType(order.type);
    setOrderNumber(order.orderNumber);
    setCustomerId(order.customerId);
    setTitle(order.title);
    setScheduledDate(order.scheduledDate);
    setTimeSlot(order.timeSlot || '');
    setAssignedEmployee(order.assignedEmployee);
    setTotalAmount(order.totalAmount);
    setDepositPaid(order.depositPaid);
    setNotes(order.notes || '');
    setStatus(order.status);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find((c) => c.id === customerId) || customers[0];

    const saved: BusinessOrder = {
      id: editingOrder?.id || `ord-${Date.now()}`,
      orderNumber,
      type: orderType,
      customerId: cust.id,
      customerName: cust.name,
      customerPhone: cust.phone,
      customerEmail: cust.email,
      title,
      status,
      scheduledDate,
      timeSlot: orderType === 'appointment' ? timeSlot : undefined,
      assignedEmployee,
      totalAmount: Number(totalAmount),
      depositPaid: Number(depositPaid),
      notes,
      createdAt: editingOrder?.createdAt || '2026-03-31',
    };

    onSaveOrder(saved);
    setIsModalOpen(false);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesType = filterType === 'all' || o.type === filterType;
      const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
      const q = search.toLowerCase();
      const matchesSearch =
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.title.toLowerCase().includes(q);

      return matchesType && matchesStatus && matchesSearch;
    });
  }, [orders, filterType, statusFilter, search]);

  return (
    <div className="space-y-6">
      {/* Top Filter & Create Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-md text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 font-semibold rounded-sm transition-colors ${
              filterType === 'all'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            All Bookings ({orders.length})
          </button>
          <button
            onClick={() => setFilterType('order')}
            className={`px-3 py-1.5 font-semibold rounded-sm transition-colors ${
              filterType === 'order'
                ? 'bg-white dark:bg-neutral-900 text-blue-600 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Client Orders ({orders.filter((o) => o.type === 'order').length})
          </button>
          <button
            onClick={() => setFilterType('appointment')}
            className={`px-3 py-1.5 font-semibold rounded-sm transition-colors ${
              filterType === 'appointment'
                ? 'bg-white dark:bg-neutral-900 text-purple-600 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Appointments ({orders.filter((o) => o.type === 'appointment').length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenCreate('order')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ New Order</span>
          </button>
          <button
            onClick={() => handleOpenCreate('appointment')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Book Appointment</span>
          </button>
        </div>
      </div>

      {/* Search and Status filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order #, customer, or title..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-3 py-2 text-xs rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders List Table */}
      <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Ref #</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Customer &amp; Description</th>
                <th className="py-3 px-4">Schedule / Date</th>
                <th className="py-3 px-4">Assigned Staff</th>
                <th className="py-3 px-4 text-right">Value ({currencySymbol})</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filteredOrders.map((o) => {
                const statusStyles: Record<OrderStatus, string> = {
                  pending: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800',
                  in_progress: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-800',
                  completed: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800',
                  cancelled: 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400',
                };

                return (
                  <tr key={o.id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40">
                    <td className="py-3 px-4 font-mono font-bold text-neutral-900 dark:text-neutral-100">
                      {o.orderNumber}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold uppercase text-[10px] text-neutral-500">
                        {o.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                        {o.title}
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        {o.customerName} · {o.customerPhone}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-neutral-600 dark:text-neutral-400">
                      <div>{o.scheduledDate}</div>
                      {o.timeSlot && <div className="text-[10px] text-neutral-500">{o.timeSlot}</div>}
                    </td>
                    <td className="py-3 px-4 text-neutral-700 dark:text-neutral-300">
                      {o.assignedEmployee}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums">
                      <div className="font-bold text-neutral-900 dark:text-neutral-100">
                        {o.totalAmount.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-neutral-400">
                        Dep: {o.depositPaid.toLocaleString()}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase rounded-sm ${
                          statusStyles[o.status]
                        }`}
                      >
                        {o.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {o.status !== 'completed' && (
                          <button
                            onClick={() => onUpdateStatus(o.id, 'completed')}
                            className="px-2 py-0.5 rounded-sm bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[10px] font-semibold"
                            title="Mark as Completed"
                          >
                            Complete
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenEdit(o)}
                          className="p-1 text-neutral-500 hover:text-blue-600"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteOrder(o.id)}
                          className="p-1 text-neutral-400 hover:text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 rounded-lg max-w-lg w-full p-5 shadow-2xl border border-neutral-200 dark:border-neutral-800 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                {editingOrder ? 'Edit Booking' : orderType === 'appointment' ? 'Schedule Appointment' : 'Create Customer Order'}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-4 h-4 text-neutral-400" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold mb-1">Type</label>
                  <select
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value as OrderAppointmentType)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                  >
                    <option value="order">Customer Job Order</option>
                    <option value="appointment">Service Appointment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold mb-1">Reference #</label>
                  <input
                    type="text"
                    required
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    className="w-full px-2.5 py-1.5 font-mono rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold mb-1">Customer</label>
                <select
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.company}) · {c.phone}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold mb-1">Title / Particulars</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold mb-1">Scheduled Date</label>
                  <input
                    type="date"
                    required
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold mb-1">Time Slot / Window</label>
                  <input
                    type="text"
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    placeholder="e.g. 10:00 AM - 11:30 AM"
                    className="w-full px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold mb-1">Assigned Employee</label>
                  <select
                    value={assignedEmployee}
                    onChange={(e) => setAssignedEmployee(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                  >
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.fullName}>{emp.fullName} ({emp.role})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as OrderStatus)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold mb-1">Total Fee ({currencySymbol})</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold mb-1">Deposit Paid ({currencySymbol})</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={depositPaid}
                    onChange={(e) => setDepositPaid(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 border border-neutral-200 dark:border-neutral-700 rounded-md font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md font-semibold"
                >
                  Save Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
