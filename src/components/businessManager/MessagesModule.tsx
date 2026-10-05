import React, { useState } from 'react';
import {
  CustomerMessage,
  MessageTemplate,
  Customer,
  BusinessSettings,
  MessageChannel,
} from '../../types/businessManager';
import {
  MessageSquare,
  Send,
  Smartphone,
  CheckCircle2,
  Copy,
  Info,
  Clock,
  User,
  Plus,
  X,
  Radio,
} from 'lucide-react';

interface MessagesModuleProps {
  messages: CustomerMessage[];
  templates: MessageTemplate[];
  customers: Customer[];
  settings: BusinessSettings;
  onSendMessage: (msg: CustomerMessage) => void;
}

export const MessagesModule: React.FC<MessagesModuleProps> = ({
  messages,
  templates,
  customers,
  settings,
  onSendMessage,
}) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || '');
  const [channel, setChannel] = useState<MessageChannel>('whatsapp');
  const [subject, setSubject] = useState('Payment Reminder');
  const [content, setContent] = useState('');
  const [isSuccessToast, setIsSuccessToast] = useState(false);

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0];

  const handleApplyTemplate = (tpl: MessageTemplate) => {
    let text = tpl.text;
    text = text.replace('{{customer_name}}', selectedCustomer?.name || 'Client');
    text = text.replace('{{business_name}}', settings.legalTradingName);
    text = text.replace('{{document_number}}', 'INV-2026-081');
    text = text.replace('{{amount}}', `${settings.currency} 48,500`);
    text = text.replace('{{due_date}}', 'April 11, 2026');
    text = text.replace('{{paybill}}', settings.mpesaDetails.paybillNumber);
    text = text.replace('{{account}}', settings.mpesaDetails.accountNumber);
    text = text.replace('{{order_number}}', 'ORD-2026-218');
    text = text.replace('{{item_title}}', '50 Embroidered Polo Shirts');
    text = text.replace('{{issue_date}}', 'March 28, 2026');
    text = text.replace('{{assigned_staff}}', 'David Mwangi');
    text = text.replace('{{appointment_date}}', 'April 2, 2026');
    text = text.replace('{{time_slot}}', '10:00 AM');
    text = text.replace('{{business_address}}', `${settings.physicalAddress}, ${settings.city}`);

    setSubject(tpl.title);
    setContent(text);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const newMsg: CustomerMessage = {
      id: `msg-${Date.now()}`,
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      recipientContact: selectedCustomer.phone,
      channel,
      subject,
      content,
      status: 'simulated',
      sentAt: 'Just now (Simulated Dispatch)',
    };

    onSendMessage(newMsg);
    setIsSuccessToast(true);
    setTimeout(() => setIsSuccessToast(false), 4000);
    setContent('');
  };

  return (
    <div className="space-y-6">
      {/* Future Integration Banner */}
      <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-start gap-3">
        <div className="p-2 rounded-md bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 shrink-0">
          <Radio className="w-5 h-5 animate-pulse" />
        </div>
        <div className="text-xs">
          <div className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2">
            <span>External SMS &amp; WhatsApp Business API Gateway</span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded-xs bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100">
              Future Integration
            </span>
          </div>
          <p className="text-amber-800/90 dark:text-amber-300/80 mt-1 leading-relaxed">
            Direct carrier transmission requires WhatsApp Cloud API credentials or an Africa's Talking API key. Currently operating in realistic local dispatch simulation mode. Outgoing notifications are verified and archived into your client communication log.
          </p>
        </div>
      </div>

      {isSuccessToast && (
        <div className="p-3 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Message successfully dispatched to client communication log!</span>
        </div>
      )}

      {/* Main Grid: Compose Box + Quick Templates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compose Panel (2 cols) */}
        <div className="lg:col-span-2 p-5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-red-600" />
              <span>Compose Customer Notification</span>
            </h3>
            <span className="text-[11px] text-neutral-400">Instant Local State Dispatch</span>
          </div>

          <form onSubmit={handleSend} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold mb-1">Select Recipient Client</label>
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
                <label className="block text-[11px] font-semibold mb-1">Delivery Channel</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setChannel('whatsapp')}
                    className={`py-1.5 px-3 rounded-md border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      channel === 'whatsapp'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setChannel('sms')}
                    className={`py-1.5 px-3 rounded-md border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      channel === 'sms'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>SMS</span>
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold mb-1">Subject / Notification Category</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold mb-1">Message Content</label>
              <textarea
                rows={5}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type your message or click a pre-built template on the right to populate..."
                className="w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-mono text-xs leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-neutral-500">
                To: {selectedCustomer?.phone} ({channel.toUpperCase()})
              </span>
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Dispatch Message</span>
              </button>
            </div>
          </form>
        </div>

        {/* Message Templates Library */}
        <div className="p-5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
          <div className="pb-2 border-b border-neutral-100 dark:border-neutral-800">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Message Templates
            </h3>
            <p className="text-[11px] text-neutral-500">Click any card to load pre-filled text</p>
          </div>

          <div className="space-y-2 text-xs">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                onClick={() => handleApplyTemplate(tpl)}
                className="p-3 rounded-md border border-neutral-200 dark:border-neutral-800 hover:border-red-500/50 hover:bg-red-50/30 dark:hover:bg-red-950/20 cursor-pointer transition-colors"
              >
                <div className="font-semibold text-neutral-800 dark:text-neutral-200">
                  {tpl.title}
                </div>
                <p className="text-[11px] text-neutral-500 line-clamp-2 mt-1 font-mono">
                  {tpl.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Message History Feed */}
      <div className="p-5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 pb-3 border-b border-neutral-100 dark:border-neutral-800">
          Dispatched Customer Communications Log
        </h3>

        <div className="divide-y divide-neutral-100 dark:divide-neutral-800 mt-2 text-xs">
          {messages.map((m) => (
            <div key={m.id} className="py-3 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 font-semibold text-neutral-900 dark:text-neutral-100">
                  <span>{m.customerName}</span>
                  <span className="font-mono text-neutral-400 font-normal">({m.recipientContact})</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-xs uppercase text-[10px] font-mono font-bold ${
                      m.channel === 'whatsapp'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                        : 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400'
                    }`}
                  >
                    {m.channel}
                  </span>
                </div>
                <p className="text-neutral-700 dark:text-neutral-300 mt-1 leading-relaxed">
                  {m.content}
                </p>
              </div>
              <div className="text-right shrink-0 text-[11px] text-neutral-400 font-mono">
                {m.sentAt}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
