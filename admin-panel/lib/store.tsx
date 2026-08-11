'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  MOCK_USERS, MOCK_LAWYERS, MOCK_CASES, MOCK_TRANSACTIONS,
  MOCK_PAYOUTS, MOCK_REFUNDS, MOCK_DISPUTES, MOCK_REPORTS,
  MOCK_REVIEWS, MOCK_AUDIT_LOGS, MOCK_NOTIFICATIONS, MOCK_ADMIN_USERS,
  MOCK_CATEGORIES, MOCK_PROPOSALS, MOCK_APPOINTMENTS, MOCK_AI_SESSIONS,
} from './mock-data';

type StoreState = {
  users: typeof MOCK_USERS;
  lawyers: typeof MOCK_LAWYERS;
  cases: typeof MOCK_CASES;
  transactions: typeof MOCK_TRANSACTIONS;
  payouts: typeof MOCK_PAYOUTS;
  refunds: typeof MOCK_REFUNDS;
  disputes: typeof MOCK_DISPUTES;
  reports: typeof MOCK_REPORTS;
  reviews: typeof MOCK_REVIEWS;
  auditLogs: typeof MOCK_AUDIT_LOGS;
  notifications: typeof MOCK_NOTIFICATIONS;
  adminUsers: typeof MOCK_ADMIN_USERS;
  categories: typeof MOCK_CATEGORIES;
  proposals: typeof MOCK_PROPOSALS;
  appointments: typeof MOCK_APPOINTMENTS;
  aiSessions: typeof MOCK_AI_SESSIONS;
  // actions
  updateUser: (id: string, patch: Partial<typeof MOCK_USERS[0]>) => void;
  updateLawyer: (id: string, patch: Partial<typeof MOCK_LAWYERS[0]>) => void;
  updateCase: (id: string, patch: Partial<typeof MOCK_CASES[0]>) => void;
  updateDispute: (id: string, patch: Partial<typeof MOCK_DISPUTES[0]>) => void;
  updateReport: (id: string, patch: Partial<typeof MOCK_REPORTS[0]>) => void;
  updateReview: (id: string, patch: Partial<typeof MOCK_REVIEWS[0]>) => void;
  updateRefund: (id: string, patch: Partial<typeof MOCK_REFUNDS[0]>) => void;
  updatePayout: (id: string, patch: Partial<typeof MOCK_PAYOUTS[0]>) => void;
  updateProposal: (id: string, patch: Partial<typeof MOCK_PROPOSALS[0]>) => void;
  addAuditLog: (log: Omit<typeof MOCK_AUDIT_LOGS[0], 'id'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadCount: number;
};

const StoreCtx = createContext<StoreState | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState(MOCK_USERS);
  const [lawyers, setLawyers] = useState(MOCK_LAWYERS);
  const [cases, setCases] = useState(MOCK_CASES);
  const [transactions] = useState(MOCK_TRANSACTIONS);
  const [payouts, setPayouts] = useState(MOCK_PAYOUTS);
  const [refunds, setRefunds] = useState(MOCK_REFUNDS);
  const [disputes, setDisputes] = useState(MOCK_DISPUTES);
  const [reports, setReports] = useState(MOCK_REPORTS);
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [auditLogs, setAuditLogs] = useState(MOCK_AUDIT_LOGS);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [adminUsers] = useState(MOCK_ADMIN_USERS);
  const [categories] = useState(MOCK_CATEGORIES);
  const [proposals, setProposals] = useState(MOCK_PROPOSALS);
  const [appointments] = useState(MOCK_APPOINTMENTS);
  const [aiSessions] = useState(MOCK_AI_SESSIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  function addAuditLog(log: Omit<typeof MOCK_AUDIT_LOGS[0], 'id'>) {
    const newLog = { ...log, id: `AUD-${Date.now()}` };
    setAuditLogs(prev => [newLog, ...prev]);
  }

  function updateUser(id: string, patch: Partial<typeof MOCK_USERS[0]>) {
    setUsers(p => p.map(u => u.id === id ? { ...u, ...patch } : u));
    addAuditLog({ actor: 'Super Admin', action: `user.${Object.keys(patch)[0]}`, entityType: 'User', entityId: id, ip: '192.168.1.1', timestamp: new Date().toISOString(), details: JSON.stringify(patch) });
  }
  function updateLawyer(id: string, patch: Partial<typeof MOCK_LAWYERS[0]>) {
    setLawyers(p => p.map(l => l.id === id ? { ...l, ...patch } : l));
    addAuditLog({ actor: 'Super Admin', action: `lawyer.${Object.keys(patch)[0]}`, entityType: 'Lawyer', entityId: id, ip: '192.168.1.1', timestamp: new Date().toISOString(), details: JSON.stringify(patch) });
  }
  function updateCase(id: string, patch: Partial<typeof MOCK_CASES[0]>) { setCases(p => p.map(c => c.id === id ? { ...c, ...patch } : c)); }
  function updateDispute(id: string, patch: Partial<typeof MOCK_DISPUTES[0]>) { setDisputes(p => p.map(d => d.id === id ? { ...d, ...patch } : d)); }
  function updateReport(id: string, patch: Partial<typeof MOCK_REPORTS[0]>) { setReports(p => p.map(r => r.id === id ? { ...r, ...patch } : r)); }
  function updateReview(id: string, patch: Partial<typeof MOCK_REVIEWS[0]>) { setReviews(p => p.map(r => r.id === id ? { ...r, ...patch } : r)); }
  function updateRefund(id: string, patch: Partial<typeof MOCK_REFUNDS[0]>) { setRefunds(p => p.map(r => r.id === id ? { ...r, ...patch } : r)); }
  function updatePayout(id: string, patch: Partial<typeof MOCK_PAYOUTS[0]>) { setPayouts(p => p.map(r => r.id === id ? { ...r, ...patch } : r)); }
  function updateProposal(id: string, patch: Partial<typeof MOCK_PROPOSALS[0]>) { setProposals(p => p.map(r => r.id === id ? { ...r, ...patch } : r)); }
  function markNotificationRead(id: string) { setNotifications(p => p.map(n => n.id === id ? { ...n, read: true } : n)); }
  function markAllNotificationsRead() { setNotifications(p => p.map(n => ({ ...n, read: true }))); }

  return (
    <StoreCtx.Provider value={{
      users, lawyers, cases, transactions, payouts, refunds, disputes, reports,
      reviews, auditLogs, notifications, adminUsers, categories, proposals, appointments,
      aiSessions, updateUser, updateLawyer, updateCase, updateDispute, updateReport,
      updateReview, updateRefund, updatePayout, updateProposal, addAuditLog,
      markNotificationRead, markAllNotificationsRead, unreadCount,
    }}>
      {children}
    </StoreCtx.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error('useStore must be inside StoreProvider');
  return ctx;
}
