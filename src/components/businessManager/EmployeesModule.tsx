import React, { useState } from 'react';
import { Employee, AttendanceRecord, EmployeeRole } from '../../types/businessManager';
import {
  UserCheck,
  Plus,
  Search,
  Clock,
  Phone,
  Mail,
  Briefcase,
  DollarSign,
  CheckCircle2,
  XCircle,
  X,
  Edit,
  Trash2,
} from 'lucide-react';

interface EmployeesModuleProps {
  employees: Employee[];
  attendance: AttendanceRecord[];
  currencySymbol: string;
  onSaveEmployee: (emp: Employee) => void;
  onDeleteEmployee: (id: string) => void;
  onToggleClockIn: (employeeId: string) => void;
}

const ROLES: EmployeeRole[] = [
  'Operations Manager',
  'Senior Sales Consultant',
  'Lead Designer',
  'Inventory & Logistics Officer',
  'Accountant / Cashier',
  'Production Technician',
  'Customer Support Lead',
];

export const EmployeesModule: React.FC<EmployeesModuleProps> = ({
  employees,
  attendance,
  currencySymbol,
  onSaveEmployee,
  onDeleteEmployee,
  onToggleClockIn,
}) => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmp, setEditingEmp] = useState<Employee | null>(null);

  // Form fields
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<EmployeeRole>('Production Technician');
  const [department, setDepartment] = useState('Workshop');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+254 ');
  const [baseSalary, setBaseSalary] = useState<number>(60000);
  const [hireDate, setHireDate] = useState('2024-01-01');
  const [status, setStatus] = useState<'Active' | 'On Leave' | 'Terminated'>('Active');

  const handleOpenCreate = () => {
    setEditingEmp(null);
    setFullName('');
    setRole('Production Technician');
    setDepartment('Workshop');
    setEmail('');
    setPhone('+254 ');
    setBaseSalary(55000);
    setHireDate('2024-06-01');
    setStatus('Active');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (emp: Employee) => {
    setEditingEmp(emp);
    setFullName(emp.fullName);
    setRole(emp.role);
    setDepartment(emp.department);
    setEmail(emp.email);
    setPhone(emp.phone);
    setBaseSalary(emp.baseSalary);
    setHireDate(emp.hireDate);
    setStatus(emp.status);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const emp: Employee = {
      id: editingEmp?.id || `emp-${Date.now()}`,
      fullName,
      role,
      department,
      email,
      phone,
      baseSalary: Number(baseSalary),
      hireDate,
      status,
      todayStatus: editingEmp?.todayStatus || 'Clocked In',
      clockInTime: editingEmp?.clockInTime || '08:00 AM',
    };
    onSaveEmployee(emp);
    setIsModalOpen(false);
  };

  const filteredEmployees = employees.filter((e) => {
    const q = search.toLowerCase();
    return (
      e.fullName.toLowerCase().includes(q) ||
      e.role.toLowerCase().includes(q) ||
      e.department.toLowerCase().includes(q)
    );
  });

  const totalPayroll = employees.reduce((sum, e) => sum + e.baseSalary, 0);

  return (
    <div className="space-y-6">
      {/* Overview Metric Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <div className="text-xs font-semibold text-neutral-500 uppercase">Active Staff Roster</div>
          <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100 mt-1">
            {employees.length} <span className="text-xs font-normal text-neutral-500">Team Members</span>
          </div>
        </div>
        <div className="p-4 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <div className="text-xs font-semibold text-neutral-500 uppercase">Clocked In Today</div>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
            {employees.filter((e) => e.todayStatus === 'Clocked In').length} / {employees.length}
          </div>
        </div>
        <div className="p-4 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <div className="text-xs font-semibold text-neutral-500 uppercase">Monthly Payroll Allocation</div>
          <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100 mt-1 tabular-nums">
            {currencySymbol} {totalPayroll.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Action and Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search employee name, role, department..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
          />
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Add Employee Record</span>
        </button>
      </div>

      {/* Employees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEmployees.map((emp) => {
          const isClocked = emp.todayStatus === 'Clocked In';
          return (
            <div
              key={emp.id}
              className="p-5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between shadow-xs hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 flex items-center justify-center font-bold text-xs">
                      {emp.fullName.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                        {emp.fullName}
                      </h4>
                      <div className="text-xs text-red-600 dark:text-red-400 font-medium">
                        {emp.role}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400">
                    {emp.department}
                  </span>
                </div>

                <div className="mt-4 space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{emp.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-neutral-400" />
                    <span className="truncate">{emp.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Salary: {currencySymbol} {emp.baseSalary.toLocaleString()} / mo</span>
                  </div>
                </div>

                {/* Today's Shift Status */}
                <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    {isClocked ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-neutral-400" />
                    )}
                    <span className={isClocked ? 'text-emerald-600 font-semibold' : 'text-neutral-500'}>
                      {emp.todayStatus} {emp.clockInTime ? `(${emp.clockInTime})` : ''}
                    </span>
                  </div>

                  <button
                    onClick={() => onToggleClockIn(emp.id)}
                    className={`px-2 py-1 rounded-sm text-[11px] font-semibold border transition-colors ${
                      isClocked
                        ? 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                        : 'bg-emerald-600 text-white border-emerald-600'
                    }`}
                  >
                    {isClocked ? 'Clock Out' : 'Clock In'}
                  </button>
                </div>
              </div>

              {/* Edit/Delete Footer */}
              <div className="mt-4 pt-2 border-t border-neutral-100 dark:border-neutral-800 flex justify-end gap-1">
                <button
                  onClick={() => handleOpenEdit(emp)}
                  className="p-1 text-neutral-400 hover:text-blue-600"
                  title="Edit Profile"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDeleteEmployee(emp.id)}
                  className="p-1 text-neutral-400 hover:text-red-600"
                  title="Delete Record"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Employee Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 rounded-lg max-w-md w-full p-5 shadow-2xl border border-neutral-200 dark:border-neutral-800 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                {editingEmp ? 'Edit Employee' : 'Add Employee Record'}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-4 h-4 text-neutral-400" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold mb-1">Role / Job Title</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as EmployeeRole)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold mb-1">Department</label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold mb-1">Monthly Wage ({currencySymbol})</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={baseSalary}
                    onChange={(e) => setBaseSalary(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold mb-1">Hire Date</label>
                  <input
                    type="date"
                    required
                    value={hireDate}
                    onChange={(e) => setHireDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
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
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
