// theme/tokens.ts — exact colors/fonts matching globals.css
export const colors = {
  brand: '#5C1A1A',
  brandLight: '#8b2121',
  brandBlue: '#0F2744',
  glow: '#A4F4FD',
  glow2: '#00d2ff',
  bg: '#0c0c0c',
  bgCard: 'rgba(255,255,255,0.02)',
  bgHeader: '#0a0a0a',
  border: 'rgba(255,255,255,0.06)',
  borderStrong: 'rgba(255,255,255,0.08)',
  white: '#ffffff',
  textPrimary: 'rgba(255,255,255,0.9)',
  textSecondary: 'rgba(255,255,255,0.5)',
  textMuted: 'rgba(255,255,255,0.3)',
  textFaint: 'rgba(255,255,255,0.25)',
};

export const badge = {
  active:    { bg: 'rgba(74,222,128,0.15)',  fg: '#4ade80',  border: 'rgba(74,222,128,0.2)' },
  pending:   { bg: 'rgba(251,191,36,0.15)',  fg: '#fbbf24',  border: 'rgba(251,191,36,0.2)' },
  suspended: { bg: 'rgba(239,68,68,0.15)',   fg: '#ef4444',  border: 'rgba(239,68,68,0.2)' },
  verified:  { bg: 'rgba(59,130,246,0.15)',  fg: '#60a5fa',  border: 'rgba(59,130,246,0.2)' },
  rejected:  { bg: 'rgba(239,68,68,0.15)',   fg: '#ef4444',  border: 'rgba(239,68,68,0.2)' },
  completed: { bg: 'rgba(16,185,129,0.15)',  fg: '#34d399',  border: 'rgba(16,185,129,0.2)' },
  draft:     { bg: 'rgba(156,163,175,0.15)', fg: '#9ca3af',  border: 'rgba(156,163,175,0.2)' },
  disputed:  { bg: 'rgba(245,158,11,0.15)',  fg: '#f59e0b',  border: 'rgba(245,158,11,0.2)' },
  paid:      { bg: 'rgba(16,185,129,0.15)',  fg: '#34d399',  border: 'rgba(16,185,129,0.2)' },
  failed:    { bg: 'rgba(239,68,68,0.15)',   fg: '#ef4444',  border: 'rgba(239,68,68,0.2)' },
} as const;

export const statusToBadge: Record<string, keyof typeof badge> = {
  Active: 'active', Verified: 'verified', Completed: 'completed', Paid: 'paid',
  Approved: 'active', Published: 'active', Accepted: 'active', Success: 'active', Resolved: 'completed',
  Pending: 'pending', 'Under Review': 'pending', Submitted: 'pending', Scheduled: 'pending',
  New: 'pending', Processing: 'pending', Investigating: 'pending', Matching: 'pending', 'Waiting for Info': 'pending',
  'On Hold': 'pending', 'Case Created': 'completed',
  Suspended: 'suspended', Rejected: 'rejected', Failed: 'failed', Cancelled: 'suspended',
  Dismissed: 'suspended', Escalated: 'suspended',
  Draft: 'draft', Inactive: 'draft', Abandoned: 'draft', 'No-show': 'draft',
  Flagged: 'disputed', Disputed: 'disputed', Open: 'disputed',
};

export const radius = { sm: 8, md: 12, lg: 16, xl: 20, pill: 999 };
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24 };

export const typography = {
  h1: { fontSize: 20, fontWeight: '700' as const, color: '#fff' },
  h3: { fontSize: 14, fontWeight: '700' as const, color: '#fff' },
  body: { fontSize: 13, fontWeight: '500' as const, color: 'rgba(255,255,255,0.5)' },
  label: { fontSize: 9, fontWeight: '700' as const, letterSpacing: 1.2, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' as const },
  kpiValue: { fontSize: 24, fontWeight: '700' as const, color: '#fff' },
};

export const gradients = {
  brand: [colors.brand, colors.brandLight] as [string, string],
  brandGlass: ['rgba(164,244,253,0.3)', 'rgba(92,26,26,0.2)', 'rgba(0,210,255,0.1)'] as [string, string, string],
};
