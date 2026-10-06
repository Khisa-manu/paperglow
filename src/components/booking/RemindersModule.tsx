import React, { useState } from 'react';
import {
  BellRing,
  MessageSquare,
  Mail,
  Send,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Smartphone,
  ExternalLink,
} from 'lucide-react';
import { BookingReminderRule, BookingAppointment } from '../../types/booking';

interface RemindersModuleProps {
  reminderRules: BookingReminderRule[];
  appointments: BookingAppointment[];
  onToggleRule: (ruleId: string) => void;
  onUpdateTemplate: (ruleId: string, template: string) => void;
}

export const RemindersModule: React.FC<RemindersModuleProps> = ({
  reminderRules,
  appointments,
  onToggleRule,
  onUpdateTemplate,
}) => {
  const [selectedRuleId, setSelectedRuleId] = useState<string>(reminderRules[0]?.id || '');
  const [templateEdit, setTemplateEdit] = useState<string>(reminderRules[0]?.template || '');
  const [testSentMessage, setTestSentMessage] = useState<string | null>(null);
  const [templateSavedMessage, setTemplateSavedMessage] = useState<string | null>(null);

  const selectedRule = reminderRules.find((r) => r.id === selectedRuleId) || reminderRules[0];

  const handleSelectRule = (rule: BookingReminderRule) => {
    setSelectedRuleId(rule.id);
    setTemplateEdit(rule.template);
    setTestSentMessage(null);
    setTemplateSavedMessage(null);
  };

  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRule) return;
    onUpdateTemplate(selectedRule.id, templateEdit);
    setTemplateSavedMessage('Reminder template updated successfully.');
    setTimeout(() => setTemplateSavedMessage(null), 3000);
  };

  const handleSendTest = () => {
    const demoApt = appointments[0];
    if (!demoApt) return;

    let preview = templateEdit
      .replace('{{customer_name}}', demoApt.customerName)
      .replace('{{service_name}}', demoApt.serviceName)
      .replace('{{date}}', demoApt.date)
      .replace('{{time}}', demoApt.startTime)
      .replace('{{staff_name}}', demoApt.staffName)
      .replace('{{booking_id}}', demoApt.id);

    setTestSentMessage(`Simulated ${selectedRule.channel.toUpperCase()} sent to ${demoApt.customerPhone}: "${preview}"`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 sm:p-5 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-['Poppins']">
            Automated Client Reminders &amp; Dispatch Rules
          </h2>
          <p className="text-xs text-neutral-500">
            Prevent no-shows with timed SMS, WhatsApp, and email alerts triggered before client appointments.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold">
            Zero No-Show Target Active
          </span>
        </div>
      </div>

      {/* Integration Channels Matrix (SMS, WhatsApp, Email) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Channel 1: Safaricom SMS */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-bold text-neutral-900 dark:text-white font-['Poppins']">
              <Smartphone className="w-4 h-4 text-emerald-600" />
              <span>Safaricom SMS Gateway</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400">
              Active Integration
            </span>
          </div>
          <p className="text-xs text-neutral-500">
            Direct alphanumeric sender ID (PAPERGLOW) delivery across Safaricom and Airtel Kenya networks.
          </p>
          <div className="text-[11px] font-mono text-neutral-400 pt-1">
            Status: Live Queue Ready (KES 0.50 / SMS)
          </div>
        </div>

        {/* Channel 2: WhatsApp Cloud API */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-bold text-neutral-900 dark:text-white font-['Poppins']">
              <MessageSquare className="w-4 h-4 text-emerald-500" />
              <span>WhatsApp Business API</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-400">
              Connector Ready
            </span>
          </div>
          <p className="text-xs text-neutral-500">
            Interactive WhatsApp notifications with quick 1-tap "Confirm" and "Reschedule" reply buttons.
          </p>
          <div className="text-[11px] font-mono text-neutral-400 pt-1">
            Status: Ready for Meta Cloud API Key
          </div>
        </div>

        {/* Channel 3: Email SMTP */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-bold text-neutral-900 dark:text-white font-['Poppins']">
              <Mail className="w-4 h-4 text-purple-500" />
              <span>Transactional Email (SMTP)</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400">
              Active Integration
            </span>
          </div>
          <p className="text-xs text-neutral-500">
            HTML calendar invites (.ics file attachments) with direct Google Calendar and Apple Calendar sync.
          </p>
          <div className="text-[11px] font-mono text-neutral-400 pt-1">
            Status: paperglowstudio.co.ke DKIM verified
          </div>
        </div>
      </div>

      {/* Reminder Rules Configuration Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rules Selector List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-neutral-900 dark:text-white font-['Poppins'] uppercase tracking-wider">
            Scheduled Notification Triggers
          </h3>

          {reminderRules.map((rule) => {
            const isSelected = selectedRule?.id === rule.id;
            return (
              <div
                key={rule.id}
                onClick={() => handleSelectRule(rule)}
                className={`p-4 rounded-xl border bg-white dark:bg-[#12151b] transition-all cursor-pointer shadow-xs ${
                  isSelected
                    ? 'border-red-500 dark:border-red-600 ring-1 ring-red-500/20'
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-900 dark:text-white">
                    {rule.title}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleRule(rule.id);
                    }}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer ${
                      rule.isActive
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400'
                    }`}
                  >
                    {rule.isActive ? 'Enabled' : 'Paused'}
                  </button>
                </div>

                <div className="flex items-center space-x-2 text-[11px] text-neutral-500 mt-2">
                  <span className="uppercase font-mono font-bold text-neutral-700 dark:text-neutral-300">
                    {rule.channel}
                  </span>
                  <span>•</span>
                  <span>
                    {rule.timingHoursBefore === 0
                      ? 'Instant Trigger'
                      : `${rule.timingHoursBefore} hours before appointment`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Template Editor & Live Simulator */}
        {selectedRule && (
          <div className="lg:col-span-2 bg-white dark:bg-[#12151b] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white font-['Poppins']">
                  Configure Message Template: {selectedRule.title}
                </h3>
                <p className="text-xs text-neutral-500">
                  Channel: <strong className="uppercase">{selectedRule.channel}</strong> · Delivery: {selectedRule.integrationProvider}
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveTemplate} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Message Body &amp; Variable Interpolation
                </label>
                <textarea
                  rows={4}
                  value={templateEdit}
                  onChange={(e) => setTemplateEdit(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-mono leading-relaxed"
                />
              </div>

              {/* Supported Dynamic Tags */}
              <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-500 space-y-1">
                <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                  Available Dynamic Variables:
                </span>
                <div className="flex flex-wrap gap-1.5 font-mono text-[10px] text-red-600 dark:text-red-400">
                  <span className="bg-white dark:bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-700">{'{{customer_name}}'}</span>
                  <span className="bg-white dark:bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-700">{'{{service_name}}'}</span>
                  <span className="bg-white dark:bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-700">{'{{date}}'}</span>
                  <span className="bg-white dark:bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-700">{'{{time}}'}</span>
                  <span className="bg-white dark:bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-700">{'{{staff_name}}'}</span>
                  <span className="bg-white dark:bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-700">{'{{booking_id}}'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleSendTest}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-lg transition-colors flex items-center space-x-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Test to Demo Client</span>
                </button>

                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs cursor-pointer"
                >
                  Save Template
                </button>
              </div>
            </form>

            {/* Test Send Feedback Simulation */}
            {templateSavedMessage && (
              <div className="p-3.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center space-x-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{templateSavedMessage}</span>
              </div>
            )}

            {testSentMessage && (
              <div className="p-3.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 space-y-1">
                <div className="flex items-center space-x-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Test Notification Dispatched Successfully:</span>
                </div>
                <p className="font-mono text-[11px]">{testSentMessage}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
