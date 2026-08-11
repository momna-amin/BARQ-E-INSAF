import React, { createContext, useContext, useState } from 'react';
import {
  MOCK_USERS, MOCK_LAWYERS, MOCK_CASES,
  MOCK_DISPUTES, MOCK_REPORTS,
  MOCK_REVIEWS, MOCK_AUDIT_LOGS, MOCK_NOTIFICATIONS, MOCK_ADMIN_USERS,
  MOCK_CATEGORIES, MOCK_PROPOSALS, MOCK_APPOINTMENTS, MOCK_AI_SESSIONS,
  SINDH_CITIES, SINDH_COURTS,
} from './mock-data';

type StoreState = {
  users: typeof MOCK_USERS;
  lawyers: typeof MOCK_LAWYERS;
  cases: typeof MOCK_CASES;
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
  cities: typeof SINDH_CITIES;
  courts: typeof SINDH_COURTS;
  // actions
  updateUser: (id: string, patch: Partial<typeof MOCK_USERS[0]>) => void;
  updateLawyer: (id: string, patch: Partial<typeof MOCK_LAWYERS[0]>) => void;
  updateCase: (id: string, patch: Partial<typeof MOCK_CASES[0]>) => void;
  updateDispute: (id: string, patch: Partial<typeof MOCK_DISPUTES[0]>) => void;
  updateReport: (id: string, patch: Partial<typeof MOCK_REPORTS[0]>) => void;
  updateReview: (id: string, patch: Partial<typeof MOCK_REVIEWS[0]>) => void;
  updateProposal: (id: string, patch: Partial<typeof MOCK_PROPOSALS[0]>) => void;
  updateAdmin: (id: string, patch: Partial<typeof MOCK_ADMIN_USERS[0]>) => void;
  updateCity: (id: string, patch: Partial<typeof SINDH_CITIES[0]>) => void;
  deleteCity: (id: string) => void;
  addCity: (city: typeof SINDH_CITIES[0]) => void;
  updateCourt: (id: string, patch: Partial<typeof SINDH_COURTS[0]>) => void;
  deleteCourt: (id: string) => void;
  addCourt: (court: typeof SINDH_COURTS[0]) => void;
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
  const [disputes, setDisputes] = useState(MOCK_DISPUTES);
  const [reports, setReports] = useState(MOCK_REPORTS);
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [auditLogs, setAuditLogs] = useState(MOCK_AUDIT_LOGS);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [adminUsers, setAdminUsers] = useState(MOCK_ADMIN_USERS);
  const [categories] = useState(MOCK_CATEGORIES);
  const [proposals, setProposals] = useState(MOCK_PROPOSALS);
  const [appointments] = useState(MOCK_APPOINTMENTS);
  const [aiSessions] = useState(MOCK_AI_SESSIONS);
  const [cities, setCities] = useState(SINDH_CITIES);
  const [courts, setCourts] = useState(SINDH_COURTS);

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
  function updateCase(id: string, patch: Partial<typeof MOCK_CASES[0]>) { setCases(p => p.map(c => c.id === id ? ({ ...c, ...patch } as any) : c)); }
  function updateDispute(id: string, patch: Partial<typeof MOCK_DISPUTES[0]>) { setDisputes(p => p.map(d => d.id === id ? { ...d, ...patch } : d)); }
  function updateReport(id: string, patch: Partial<typeof MOCK_REPORTS[0]>) { setReports(p => p.map(r => r.id === id ? { ...r, ...patch } : r)); }
  function updateReview(id: string, patch: Partial<typeof MOCK_REVIEWS[0]>) { setReviews(p => p.map(r => r.id === id ? { ...r, ...patch } : r)); }
  function updateProposal(id: string, patch: Partial<typeof MOCK_PROPOSALS[0]>) { setProposals(p => p.map(r => r.id === id ? { ...r, ...patch } : r)); }
  function updateAdmin(id: string, patch: Partial<typeof MOCK_ADMIN_USERS[0]>) { setAdminUsers(p => p.map(a => a.id === id ? { ...a, ...patch } : a)); }
  function updateCity(id: string, patch: Partial<typeof SINDH_CITIES[0]>) { setCities(p => p.map(c => c.id === id ? { ...c, ...patch } : c)); }
  function deleteCity(id: string) { setCities(p => p.filter(c => c.id !== id)); }
  function addCity(city: typeof SINDH_CITIES[0]) { setCities(p => [...p, city]); }
  function updateCourt(id: string, patch: Partial<typeof SINDH_COURTS[0]>) { setCourts(p => p.map(c => c.id === id ? { ...c, ...patch } : c)); }
  function deleteCourt(id: string) { setCourts(p => p.filter(c => c.id !== id)); }
  function addCourt(court: typeof SINDH_COURTS[0]) { setCourts(p => [...p, court]); }
  function markNotificationRead(id: string) { setNotifications(p => p.map(n => n.id === id ? { ...n, read: true } : n)); }
  function markAllNotificationsRead() { setNotifications(p => p.map(n => ({ ...n, read: true }))); }

  return (
    <StoreCtx.Provider value={{
      users, lawyers, cases, disputes, reports,
      reviews, auditLogs, notifications, adminUsers, categories, proposals, appointments,
      aiSessions, cities, courts,
      updateUser, updateLawyer, updateCase, updateDispute, updateReport,
      updateReview, updateProposal, updateAdmin,
      updateCity, deleteCity, addCity, updateCourt, deleteCourt, addCourt,
      addAuditLog, markNotificationRead, markAllNotificationsRead, unreadCount,
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
