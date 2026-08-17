import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  MOCK_USERS, MOCK_LAWYERS, MOCK_CASES,
  MOCK_DISPUTES, MOCK_REPORTS,
  MOCK_REVIEWS, MOCK_AUDIT_LOGS, MOCK_NOTIFICATIONS, MOCK_ADMIN_USERS,
  MOCK_CATEGORIES, MOCK_PROPOSALS, MOCK_APPOINTMENTS, MOCK_AI_SESSIONS,
  SINDH_CITIES, SINDH_COURTS,
} from './mock-data';

const API_BASE = 'https://barq-e-insaf.vercel.app/api';

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

  useEffect(() => {
    async function fetchRealData() {
      try {
        const [usersRes, casesRes] = await Promise.all([
          fetch(`${API_BASE}/admin/users`).catch(() => null),
          fetch(`${API_BASE}/admin/cases`).catch(() => null),
        ]);

        if (usersRes && usersRes.ok) {
          const realUsersData = await usersRes.json();
          if (Array.isArray(realUsersData) && realUsersData.length > 0) {
            const mappedUsers = realUsersData.map((u: any) => ({
              id: u.id,
              name: u.name || 'User',
              email: u.email || '',
              phone: u.phone || '',
              role: u.role || 'citizen',
              district: u.district || 'Karachi',
              status: u.is_suspended ? 'suspended' : 'active',
              cnic: u.cnic || '—',
              createdAt: u.created_at ? new Date(u.created_at).toISOString().split('T')[0] : '2026-01-01',
              casesCount: 0,
            }));
            setUsers(mappedUsers as any);

            const mappedLawyers = realUsersData.filter((u: any) => u.role === 'lawyer').map((u: any) => {
              const l = u.lawyers?.[0] || {};
              return {
                id: l.id || u.id,
                userId: u.id,
                name: u.name || 'Advocate',
                sbcNumber: l.sbc_number || 'SBC-000',
                specialty: l.specialty || 'General Practice',
                district: u.district || l.district || 'Karachi',
                experienceYears: l.experience_years || 1,
                verificationStatus: u.is_suspended ? 'suspended' : (l.verification_status || 'pending'),
                cnic: u.cnic || l.cnic || '—',
                email: u.email || '',
                phone: u.phone || '',
                rating: 4.5,
              };
            });
            if (mappedLawyers.length > 0) setLawyers(mappedLawyers as any);
          }
        }

        if (casesRes && casesRes.ok) {
          const realCasesData = await casesRes.json();
          if (Array.isArray(realCasesData) && realCasesData.length > 0) {
            const mappedCases = realCasesData.map((c: any) => ({
              id: c.id,
              title: c.title || c.type || 'Legal Case',
              category: c.type || 'Civil',
              citizenName: c.citizen?.name || 'Citizen',
              lawyerName: c.lawyer?.user?.name || 'Unassigned',
              district: c.district || 'Karachi',
              status: c.status || 'active',
              createdAt: c.created_at ? new Date(c.created_at).toISOString().split('T')[0] : '2026-01-01',
              isFlagged: !!c.is_flagged,
            }));
            setCases(mappedCases as any);
          }
        }
      } catch (err) {
        console.log('Real data fetch fallback:', err);
      }
    }
    fetchRealData();
  }, []);

  const updateUser = (id: string, patch: Partial<typeof MOCK_USERS[0]>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u)));
    if (patch.status) {
      const isSuspended = patch.status === 'suspended';
      fetch(`${API_BASE}/admin/users/${id}/suspend`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ suspended: isSuspended }),
      }).catch((e) => console.log('Suspend API error:', e.message));
    }
  };

  const updateLawyer = (id: string, patch: Partial<typeof MOCK_LAWYERS[0]>) => {
    setLawyers((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
    if (patch.verificationStatus) {
      fetch(`${API_BASE}/admin/lawyers/${id}/verify`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: patch.verificationStatus }),
      }).catch((e) => console.log('Verify Lawyer API error:', e.message));
    }
  };

  const updateCase = (id: string, patch: Partial<typeof MOCK_CASES[0]>) => {
    setCases((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  };

  const updateDispute = (id: string, patch: Partial<typeof MOCK_DISPUTES[0]>) => {
    setDisputes((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d)));
  };

  const updateReport = (id: string, patch: Partial<typeof MOCK_REPORTS[0]>) => {
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const updateReview = (id: string, patch: Partial<typeof MOCK_REVIEWS[0]>) => {
    setReviews((prev) => prev.map((rv) => (rv.id === id ? { ...rv, ...patch } : rv)));
  };

  const updateProposal = (id: string, patch: Partial<typeof MOCK_PROPOSALS[0]>) => {
    setProposals((prev) => prev.map((pr) => (pr.id === id ? { ...pr, ...patch } : pr)));
  };

  const updateAdmin = (id: string, patch: Partial<typeof MOCK_ADMIN_USERS[0]>) => {
    setAdminUsers((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  };

  const updateCity = (id: string, patch: Partial<typeof SINDH_CITIES[0]>) => {
    setCities((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  };

  const deleteCity = (id: string) => {
    setCities((prev) => prev.filter((c) => c.id !== id));
  };

  const addCity = (city: typeof SINDH_CITIES[0]) => {
    setCities((prev) => [...prev, city]);
  };

  const updateCourt = (id: string, patch: Partial<typeof SINDH_COURTS[0]>) => {
    setCourts((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  };

  const deleteCourt = (id: string) => {
    setCourts((prev) => prev.filter((c) => c.id !== id));
  };

  const addCourt = (court: typeof SINDH_COURTS[0]) => {
    setCourts((prev) => [...prev, court]);
  };

  const addAuditLog = (log: Omit<typeof MOCK_AUDIT_LOGS[0], 'id'>) => {
    const newEntry = { id: `log-${Date.now()}`, ...log };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <StoreCtx.Provider
      value={{
        users, lawyers, cases, disputes, reports, reviews, auditLogs,
        notifications, adminUsers, categories, proposals, appointments,
        aiSessions, cities, courts, updateUser, updateLawyer, updateCase,
        updateDispute, updateReport, updateReview, updateProposal, updateAdmin,
        updateCity, deleteCity, addCity, updateCourt, deleteCourt, addCourt,
        addAuditLog, markNotificationRead, markAllNotificationsRead, unreadCount,
      }}
    >
      {children}
    </StoreCtx.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
