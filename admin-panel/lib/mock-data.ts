// ─── Types ────────────────────────────────────────────────────────────────────
export type UserStatus = 'Active' | 'Suspended' | 'Inactive' | 'Deleted';
export type LawyerStatus = 'Pending' | 'Under Review' | 'Verified' | 'Rejected' | 'Suspended' | 'Expired';
export type CaseStatus = 'Draft' | 'Submitted' | 'Matching' | 'Active' | 'On Hold' | 'Completed' | 'Cancelled' | 'Disputed';
export type PaymentStatus = 'Pending' | 'Success' | 'Failed' | 'Refunded';
export type DisputeStatus = 'Open' | 'Under Review' | 'Waiting for Info' | 'Resolved' | 'Rejected' | 'Escalated';
export type ReportStatus = 'New' | 'Investigating' | 'Resolved' | 'Dismissed';
export type AdminRole = 'SUPER_ADMIN' | 'VERIFICATION_ADMIN' | 'SUPPORT_ADMIN' | 'FINANCE_ADMIN' | 'CONTENT_ADMIN' | 'MODERATION_ADMIN' | 'ANALYTICS_ADMIN';

// ─── Users ────────────────────────────────────────────────────────────────────
export const MOCK_USERS = [
  { id: 'USR-001', name: 'Muhammad Usman', email: 'usman@gmail.com', phone: '+92 300 1112233', city: 'Karachi', status: 'Active' as UserStatus, cases: 5, registeredOn: '2024-01-05', lastLogin: '2026-08-09T10:22:00Z', cnic: '42201-1234567-1', province: 'Sindh' },
  { id: 'USR-002', name: 'Fatima Zahra', email: 'fatima.z@gmail.com', phone: '+92 321 4445566', city: 'Lahore', status: 'Active' as UserStatus, cases: 2, registeredOn: '2024-02-14', lastLogin: '2026-08-08T08:00:00Z', cnic: '35202-9876543-2', province: 'Punjab' },
  { id: 'USR-003', name: 'Rizwan Akhtar', email: 'rizwan.a@yahoo.com', phone: '+92 333 7778899', city: 'Peshawar', status: 'Suspended' as UserStatus, cases: 8, registeredOn: '2024-03-20', lastLogin: '2026-08-04T12:00:00Z', cnic: '37405-5556677-3', province: 'KPK' },
  { id: 'USR-004', name: 'Ayesha Siddiqui', email: 'ayesha.s@hotmail.com', phone: '+92 311 2223344', city: 'Hyderabad', status: 'Active' as UserStatus, cases: 1, registeredOn: '2024-04-02', lastLogin: '2026-08-09T07:30:00Z', cnic: '42301-3334455-4', province: 'Sindh' },
  { id: 'USR-005', name: 'Kamran Mirza', email: 'kamran.m@gmail.com', phone: '+92 345 6667788', city: 'Faisalabad', status: 'Inactive' as UserStatus, cases: 3, registeredOn: '2023-11-09', lastLogin: '2026-07-26T09:00:00Z', cnic: '35101-6667788-5', province: 'Punjab' },
  { id: 'USR-006', name: 'Sara Malik', email: 'sara.malik@gmail.com', phone: '+92 300 9990011', city: 'Karachi', status: 'Active' as UserStatus, cases: 0, registeredOn: '2024-06-01', lastLogin: '2026-08-09T11:55:00Z', cnic: '42201-9990011-6', province: 'Sindh' },
  { id: 'USR-007', name: 'Hassan Raza', email: 'hassan.r@outlook.com', phone: '+92 315 1234567', city: 'Islamabad', status: 'Active' as UserStatus, cases: 4, registeredOn: '2024-01-22', lastLogin: '2026-08-07T14:20:00Z', cnic: '61101-2233445-7', province: 'Federal' },
  { id: 'USR-008', name: 'Zainab Ali', email: 'zainab.ali@gmail.com', phone: '+92 322 9988776', city: 'Multan', status: 'Active' as UserStatus, cases: 2, registeredOn: '2024-03-10', lastLogin: '2026-08-09T09:10:00Z', cnic: '36302-8877665-8', province: 'Punjab' },
  { id: 'USR-009', name: 'Omar Farooq', email: 'omar.f@gmail.com', phone: '+92 333 4455667', city: 'Quetta', status: 'Suspended' as UserStatus, cases: 1, registeredOn: '2024-05-15', lastLogin: '2026-07-20T08:00:00Z', cnic: '54400-3344556-9', province: 'Balochistan' },
  { id: 'USR-010', name: 'Nadia Hussain', email: 'nadia.h@gmail.com', phone: '+92 300 7766554', city: 'Karachi', status: 'Active' as UserStatus, cases: 6, registeredOn: '2023-12-01', lastLogin: '2026-08-09T12:00:00Z', cnic: '42101-7766554-0', province: 'Sindh' },
];

// ─── Lawyers ──────────────────────────────────────────────────────────────────
export const MOCK_LAWYERS = [
  { id: 'LAW-001', name: 'Ali Hassan', email: 'ali.hassan@law.pk', phone: '+92 300 1234567', city: 'Karachi', specialty: 'Criminal', experience: 12, license: 'SBC-8821', barCouncil: 'Sindh Bar Council', status: 'Verified' as LawyerStatus, rating: 4.5, cases: 148, fee: 5000, registeredOn: '2024-01-12', photo: null },
  { id: 'LAW-002', name: 'Nadia Memon', email: 'nadia.memon@law.pk', phone: '+92 321 9876543', city: 'Lahore', specialty: 'Family', experience: 8, license: 'PBC-9043', barCouncil: 'Punjab Bar Council', status: 'Verified' as LawyerStatus, rating: 4.8, cases: 95, fee: 3500, registeredOn: '2024-03-05', photo: null },
  { id: 'LAW-003', name: 'Tariq Shah', email: 'tariq.shah@law.pk', phone: '+92 333 5556677', city: 'Islamabad', specialty: 'Civil', experience: 18, license: 'IHC-7711', barCouncil: 'IHC Bar Association', status: 'Verified' as LawyerStatus, rating: 4.2, cases: 220, fee: 8000, registeredOn: '2024-02-18', photo: null },
  { id: 'LAW-004', name: 'Sara Qureshi', email: 'sara.q@law.pk', phone: '+92 311 7778899', city: 'Karachi', specialty: 'Corporate', experience: 6, license: 'SBC-6620', barCouncil: 'Sindh Bar Council', status: 'Pending' as LawyerStatus, rating: 0, cases: 0, fee: 4000, registeredOn: '2024-04-01', photo: null },
  { id: 'LAW-005', name: 'Bilal Chaudhry', email: 'bilal.c@law.pk', phone: '+92 345 3334455', city: 'Faisalabad', specialty: 'Tax', experience: 14, license: 'PBC-5530', barCouncil: 'Punjab Bar Council', status: 'Suspended' as LawyerStatus, rating: 3.1, cases: 110, fee: 6000, registeredOn: '2023-12-22', photo: null },
  { id: 'LAW-006', name: 'Hina Baig', email: 'hina.baig@law.pk', phone: '+92 300 6667788', city: 'Karachi', specialty: 'Property', experience: 10, license: 'SBC-4411', barCouncil: 'Sindh Bar Council', status: 'Verified' as LawyerStatus, rating: 4.6, cases: 75, fee: 4500, registeredOn: '2023-11-10', photo: null },
  { id: 'LAW-007', name: 'Imran Baig', email: 'imran.b@law.pk', phone: '+92 321 1122334', city: 'Peshawar', specialty: 'Criminal', experience: 9, license: 'KPK-3301', barCouncil: 'KPK Bar Council', status: 'Pending' as LawyerStatus, rating: 0, cases: 0, fee: 3000, registeredOn: '2026-08-01', photo: null },
  { id: 'LAW-008', name: 'Samina Akhtar', email: 'samina.a@law.pk', phone: '+92 300 4455667', city: 'Multan', specialty: 'Family', experience: 11, license: 'PBC-2211', barCouncil: 'Punjab Bar Council', status: 'Under Review' as LawyerStatus, rating: 0, cases: 0, fee: 4000, registeredOn: '2026-07-28', photo: null },
  { id: 'LAW-009', name: 'Farhan Siddiqui', email: 'farhan.s@law.pk', phone: '+92 333 8899001', city: 'Hyderabad', specialty: 'Civil', experience: 5, license: 'SBC-1100', barCouncil: 'Sindh Bar Council', status: 'Pending' as LawyerStatus, rating: 0, cases: 0, fee: 2500, registeredOn: '2026-08-05', photo: null },
  { id: 'LAW-010', name: 'Rabia Nawaz', email: 'rabia.n@law.pk', phone: '+92 315 2233445', city: 'Quetta', specialty: 'Property', experience: 7, license: 'BAL-0991', barCouncil: 'Balochistan Bar Council', status: 'Rejected' as LawyerStatus, rating: 0, cases: 0, fee: 3000, registeredOn: '2024-06-10', photo: null },
];

// ─── Cases ────────────────────────────────────────────────────────────────────
export const MOCK_CASES = [
  { id: 'BI-2026-000101', client: 'Muhammad Usman', clientId: 'USR-001', lawyer: 'Ali Hassan', lawyerId: 'LAW-001', category: 'Criminal', subcategory: 'Theft', district: 'Karachi Central', status: 'Active' as CaseStatus, created: '2026-01-15', updated: '2026-08-01' },
  { id: 'BI-2026-000102', client: 'Fatima Zahra', clientId: 'USR-002', lawyer: 'Nadia Memon', lawyerId: 'LAW-002', category: 'Family', subcategory: 'Divorce', district: 'Lahore', status: 'Completed' as CaseStatus, created: '2026-02-10', updated: '2026-07-15' },
  { id: 'BI-2026-000103', client: 'Rizwan Akhtar', clientId: 'USR-003', lawyer: 'Tariq Shah', lawyerId: 'LAW-003', category: 'Property', subcategory: 'Inheritance', district: 'Peshawar', status: 'Disputed' as CaseStatus, created: '2026-03-05', updated: '2026-08-08' },
  { id: 'BI-2026-000104', client: 'Ayesha Siddiqui', clientId: 'USR-004', lawyer: null, lawyerId: null, category: 'Civil', subcategory: 'Tenancy', district: 'Hyderabad', status: 'Matching' as CaseStatus, created: '2026-04-12', updated: '2026-08-09' },
  { id: 'BI-2026-000105', client: 'Kamran Mirza', clientId: 'USR-005', lawyer: 'Bilal Chaudhry', lawyerId: 'LAW-005', category: 'Tax', subcategory: 'Tax Evasion', district: 'Faisalabad', status: 'Cancelled' as CaseStatus, created: '2025-11-20', updated: '2026-01-10' },
  { id: 'BI-2026-000106', client: 'Sara Malik', clientId: 'USR-006', lawyer: 'Hina Baig', lawyerId: 'LAW-006', category: 'Property', subcategory: 'Title Dispute', district: 'Karachi South', status: 'Active' as CaseStatus, created: '2026-06-01', updated: '2026-08-09' },
  { id: 'BI-2026-000107', client: 'Hassan Raza', clientId: 'USR-007', lawyer: 'Ali Hassan', lawyerId: 'LAW-001', category: 'Criminal', subcategory: 'Fraud', district: 'Islamabad', status: 'Active' as CaseStatus, created: '2026-05-22', updated: '2026-08-07' },
  { id: 'BI-2026-000108', client: 'Zainab Ali', clientId: 'USR-008', lawyer: 'Nadia Memon', lawyerId: 'LAW-002', category: 'Family', subcategory: 'Custody', district: 'Multan', status: 'Submitted' as CaseStatus, created: '2026-08-01', updated: '2026-08-09' },
];

// ─── Payments / Transactions ──────────────────────────────────────────────────
export const MOCK_TRANSACTIONS = [
  { id: 'TXN-001', caseId: 'BI-2026-000101', client: 'Muhammad Usman', lawyer: 'Ali Hassan', amount: 25000, platformFee: 2500, status: 'Success' as PaymentStatus, method: 'JazzCash', date: '2026-01-20', gatewayRef: 'JC-9988001' },
  { id: 'TXN-002', caseId: 'BI-2026-000102', client: 'Fatima Zahra', lawyer: 'Nadia Memon', amount: 17500, platformFee: 1750, status: 'Success' as PaymentStatus, method: 'EasyPaisa', date: '2026-02-15', gatewayRef: 'EP-1122334' },
  { id: 'TXN-003', caseId: 'BI-2026-000103', client: 'Rizwan Akhtar', lawyer: 'Tariq Shah', amount: 40000, platformFee: 4000, status: 'Refunded' as PaymentStatus, method: 'Bank Transfer', date: '2026-03-10', gatewayRef: 'BT-5566778' },
  { id: 'TXN-004', caseId: 'BI-2026-000104', client: 'Ayesha Siddiqui', lawyer: '-', amount: 5000, platformFee: 500, status: 'Pending' as PaymentStatus, method: 'JazzCash', date: '2026-08-09', gatewayRef: 'JC-0000101' },
  { id: 'TXN-005', caseId: 'BI-2026-000106', client: 'Sara Malik', lawyer: 'Hina Baig', amount: 22500, platformFee: 2250, status: 'Success' as PaymentStatus, method: 'EasyPaisa', date: '2026-06-05', gatewayRef: 'EP-8899001' },
  { id: 'TXN-006', caseId: 'BI-2026-000107', client: 'Hassan Raza', lawyer: 'Ali Hassan', amount: 25000, platformFee: 2500, status: 'Failed' as PaymentStatus, method: 'Bank Transfer', date: '2026-05-25', gatewayRef: 'BT-FAILED01' },
];

export const MOCK_PAYOUTS = [
  { id: 'PAY-001', lawyer: 'Ali Hassan', lawyerId: 'LAW-001', period: 'Jul 2026', amountDue: 45000, amountPaid: 45000, status: 'Paid', paidOn: '2026-08-05' },
  { id: 'PAY-002', lawyer: 'Nadia Memon', lawyerId: 'LAW-002', period: 'Jul 2026', amountDue: 31500, amountPaid: 0, status: 'Pending', paidOn: null },
  { id: 'PAY-003', lawyer: 'Hina Baig', lawyerId: 'LAW-006', period: 'Jul 2026', amountDue: 20250, amountPaid: 0, status: 'Pending', paidOn: null },
  { id: 'PAY-004', lawyer: 'Tariq Shah', lawyerId: 'LAW-003', period: 'Jun 2026', amountDue: 36000, amountPaid: 36000, status: 'Paid', paidOn: '2026-07-08' },
];

export const MOCK_REFUNDS = [
  { id: 'REF-001', txnId: 'TXN-003', caseId: 'BI-2026-000103', client: 'Rizwan Akhtar', amount: 40000, reason: 'Case cancelled due to lawyer misconduct', status: 'Processed', requestedOn: '2026-03-12', resolvedOn: '2026-03-15' },
  { id: 'REF-002', txnId: 'TXN-006', caseId: 'BI-2026-000107', client: 'Hassan Raza', amount: 25000, reason: 'Payment failed but charged', status: 'Approved', requestedOn: '2026-05-26', resolvedOn: null },
];

// ─── Disputes ─────────────────────────────────────────────────────────────────
export const MOCK_DISPUTES = [
  { id: 'DIS-001', caseId: 'BI-2026-000103', raisedBy: 'Client', raisedById: 'USR-003', reason: 'Lawyer did not appear for scheduled hearing without notice', status: 'Open' as DisputeStatus, opened: '2026-08-08', age: 1 },
  { id: 'DIS-002', caseId: 'BI-2026-000101', raisedBy: 'Client', raisedById: 'USR-001', reason: 'Overcharging — billed for work not done', status: 'Under Review' as DisputeStatus, opened: '2026-07-20', age: 20 },
  { id: 'DIS-003', caseId: 'BI-2026-000106', raisedBy: 'Lawyer', raisedById: 'LAW-006', reason: 'Client refusing to pay agreed fee after services rendered', status: 'Resolved' as DisputeStatus, opened: '2026-07-01', age: 39 },
];

export const MOCK_REPORTS = [
  { id: 'RPT-001', type: 'Lawyer', reportedEntity: 'Bilal Chaudhry', reportedBy: 'Kamran Mirza', reason: 'Harassment during consultation', status: 'New' as ReportStatus, date: '2026-08-09' },
  { id: 'RPT-002', type: 'Review', reportedEntity: 'Review #REV-019', reportedBy: 'Hina Baig', reason: 'Fake review — user never engaged services', status: 'Investigating' as ReportStatus, date: '2026-08-07' },
  { id: 'RPT-003', type: 'Fraud', reportedEntity: 'Rizwan Akhtar', reportedBy: 'System', reason: 'Multiple accounts detected from same CNIC', status: 'Investigating' as ReportStatus, date: '2026-08-05' },
];

export const MOCK_REVIEWS = [
  { id: 'REV-001', reviewer: 'Muhammad Usman', lawyer: 'Ali Hassan', rating: 5, snippet: 'Excellent service, handled my case professionally.', status: 'Published', date: '2026-07-10' },
  { id: 'REV-002', reviewer: 'Anonymous', lawyer: 'Bilal Chaudhry', rating: 1, snippet: 'Never showed up, waste of money.', status: 'Flagged', date: '2026-08-01' },
  { id: 'REV-003', reviewer: 'Fatima Zahra', lawyer: 'Nadia Memon', rating: 5, snippet: 'Very professional, resolved family matter with great care.', status: 'Published', date: '2026-07-20' },
];

// ─── Audit Logs ───────────────────────────────────────────────────────────────
export const MOCK_AUDIT_LOGS = [
  { id: 'AUD-001', actor: 'Super Admin', action: 'lawyer.approved', entityType: 'Lawyer', entityId: 'LAW-001', ip: '192.168.1.1', timestamp: '2026-08-09T10:15:00Z', details: 'Lawyer Ali Hassan verified after document review' },
  { id: 'AUD-002', actor: 'Support Admin', action: 'user.suspended', entityType: 'User', entityId: 'USR-003', ip: '192.168.1.2', timestamp: '2026-08-09T09:30:00Z', details: 'Reason: Multiple fraud complaints from different users' },
  { id: 'AUD-003', actor: 'Super Admin', action: 'lawyer.rejected', entityType: 'Lawyer', entityId: 'LAW-010', ip: '192.168.1.1', timestamp: '2026-08-08T14:22:00Z', details: 'Rejected: Invalid bar license number submitted' },
  { id: 'AUD-004', actor: 'Finance Admin', action: 'refund.approved', entityType: 'Refund', entityId: 'REF-001', ip: '192.168.1.3', timestamp: '2026-08-07T11:00:00Z', details: 'Refund approved for case BI-2026-000103' },
  { id: 'AUD-005', actor: 'Moderation Admin', action: 'review.removed', entityType: 'Review', entityId: 'REV-002', ip: '192.168.1.4', timestamp: '2026-08-07T09:15:00Z', details: 'Removed: Fake review violating community guidelines' },
  { id: 'AUD-006', actor: 'Super Admin', action: 'admin_user.invited', entityType: 'AdminUser', entityId: 'ADM-004', ip: '192.168.1.1', timestamp: '2026-08-06T16:30:00Z', details: 'Invited finance.admin@barqeinsaf.pk as FINANCE_ADMIN' },
  { id: 'AUD-007', actor: 'Support Admin', action: 'dispute.assigned', entityType: 'Dispute', entityId: 'DIS-001', ip: '192.168.1.2', timestamp: '2026-08-08T08:45:00Z', details: 'Dispute DIS-001 self-assigned for investigation' },
];

// ─── Notifications ────────────────────────────────────────────────────────────
export const MOCK_NOTIFICATIONS = [
  { id: 'NOT-001', type: 'Verification', title: 'New Lawyer Verification Request', message: 'Imran Baig (LAW-007) submitted documents for verification', entityId: 'LAW-007', entityType: 'Lawyer', read: false, createdAt: '2026-08-09T11:30:00Z' },
  { id: 'NOT-002', type: 'Dispute', title: 'New Dispute Opened', message: 'Rizwan Akhtar opened dispute DIS-001 against Tariq Shah', entityId: 'DIS-001', entityType: 'Dispute', read: false, createdAt: '2026-08-08T08:00:00Z' },
  { id: 'NOT-003', type: 'Cases', title: 'Case Status Changed to Disputed', message: 'Case BI-2026-000103 has been flagged as disputed', entityId: 'BI-2026-000103', entityType: 'Case', read: true, createdAt: '2026-08-08T07:45:00Z' },
  { id: 'NOT-004', type: 'Payments', title: 'Payment Failed', message: 'Transaction TXN-006 failed for Hassan Raza', entityId: 'TXN-006', entityType: 'Transaction', read: false, createdAt: '2026-05-25T10:00:00Z' },
  { id: 'NOT-005', type: 'System', title: 'System Health: All Services Normal', message: 'API uptime 99.8% | Database connections: 12/50', entityId: null, entityType: 'System', read: true, createdAt: '2026-08-09T06:00:00Z' },
];

// ─── Admin Users ──────────────────────────────────────────────────────────────
export const MOCK_ADMIN_USERS = [
  { id: 'ADM-001', name: 'Asad Khan', email: 'admin@barqeinsaf.pk', role: 'SUPER_ADMIN' as AdminRole, status: 'Active', lastLogin: '2026-08-09T12:00:00Z', twoFA: true },
  { id: 'ADM-002', name: 'Sarah Rehman', email: 'verification@barqeinsaf.pk', role: 'VERIFICATION_ADMIN' as AdminRole, status: 'Active', lastLogin: '2026-08-09T09:30:00Z', twoFA: true },
  { id: 'ADM-003', name: 'Junaid Ahmed', email: 'support@barqeinsaf.pk', role: 'SUPPORT_ADMIN' as AdminRole, status: 'Active', lastLogin: '2026-08-08T16:20:00Z', twoFA: false },
  { id: 'ADM-004', name: 'Mehreen Butt', email: 'finance@barqeinsaf.pk', role: 'FINANCE_ADMIN' as AdminRole, status: 'Active', lastLogin: '2026-08-07T11:00:00Z', twoFA: true },
  { id: 'ADM-005', name: 'Tariq Mehmood', email: 'content@barqeinsaf.pk', role: 'CONTENT_ADMIN' as AdminRole, status: 'Suspended', lastLogin: '2026-07-01T09:00:00Z', twoFA: false },
];

// ─── Categories ───────────────────────────────────────────────────────────────
export const MOCK_CATEGORIES = [
  { id: 'CAT-001', nameEn: 'Criminal Law', nameUr: 'فوجداری قانون', slug: 'criminal-law', lawyers: 84, cases: 412, active: true, order: 1 },
  { id: 'CAT-002', nameEn: 'Family Law', nameUr: 'خاندانی قانون', slug: 'family-law', lawyers: 62, cases: 338, active: true, order: 2 },
  { id: 'CAT-003', nameEn: 'Property Law', nameUr: 'جائیداد کا قانون', slug: 'property-law', lawyers: 71, cases: 290, active: true, order: 3 },
  { id: 'CAT-004', nameEn: 'Civil Law', nameUr: 'سول قانون', slug: 'civil-law', lawyers: 55, cases: 201, active: true, order: 4 },
  { id: 'CAT-005', nameEn: 'Corporate Law', nameUr: 'کارپوریٹ قانون', slug: 'corporate-law', lawyers: 28, cases: 89, active: true, order: 5 },
  { id: 'CAT-006', nameEn: 'Tax Law', nameUr: 'ٹیکس قانون', slug: 'tax-law', lawyers: 19, cases: 67, active: true, order: 6 },
  { id: 'CAT-007', nameEn: 'Constitutional Law', nameUr: 'آئینی قانون', slug: 'constitutional-law', lawyers: 12, cases: 24, active: false, order: 7 },
];

// ─── Proposals ────────────────────────────────────────────────────────────────
export const MOCK_PROPOSALS = [
  { id: 'PRP-001', caseId: 'BI-2026-000104', lawyer: 'Ali Hassan', client: 'Ayesha Siddiqui', fee: 15000, status: 'Submitted', submitted: '2026-08-09', flagged: false },
  { id: 'PRP-002', caseId: 'BI-2026-000108', lawyer: 'Nadia Memon', client: 'Zainab Ali', fee: 12000, status: 'Accepted', submitted: '2026-08-02', flagged: false },
  { id: 'PRP-003', caseId: 'BI-2026-000101', lawyer: 'Hina Baig', client: 'Muhammad Usman', fee: 50000, status: 'Rejected', submitted: '2026-01-14', flagged: true },
];

// ─── Appointments ─────────────────────────────────────────────────────────────
export const MOCK_APPOINTMENTS = [
  { id: 'APT-001', caseId: 'BI-2026-000101', client: 'Muhammad Usman', lawyer: 'Ali Hassan', date: '2026-08-10T15:00:00Z', type: 'Online', status: 'Scheduled' },
  { id: 'APT-002', caseId: 'BI-2026-000102', client: 'Fatima Zahra', lawyer: 'Nadia Memon', date: '2026-07-15T10:00:00Z', type: 'In-person', status: 'Completed' },
  { id: 'APT-003', caseId: 'BI-2026-000103', client: 'Rizwan Akhtar', lawyer: 'Tariq Shah', date: '2026-07-01T11:00:00Z', type: 'Online', status: 'No-show' },
  { id: 'APT-004', caseId: 'BI-2026-000106', client: 'Sara Malik', lawyer: 'Hina Baig', date: '2026-08-12T14:00:00Z', type: 'In-person', status: 'Scheduled' },
];

// ─── Dashboard KPIs ───────────────────────────────────────────────────────────
export const DASHBOARD_KPI = {
  totalUsers: 2841,
  usersChange: '+142',
  totalLawyers: 284,
  lawyersChange: '+12',
  verifiedLawyers: 217,
  verifiedChange: '+8',
  activeCases: 1094,
  activeCasesChange: '+88',
  completedCases: 3220,
  completedChange: '+156',
  revenueThisMonth: 1284000,
  revenueChange: '+23%',
};

export const CASES_BY_STATUS = [
  { name: 'Draft', value: 120 },
  { name: 'Submitted', value: 89 },
  { name: 'Matching', value: 67 },
  { name: 'Active', value: 1094 },
  { name: 'Completed', value: 3220 },
  { name: 'Cancelled', value: 204 },
  { name: 'Disputed', value: 31 },
];

export const CASES_BY_CATEGORY = [
  { name: 'Criminal', value: 412, color: '#ef4444' },
  { name: 'Family', value: 338, color: '#f59e0b' },
  { name: 'Property', value: 290, color: '#3b82f6' },
  { name: 'Civil', value: 201, color: '#8b5cf6' },
  { name: 'Corporate', value: 89, color: '#06b6d4' },
  { name: 'Tax', value: 67, color: '#10b981' },
];

export const CASES_BY_DISTRICT = [
  { district: 'Karachi Central', cases: 284 },
  { district: 'Lahore', cases: 241 },
  { district: 'Islamabad', cases: 198 },
  { district: 'Karachi South', cases: 167 },
  { district: 'Peshawar', cases: 143 },
  { district: 'Faisalabad', cases: 121 },
  { district: 'Multan', cases: 98 },
  { district: 'Hyderabad', cases: 87 },
  { district: 'Quetta', cases: 76 },
  { district: 'Rawalpindi', cases: 65 },
];

export const LAWYER_VERIFICATION_FUNNEL = [
  { stage: 'Pending', count: 12 },
  { stage: 'Under Review', count: 4 },
  { stage: 'Verified', count: 217 },
  { stage: 'Rejected', count: 51 },
];

export const PLATFORM_GROWTH = [
  { month: 'Jan', users: 2100, lawyers: 198, cases: 812 },
  { month: 'Feb', users: 2280, lawyers: 210, cases: 889 },
  { month: 'Mar', users: 2390, lawyers: 223, cases: 934 },
  { month: 'Apr', users: 2510, lawyers: 241, cases: 978 },
  { month: 'May', users: 2620, lawyers: 256, cases: 1020 },
  { month: 'Jun', users: 2700, lawyers: 268, cases: 1055 },
  { month: 'Jul', users: 2780, lawyers: 278, cases: 1078 },
  { month: 'Aug', users: 2841, lawyers: 284, cases: 1094 },
];

// ─── AI Sessions ──────────────────────────────────────────────────────────────
export const MOCK_AI_SESSIONS = [
  { id: 'AIS-001', user: 'Muhammad Usman', caseCreated: 'BI-2026-000101', messages: 12, outcome: 'Case Created', started: '2026-01-15T09:00:00Z', ended: '2026-01-15T09:18:00Z' },
  { id: 'AIS-002', user: 'Anonymous', caseCreated: null, messages: 4, outcome: 'Abandoned', started: '2026-08-09T08:00:00Z', ended: '2026-08-09T08:05:00Z' },
  { id: 'AIS-003', user: 'Zainab Ali', caseCreated: 'BI-2026-000108', messages: 18, outcome: 'Case Created', started: '2026-08-01T10:30:00Z', ended: '2026-08-01T10:55:00Z' },
];
