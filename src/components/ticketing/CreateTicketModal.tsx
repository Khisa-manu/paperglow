import React, { useState } from 'react';
import {
  X,
  Plus,
  Paperclip,
  Clock,
  ShieldAlert,
  Flame,
  User,
  Building,
} from 'lucide-react';
import {
  Ticket,
  Customer,
  TicketCategory,
  StaffMember,
  TicketPriority,
  TicketStatus,
} from '../../types/ticketing';

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  categories: TicketCategory[];
  staffMembers: StaffMember[];
  onCreateTicket: (newTicket: Ticket) => void;
}

export const CreateTicketModal: React.FC<CreateTicketModalProps> = ({
  isOpen,
  onClose,
  customers,
  categories,
  staffMembers,
  onCreateTicket,
}) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || '');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [priority, setPriority] = useState<TicketPriority>('medium');
  const [assignedStaffId, setAssignedStaffId] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    const customer = customers.find((c) => c.id === selectedCustomerId) || customers[0];
    const category = categories.find((c) => c.id === categoryId) || categories[0];
    const staff = staffMembers.find((s) => s.id === assignedStaffId);

    // Calculate resolution hours by priority
    const priorityHours: Record<TicketPriority, number> = {
      urgent: 4,
      high: 12,
      medium: 24,
      low: 72,
    };
    const responseHours: Record<TicketPriority, number> = {
      urgent: 1,
      high: 2,
      medium: 4,
      low: 8,
    };

    const now = new Date();
    const dueDate = new Date(now.getTime() + priorityHours[priority] * 3600000).toISOString();
    const responseDueTime = new Date(now.getTime() + responseHours[priority] * 3600000).toISOString();

    const newTicketId = `TK-${Math.floor(8500 + Math.random() * 500)}`;

    const newTicket: Ticket = {
      id: newTicketId,
      customerId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email,
      customerCompany: customer.company,
      subject,
      description,
      categoryId: category.id,
      categoryName: category.name,
      priority,
      status: 'open',
      assignedStaffId: staff?.id,
      assignedStaffName: staff?.name,
      assignedStaffAvatar: staff?.avatar,
      assignedStaffRole: staff?.role,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      dueDate,
      responseDueTime,
      isOverdue: false,
      isResponseOverdue: false,
      tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
      source: 'Web Portal',
      attachments: [],
    };

    onCreateTicket(newTicket);
    onClose();

    // Reset form
    setSubject('');
    setDescription('');
    setTagsInput('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded bg-red-600 flex items-center justify-center text-white text-xs font-bold">
              +
            </div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Create New Support Ticket
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Customer Selection */}
          <div>
            <label className="block text-neutral-500 mb-1 font-medium">Customer Account *</label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-[#181c24] border border-neutral-200 dark:border-neutral-800 rounded text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-red-600"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.company} ({c.email})
                </option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-neutral-500 mb-1 font-medium">Ticket Subject / Title *</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. M-Pesa STK Prompt timed out for Paybill 889210"
              className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-[#181c24] border border-neutral-200 dark:border-neutral-800 rounded text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-red-600"
            />
          </div>

          {/* Category & Priority Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-500 mb-1 font-medium">Category *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-[#181c24] border border-neutral-200 dark:border-neutral-800 rounded text-neutral-900 dark:text-white focus:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} ({cat.slaResolutionHours}h SLA)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-neutral-500 mb-1 font-medium">Priority *</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TicketPriority)}
                className={`w-full px-3 py-1.5 bg-neutral-50 dark:bg-[#181c24] border border-neutral-200 dark:border-neutral-800 rounded font-semibold focus:outline-none ${
                  priority === 'urgent'
                    ? 'text-red-600'
                    : priority === 'high'
                    ? 'text-amber-600'
                    : 'text-neutral-900 dark:text-white'
                }`}
              >
                <option value="urgent">Urgent (4h SLA Resolution / 1h Response)</option>
                <option value="high">High (12h SLA Resolution / 2h Response)</option>
                <option value="medium">Medium (24h SLA Resolution / 4h Response)</option>
                <option value="low">Low (72h SLA Resolution / 8h Response)</option>
              </select>
            </div>
          </div>

          {/* Assigned Staff */}
          <div>
            <label className="block text-neutral-500 mb-1 font-medium">Assigned Staff Member</label>
            <select
              value={assignedStaffId}
              onChange={(e) => setAssignedStaffId(e.target.value)}
              className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-[#181c24] border border-neutral-200 dark:border-neutral-800 rounded text-neutral-900 dark:text-white focus:outline-none"
            >
              <option value="">Leave Unassigned (General Queue)</option>
              {staffMembers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.role}) — {s.activeTicketsCount} active
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-neutral-500 mb-1 font-medium">Inquiry Description & Details *</label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide complete reproduction steps, error logs, or customer context..."
              className="w-full p-3 bg-neutral-50 dark:bg-[#181c24] border border-neutral-200 dark:border-neutral-800 rounded text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-red-600 font-normal leading-relaxed"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-neutral-500 mb-1">Tags (Comma-separated)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. Daraja API, Timeout, Nairobi Hub"
              className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-[#181c24] border border-neutral-200 dark:border-neutral-800 rounded focus:outline-none"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded shadow-xs transition-colors cursor-pointer"
            >
              Create Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
