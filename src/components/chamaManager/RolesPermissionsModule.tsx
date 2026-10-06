import React from 'react';
import { GroupProfile, MemberRole } from '../../types/chamaManager';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Users,
  Award,
} from 'lucide-react';

interface RolesPermissionsModuleProps {
  group: GroupProfile;
}

export const RolesPermissionsModule: React.FC<RolesPermissionsModuleProps> = ({
  group,
}) => {
  const rolesList: {
    role: MemberRole;
    officials: string;
    description: string;
    responsibilities: string[];
    permissions: {
      approveLoans: boolean;
      bankSignatory: boolean;
      callMeetings: boolean;
      manageWelfare: boolean;
      admitMembers: boolean;
    };
  }[] = [
    {
      role: 'Chairperson',
      officials: group.chairpersonName,
      description: 'Chief Executive Officer of the Chama. Presides over all general meetings and leads strategic land acquisition committees.',
      responsibilities: [
        'Presides over all monthly general meetings, AGMs, and executive sessions',
        'Co-signs official banking mandates, cheques, and title deed custody records',
        'Represents the Chama in statutory dealings and commercial contract signings',
        'Oversees committee performance and enforces constitution bylaws',
      ],
      permissions: {
        approveLoans: true,
        bankSignatory: true,
        callMeetings: true,
        manageWelfare: true,
        admitMembers: true,
      },
    },
    {
      role: 'Vice-Chairperson',
      officials: 'Beatrice Wanjiku Kamau',
      description: 'Deputizes the chairperson and coordinates commercial investment sub-committees.',
      responsibilities: [
        'Assumes chair duties in absence of executive chairperson',
        'Leads economic development, plot valuation, and agribusiness initiatives',
        'Monitors member discipline and constitution adherence',
      ],
      permissions: {
        approveLoans: true,
        bankSignatory: false,
        callMeetings: true,
        manageWelfare: false,
        admitMembers: true,
      },
    },
    {
      role: 'Secretary',
      officials: group.secretaryName,
      description: 'Head of Secretariat, official communications, minutes recording, and member registration documents.',
      responsibilities: [
        'Maintains accurate roll call registers and issues meeting agendas',
        'Records, circulates, and files minutes of all Chama proceedings',
        'Issues certified Membership Certificates and Digital QR ID Cards',
        'Acts as official banking signatory (Mandate Category B)',
      ],
      permissions: {
        approveLoans: true,
        bankSignatory: true,
        callMeetings: true,
        manageWelfare: true,
        admitMembers: true,
      },
    },
    {
      role: 'Treasurer',
      officials: group.treasurerName,
      description: 'Chief Financial Officer. Custodian of Co-op Bank accounts, M-Pesa statements, and audit ledgers.',
      responsibilities: [
        'Reconciles monthly pooled member savings and welfare collections',
        'Coordinates loan disbursements and tracks monthly repayment schedules',
        'Prepares quarterly cashbooks, balance sheets, and annual AGM financial reports',
        'Acts as primary Co-operative Bank authorized signatory',
      ],
      permissions: {
        approveLoans: true,
        bankSignatory: true,
        callMeetings: false,
        manageWelfare: true,
        admitMembers: false,
      },
    },
    {
      role: 'Welfare Coordinator',
      officials: 'Grace Achieng Odhiambo',
      description: 'Oversees the benevolent welfare fund, hospital visits, and bereavement assistance dispatches.',
      responsibilities: [
        'Vets and validates benevolent hospital and bereavement claims',
        'Organizes hospital visit delegations and funeral solidarity convoys',
        'Maintains transparency over the KES welfare reserve account',
      ],
      permissions: {
        approveLoans: false,
        bankSignatory: false,
        callMeetings: false,
        manageWelfare: true,
        admitMembers: false,
      },
    },
    {
      role: 'Committee Member',
      officials: 'Samuel Cheruiyot & Dennis Mwau',
      description: 'Non-executive committee members providing technical audit, IT, and project monitoring oversight.',
      responsibilities: [
        'Appraises loan guarantor sufficiency and plot title survey beacons',
        'Provides technology guidance on digital bookkeeping systems',
        'Represents ordinary member interests on the executive board',
      ],
      permissions: {
        approveLoans: true,
        bankSignatory: false,
        callMeetings: false,
        manageWelfare: false,
        admitMembers: false,
      },
    },
    {
      role: 'Member',
      officials: 'All Registered Shareholders',
      description: 'Active shareholder entitled to monthly saving, credit borrowing, dividends, and full voting franchise.',
      responsibilities: [
        'Remits monthly contributions of KES 10,000 + Welfare KES 1,500 on time',
        'Attends all monthly general meetings and participates in investment votes',
        'Acts as responsible guarantor for fellow members in good standing',
      ],
      permissions: {
        approveLoans: false,
        bankSignatory: false,
        callMeetings: false,
        manageWelfare: false,
        admitMembers: false,
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <h2 className="text-xl font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100 flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-red-600" />
          <span>Governance Framework &amp; Role Mandates</span>
        </h2>
        <p className="text-xs text-neutral-500">
          Executive leadership separation, Co-op Bank two-to-sign mandate, and constitutional privileges
        </p>
      </div>

      {/* Permissions Matrix Table */}
      <div className="p-5 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-3">
        <h3 className="text-sm font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
          Statutory Permissions &amp; Mandate Matrix
        </h3>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-semibold uppercase text-[10px]">
                <th className="pb-3">Role Designation</th>
                <th className="pb-3 text-center">Bank Signatory</th>
                <th className="pb-3 text-center">Approve Credit Loans</th>
                <th className="pb-3 text-center">Disburse Welfare</th>
                <th className="pb-3 text-center">Summon Meetings</th>
                <th className="pb-3 text-center">Admit Members</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
              {rolesList.map((r, idx) => (
                <tr key={idx} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30">
                  <td className="py-3 font-bold text-neutral-900 dark:text-neutral-100">
                    {r.role}
                  </td>
                  <td className="py-3 text-center">
                    {r.permissions.bankSignatory ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" />
                    ) : (
                      <XCircle className="w-4 h-4 text-neutral-300 inline" />
                    )}
                  </td>
                  <td className="py-3 text-center">
                    {r.permissions.approveLoans ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" />
                    ) : (
                      <XCircle className="w-4 h-4 text-neutral-300 inline" />
                    )}
                  </td>
                  <td className="py-3 text-center">
                    {r.permissions.manageWelfare ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" />
                    ) : (
                      <XCircle className="w-4 h-4 text-neutral-300 inline" />
                    )}
                  </td>
                  <td className="py-3 text-center">
                    {r.permissions.callMeetings ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" />
                    ) : (
                      <XCircle className="w-4 h-4 text-neutral-300 inline" />
                    )}
                  </td>
                  <td className="py-3 text-center">
                    {r.permissions.admitMembers ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" />
                    ) : (
                      <XCircle className="w-4 h-4 text-neutral-300 inline" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Details Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rolesList.map((r, idx) => (
          <div
            key={idx}
            className="p-5 rounded-xl bg-white dark:bg-[#11141a] border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-bold font-['Poppins'] text-neutral-900 dark:text-neutral-100">
                  {r.role}
                </h3>
                <span className="text-xs text-red-600 font-semibold block">
                  Current Official: {r.officials}
                </span>
              </div>
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              {r.description}
            </p>

            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                Primary Responsibilities:
              </span>
              <ul className="space-y-1 text-xs text-neutral-700 dark:text-neutral-300">
                {r.responsibilities.map((resp, rIdx) => (
                  <li key={rIdx} className="flex items-start space-x-1.5">
                    <span className="text-red-600 font-bold">•</span>
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
