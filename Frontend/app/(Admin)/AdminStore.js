import { useState, useEffect } from 'react';

export const initialAdminKPI = {
  totalUsers: 1420,
  totalLawyers: 340,
  verifiedLawyers: 258,
  pendingLawyers: 12,
  activeCases: 890,
  completedCases: 1240,
  openDisputes: 14,
  newReports: 8,
};

export const initialPendingLawyers = [
  {
    id: 'law-101',
    name: 'Advocate Tariq Mahmood',
    email: 'tariq.mahmood@lawfirm.pk',
    phone: '03001234567',
    district: 'Karachi South',
    sbcNumber: 'SBC-88912',
    specialty: 'Property & Real Estate',
    experience: '12 Years',
    cnic: '42101-1234567-1',
    submittedAt: '2026-08-10 14:20',
    status: 'Pending',
    documents: ['High Court License', 'CNIC Copy', 'Bar Council Card'],
  },
  {
    id: 'law-102',
    name: 'Advocate Sumaira Parveen',
    email: 'sumaira.p@lawyersindh.pk',
    phone: '03129876543',
    district: 'Hyderabad',
    sbcNumber: 'SBC-91204',
    specialty: 'Family & Marriage Law',
    experience: '8 Years',
    cnic: '41302-9876543-2',
    submittedAt: '2026-08-10 11:45',
    status: 'Pending',
    documents: ['High Court License', 'CNIC Copy'],
  },
  {
    id: 'law-103',
    name: 'Advocate Bilawal Shah',
    email: 'bilawal.shah@legal.pk',
    phone: '03334567890',
    district: 'Sukkur',
    sbcNumber: 'SBC-77410',
    specialty: 'Criminal Defense',
    experience: '15 Years',
    cnic: '45501-4567890-3',
    submittedAt: '2026-08-09 18:30',
    status: 'Pending',
    documents: ['Bar Council Card', 'Degree Verification'],
  },
  {
    id: 'law-104',
    name: 'Advocate Rashida Bano',
    email: 'rashida.bano@advocate.pk',
    phone: '03017654321',
    district: 'Larkana',
    sbcNumber: 'SBC-65432',
    specialty: 'Civil & Commercial',
    experience: '6 Years',
    cnic: '43203-7654321-4',
    submittedAt: '2026-08-09 09:15',
    status: 'Pending',
    documents: ['High Court License', 'Bar Association Certificate'],
  },
];

export const initialUsers = [
  { id: 'usr-1', name: 'Muhammad Ali', email: 'ali@gmail.com', role: 'citizen', district: 'Karachi Central', status: 'Active', cnic: '42101-5544332-1' },
  { id: 'usr-2', name: 'Adv. Tariq Mahmood', email: 'tariq@lawfirm.pk', role: 'lawyer', district: 'Karachi South', status: 'Pending Verification', cnic: '42101-1234567-1' },
  { id: 'usr-3', name: 'Legal Aid NGO Sindh', email: 'info@legalaid.org', role: 'ngo', district: 'Karachi East', status: 'Active', cnic: '42201-9988776-5' },
  { id: 'usr-4', name: 'Sara Ahmed', email: 'sara.ahmed@yahoo.com', role: 'citizen', district: 'Hyderabad', status: 'Active', cnic: '41302-3322114-6' },
  { id: 'usr-5', name: 'Adv. Kamran Khan', email: 'kamran@law.pk', role: 'lawyer', district: 'Sukkur', status: 'Active', cnic: '45501-8877665-2' },
];

export const initialDisputes = [
  { id: 'dsp-1', caseId: 'CASE-402', citizen: 'Zubaida Bibi', lawyer: 'Adv. Ahmed Raza', issue: 'Consultation Delay & Fee Misunderstanding', district: 'Mirpur Khas', status: 'Open', date: '2026-08-08' },
  { id: 'dsp-2', caseId: 'CASE-519', citizen: 'Imran Shah', lawyer: 'Adv. Farooq Soomro', issue: 'Document Transfer Delay', district: 'Shaheed Benazirabad', status: 'Open', date: '2026-08-09' },
  { id: 'dsp-3', caseId: 'CASE-311', citizen: 'Farhan Qureshi', lawyer: 'Adv. Nusrat Fatima', issue: 'Hearing Date No-Show', district: 'Karachi West', status: 'Resolved', date: '2026-08-05' },
];

export const initialAuditLogs = [
  { id: 'log-1', actor: 'Super Admin', action: 'Approved Lawyer Verification', entity: 'Adv. Kamran Khan (SBC-4412)', timestamp: '10 mins ago' },
  { id: 'log-2', actor: 'System AI', action: 'Flagged Inappropriate Case Document', entity: 'Case #CASE-902', timestamp: '25 mins ago' },
  { id: 'log-3', actor: 'Admin Moderator', action: 'Resolved Dispute', entity: 'Dispute #DSP-311', timestamp: '1 hour ago' },
  { id: 'log-4', actor: 'Super Admin', action: 'Updated System Security Toggles', entity: '2-Factor Auth Policy', timestamp: '3 hours ago' },
];

let globalStore = {
  kpi: { ...initialAdminKPI },
  lawyers: [...initialPendingLawyers],
  users: [...initialUsers],
  disputes: [...initialDisputes],
  auditLogs: [...initialAuditLogs],
};

const listeners = new Set();

export function useAdminStore() {
  const [state, setState] = useState(globalStore);

  useEffect(() => {
    listeners.add(setState);
    return () => listeners.delete(setState);
  }, []);

  const approveLawyer = (id) => {
    globalStore.lawyers = globalStore.lawyers.map(l => 
      l.id === id ? { ...l, status: 'Approved' } : l
    );
    globalStore.kpi.pendingLawyers = Math.max(0, globalStore.kpi.pendingLawyers - 1);
    globalStore.kpi.verifiedLawyers += 1;
    globalStore.auditLogs.unshift({
      id: 'log-' + Date.now(),
      actor: 'Super Admin',
      action: 'Approved Lawyer Verification',
      entity: `Lawyer ID: ${id}`,
      timestamp: 'Just now',
    });
    listeners.forEach(fn => fn({ ...globalStore }));
  };

  const rejectLawyer = (id) => {
    globalStore.lawyers = globalStore.lawyers.map(l => 
      l.id === id ? { ...l, status: 'Rejected' } : l
    );
    globalStore.kpi.pendingLawyers = Math.max(0, globalStore.kpi.pendingLawyers - 1);
    globalStore.auditLogs.unshift({
      id: 'log-' + Date.now(),
      actor: 'Super Admin',
      action: 'Rejected Lawyer Verification',
      entity: `Lawyer ID: ${id}`,
      timestamp: 'Just now',
    });
    listeners.forEach(fn => fn({ ...globalStore }));
  };

  const toggleUserStatus = (id) => {
    globalStore.users = globalStore.users.map(u => 
      u.id === id ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u
    );
    listeners.forEach(fn => fn({ ...globalStore }));
  };

  const resolveDispute = (id) => {
    globalStore.disputes = globalStore.disputes.map(d => 
      d.id === id ? { ...d, status: 'Resolved' } : d
    );
    globalStore.kpi.openDisputes = Math.max(0, globalStore.kpi.openDisputes - 1);
    listeners.forEach(fn => fn({ ...globalStore }));
  };

  return {
    state,
    approveLawyer,
    rejectLawyer,
    toggleUserStatus,
    resolveDispute,
  };
}
