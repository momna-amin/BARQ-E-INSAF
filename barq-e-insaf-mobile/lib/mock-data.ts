// ─── Types ────────────────────────────────────────────────────────────────────
export type UserStatus = 'Active' | 'Suspended' | 'Inactive' | 'Deleted';
export type LawyerStatus = 'Pending' | 'Under Review' | 'Verified' | 'Rejected' | 'Suspended' | 'Expired';
export type CaseStatus = 'Draft' | 'Submitted' | 'Matching' | 'Active' | 'On Hold' | 'Completed' | 'Cancelled' | 'Disputed';
export type DisputeStatus = 'Open' | 'Under Review' | 'Waiting for Info' | 'Resolved' | 'Rejected' | 'Escalated';
export type ReportStatus = 'New' | 'Investigating' | 'Resolved' | 'Dismissed';
export type GenderType = 'Male' | 'Female';

// ─── Users (Authentic Sindh Records) ─────────────────────────────────────────
export const MOCK_USERS = [
  { id: 'USR-001', name: 'Muhammad Usman', email: 'usman@gmail.com', phone: '+92 300 1112233', city: 'Karachi Central', gender: 'Male' as GenderType, status: 'Active' as UserStatus, cases: 5, registeredOn: '2024-01-05', lastLogin: '2026-08-09T10:22:00Z', cnic: '42201-1234567-1', province: 'Sindh' },
  { id: 'USR-002', name: 'Fatima Zahra', email: 'fatima.z@gmail.com', phone: '+92 321 4445566', city: 'Hyderabad', gender: 'Female' as GenderType, status: 'Active' as UserStatus, cases: 2, registeredOn: '2024-02-14', lastLogin: '2026-08-08T08:00:00Z', cnic: '42301-9876543-2', province: 'Sindh' },
  { id: 'USR-003', name: 'Rizwan Akhtar', email: 'rizwan.a@yahoo.com', phone: '+92 333 7778899', city: 'Sukkur', gender: 'Male' as GenderType, status: 'Suspended' as UserStatus, cases: 8, registeredOn: '2024-03-20', lastLogin: '2026-08-04T12:00:00Z', cnic: '45205-5556677-3', province: 'Sindh' },
  { id: 'USR-004', name: 'Ayesha Siddiqui', email: 'ayesha.s@hotmail.com', phone: '+92 311 2223344', city: 'Hyderabad', gender: 'Female' as GenderType, status: 'Active' as UserStatus, cases: 1, registeredOn: '2024-04-02', lastLogin: '2026-08-09T07:30:00Z', cnic: '42301-3334455-4', province: 'Sindh' },
  { id: 'USR-005', name: 'Kamran Mirza', email: 'kamran.m@gmail.com', phone: '+92 345 6667788', city: 'Larkana', gender: 'Male' as GenderType, status: 'Inactive' as UserStatus, cases: 3, registeredOn: '2023-11-09', lastLogin: '2026-07-26T09:00:00Z', cnic: '43101-6667788-5', province: 'Sindh' },
  { id: 'USR-006', name: 'Sara Malik', email: 'sara.malik@gmail.com', phone: '+92 300 9990011', city: 'Karachi South', gender: 'Female' as GenderType, status: 'Active' as UserStatus, cases: 0, registeredOn: '2024-06-01', lastLogin: '2026-08-09T11:55:00Z', cnic: '42201-9990011-6', province: 'Sindh' },
  { id: 'USR-007', name: 'Hassan Raza', email: 'hassan.r@outlook.com', phone: '+92 315 1234567', city: 'Nawabshah', gender: 'Male' as GenderType, status: 'Active' as UserStatus, cases: 4, registeredOn: '2024-01-22', lastLogin: '2026-08-07T14:20:00Z', cnic: '44101-2233445-7', province: 'Sindh' },
  { id: 'USR-008', name: 'Zainab Ali', email: 'zainab.ali@gmail.com', phone: '+92 322 9988776', city: 'Mirpur Khas', gender: 'Female' as GenderType, status: 'Active' as UserStatus, cases: 2, registeredOn: '2024-03-10', lastLogin: '2026-08-09T09:10:00Z', cnic: '44302-8877665-8', province: 'Sindh' },
];

// ─── Lawyers (Includes Official SBC Verified Records from Documents) ─────────
export const MOCK_LAWYERS = [
  {
    id: 'LAW-20345',
    name: 'Miss Aysha Begum',
    fatherName: 'Ata Ur Rehman',
    email: 'aysha.begum@barqeinsaf.pk',
    phone: '+92 321 2034500',
    city: 'Karachi West',
    division: 'KARACHI',
    district: 'Karachi West',
    subdistrict: '0',
    specialty: 'High Court Civil & Property',
    experience: 6,
    license: 'SBC-20345',
    barCouncil: 'Sindh Bar Council',
    enrollType: 'HC',
    lcDate: '24-07-2020',
    hcDate: '06-08-2022',
    gender: 'Female' as GenderType,
    status: 'Verified' as LawyerStatus,
    rating: 4.9,
    cases: 112,
    registeredOn: '2020-07-24',
    photo: null,
  },
  {
    id: 'LAW-00475',
    name: 'Mr. Nasrullah',
    fatherName: 'Tahir Khan Sahito',
    email: 'nasrullah.sahito@barqeinsaf.pk',
    phone: '+92 333 4750000',
    city: 'Naushahro Feroze',
    division: 'SUKKUR',
    district: 'Naushahro Feroze',
    subdistrict: 'Kandiaro',
    specialty: 'Criminal & High Court Litigation',
    experience: 22,
    license: 'SBC-475',
    barCouncil: 'Sindh Bar Council',
    enrollType: 'HC',
    lcDate: '08-11-2004',
    hcDate: '26-09-2011',
    gender: 'Male' as GenderType,
    status: 'Verified' as LawyerStatus,
    rating: 4.8,
    cases: 340,
    registeredOn: '2004-11-08',
    photo: null,
  },
  {
    id: 'LAW-001',
    name: 'Ali Hassan',
    fatherName: 'Hassan Mahmood',
    email: 'ali.hassan@law.pk',
    phone: '+92 300 1234567',
    city: 'Karachi Central',
    division: 'KARACHI',
    district: 'Karachi Central',
    subdistrict: 'Gulberg',
    specialty: 'Criminal Law',
    experience: 12,
    license: 'SBC-8821',
    barCouncil: 'Sindh Bar Council',
    enrollType: 'HC',
    lcDate: '12-01-2012',
    hcDate: '15-03-2015',
    gender: 'Male' as GenderType,
    status: 'Verified' as LawyerStatus,
    rating: 4.5,
    cases: 148,
    registeredOn: '2024-01-12',
    photo: null,
  },
  {
    id: 'LAW-002',
    name: 'Nadia Memon',
    fatherName: 'Ghulam Qadir Memon',
    email: 'nadia.memon@law.pk',
    phone: '+92 321 9876543',
    city: 'Hyderabad',
    division: 'HYDERABAD',
    district: 'Hyderabad',
    subdistrict: 'Latifabad',
    specialty: 'Family Law',
    experience: 8,
    license: 'SBC-9043',
    barCouncil: 'Sindh Bar Council',
    enrollType: 'HC',
    lcDate: '05-03-2016',
    hcDate: '10-06-2018',
    gender: 'Female' as GenderType,
    status: 'Verified' as LawyerStatus,
    rating: 4.8,
    cases: 95,
    registeredOn: '2024-03-05',
    photo: null,
  },
  {
    id: 'LAW-003',
    name: 'Tariq Shah',
    fatherName: 'Syed Ahmed Shah',
    email: 'tariq.shah@law.pk',
    phone: '+92 333 5556677',
    city: 'Sukkur',
    division: 'SUKKUR',
    district: 'Sukkur',
    subdistrict: 'City',
    specialty: 'Civil Law',
    experience: 18,
    license: 'SBC-7711',
    barCouncil: 'Sindh Bar Council',
    enrollType: 'HC',
    lcDate: '18-02-2006',
    hcDate: '20-05-2009',
    gender: 'Male' as GenderType,
    status: 'Verified' as LawyerStatus,
    rating: 4.2,
    cases: 220,
    registeredOn: '2024-02-18',
    photo: null,
  },
  {
    id: 'LAW-004',
    name: 'Sara Qureshi',
    fatherName: ' Tariq Qureshi',
    email: 'sara.q@law.pk',
    phone: '+92 311 7778899',
    city: 'Karachi East',
    division: 'KARACHI',
    district: 'Karachi East',
    subdistrict: 'Jamshed',
    specialty: 'Corporate Law',
    experience: 6,
    license: 'SBC-6620',
    barCouncil: 'Sindh Bar Council',
    enrollType: 'LC',
    lcDate: '01-04-2018',
    hcDate: 'Pending',
    gender: 'Female' as GenderType,
    status: 'Pending' as LawyerStatus,
    rating: 0,
    cases: 0,
    registeredOn: '2024-04-01',
    photo: null,
  },
  {
    id: 'LAW-005',
    name: 'Bilal Chaudhry',
    fatherName: 'Chaudhry Riaz',
    email: 'bilal.c@law.pk',
    phone: '+92 345 3334455',
    city: 'Larkana',
    division: 'LARKANA',
    district: 'Larkana',
    subdistrict: 'Ratodero',
    specialty: 'Tax Law',
    experience: 14,
    license: 'SBC-5530',
    barCouncil: 'Sindh Bar Council',
    enrollType: 'HC',
    lcDate: '22-12-2010',
    hcDate: '15-01-2013',
    gender: 'Male' as GenderType,
    status: 'Suspended' as LawyerStatus,
    rating: 3.1,
    cases: 110,
    registeredOn: '2023-12-22',
    photo: null,
  },
];

// ─── Cases ────────────────────────────────────────────────────────────────────
export const MOCK_CASES = [
  { id: 'BI-2026-000101', client: 'Muhammad Usman', clientId: 'USR-001', lawyer: 'Miss Aysha Begum', lawyerId: 'LAW-20345', category: 'Civil', subcategory: 'Property Dispute', district: 'Karachi West', status: 'Active' as CaseStatus, created: '2026-01-15', updated: '2026-08-01' },
  { id: 'BI-2026-000102', client: 'Fatima Zahra', clientId: 'USR-002', lawyer: 'Nadia Memon', lawyerId: 'LAW-002', category: 'Family', subcategory: 'Divorce', district: 'Hyderabad', status: 'Completed' as CaseStatus, created: '2026-02-10', updated: '2026-07-15' },
  { id: 'BI-2026-000103', client: 'Rizwan Akhtar', clientId: 'USR-003', lawyer: 'Mr. Nasrullah', lawyerId: 'LAW-00475', category: 'Criminal', subcategory: 'Bail & High Court', district: 'Naushahro Feroze', status: 'Disputed' as CaseStatus, created: '2026-03-05', updated: '2026-08-08' },
  { id: 'BI-2026-000104', client: 'Ayesha Siddiqui', clientId: 'USR-004', lawyer: null, lawyerId: null, category: 'Civil', subcategory: 'Tenancy', district: 'Hyderabad', status: 'Matching' as CaseStatus, created: '2026-04-12', updated: '2026-08-09' },
  { id: 'BI-2026-000105', client: 'Kamran Mirza', clientId: 'USR-005', lawyer: 'Bilal Chaudhry', lawyerId: 'LAW-005', category: 'Tax', subcategory: 'Tax Evasion', district: 'Larkana', status: 'Cancelled' as CaseStatus, created: '2025-11-20', updated: '2026-01-10' },
];

// ─── Disputes ─────────────────────────────────────────────────────────────────
export const MOCK_DISPUTES = [
  { id: 'DIS-001', caseId: 'BI-2026-000103', raisedBy: 'Client', raisedById: 'USR-003', reason: 'Lawyer did not appear for scheduled hearing without notice', status: 'Open' as DisputeStatus, opened: '2026-08-08', age: 1 },
  { id: 'DIS-002', caseId: 'BI-2026-000101', raisedBy: 'Client', raisedById: 'USR-001', reason: 'Overcharging — billed for work not done', status: 'Under Review' as DisputeStatus, opened: '2026-07-20', age: 20 },
];

export const MOCK_REPORTS = [
  { id: 'RPT-001', type: 'Lawyer', reportedEntity: 'Bilal Chaudhry', reportedBy: 'Kamran Mirza', reason: 'Harassment during consultation', status: 'New' as ReportStatus, date: '2026-08-09' },
  { id: 'RPT-002', type: 'Fraud', reportedEntity: 'Rizwan Akhtar', reportedBy: 'System', reason: 'Multiple accounts detected from same CNIC', status: 'Investigating' as ReportStatus, date: '2026-08-05' },
];

export const MOCK_REVIEWS = [
  { id: 'REV-001', reviewer: 'Muhammad Usman', lawyer: 'Miss Aysha Begum', rating: 5, snippet: 'Outstanding High Court representation by Miss Aysha Begum.', status: 'Published', date: '2026-07-10' },
  { id: 'REV-002', reviewer: 'Rizwan Akhtar', lawyer: 'Mr. Nasrullah', rating: 5, snippet: 'Highly competent senior advocate in Naushahro Feroze.', status: 'Published', date: '2026-08-01' },
];

// ─── Audit Logs ───────────────────────────────────────────────────────────────
export const MOCK_AUDIT_LOGS = [
  { id: 'AUD-001', actor: 'Super Admin', action: 'lawyer.verified', entityType: 'Lawyer', entityId: 'LAW-20345', ip: '192.168.1.1', timestamp: '2026-08-09T10:15:00Z', details: 'Lawyer Miss Aysha Begum SBC-20345 verified after document review' },
  { id: 'AUD-002', actor: 'Super Admin', action: 'lawyer.verified', entityType: 'Lawyer', entityId: 'LAW-00475', ip: '192.168.1.1', timestamp: '2026-08-09T09:30:00Z', details: 'Lawyer Mr. Nasrullah SBC-475 verified after bar council check' },
];

// ─── Notifications ────────────────────────────────────────────────────────────
export const MOCK_NOTIFICATIONS = [
  { id: 'NOT-001', type: 'Verification', title: 'SBC Advocate Record Verified', message: 'Miss Aysha Begum (SBC-20345) & Mr. Nasrullah (SBC-475) added as verified High Court advocates', entityId: 'LAW-20345', entityType: 'Lawyer', read: false, createdAt: '2026-08-09T11:30:00Z' },
];

// ─── Admin Users (Single Fixed Super Admin Only) ──────────────────────────────
export const MOCK_ADMIN_USERS = [
  { id: 'ADM-001', name: 'Asad Khan (Super Admin)', email: 'admin@barqeinsaf.pk', status: 'Active', lastLogin: '2026-08-09T12:00:00Z', twoFA: true, gender: 'Male' },
];

// ─── Categories ───────────────────────────────────────────────────────────────
export const MOCK_CATEGORIES = [
  { id: 'CAT-001', nameEn: 'Criminal Law', nameUr: 'فوجداری قانون', slug: 'criminal-law', lawyers: 84, cases: 412, active: true, order: 1 },
  { id: 'CAT-002', nameEn: 'Family Law', nameUr: 'خاندانی قانون', slug: 'family-law', lawyers: 62, cases: 338, active: true, order: 2 },
  { id: 'CAT-003', nameEn: 'Property Law', nameUr: 'جائیداد کا قانون', slug: 'property-law', lawyers: 71, cases: 290, active: true, order: 3 },
  { id: 'CAT-004', nameEn: 'Civil Law', nameUr: 'سول قانون', slug: 'civil-law', lawyers: 55, cases: 201, active: true, order: 4 },
  { id: 'CAT-005', nameEn: 'Corporate Law', nameUr: 'کارپوریٹ قانون', slug: 'corporate-law', lawyers: 28, cases: 89, active: true, order: 5 },
  { id: 'CAT-006', nameEn: 'Tax Law', nameUr: 'ٹیکس قانون', slug: 'tax-law', lawyers: 19, cases: 67, active: true, order: 6 },
];

// ─── Proposals ────────────────────────────────────────────────────────────────
export const MOCK_PROPOSALS = [
  { id: 'PRP-001', caseId: 'BI-2026-000104', lawyer: 'Miss Aysha Begum', client: 'Ayesha Siddiqui', status: 'Submitted', submitted: '2026-08-09', flagged: false },
];

// ─── Appointments ─────────────────────────────────────────────────────────────
export const MOCK_APPOINTMENTS = [
  { id: 'APT-001', caseId: 'BI-2026-000101', client: 'Muhammad Usman', lawyer: 'Miss Aysha Begum', date: '2026-08-10T15:00:00Z', type: 'Online', status: 'Scheduled' },
];

// ─── Dashboard KPIs ───────────────────────────────────────────────────────────
export const DASHBOARD_KPI = {
  totalUsers: 1420,
  usersChange: '+142',
  totalLawyers: 284,
  lawyersChange: '+12',
  verifiedLawyers: 217,
  verifiedChange: '+8',
  activeCases: 1094,
  activeCasesChange: '+88',
  completedCases: 3220,
  completedChange: '+156',
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
  { district: 'Hyderabad', cases: 241 },
  { district: 'Karachi South', cases: 198 },
  { district: 'Sukkur', cases: 167 },
  { district: 'Larkana', cases: 143 },
  { district: 'Naushahro Feroze', cases: 121 },
  { district: 'Mirpur Khas', cases: 98 },
  { district: 'Thatta', cases: 87 },
  { district: 'Badin', cases: 76 },
  { district: 'Dadu', cases: 65 },
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

export const MOCK_AI_SESSIONS = [
  { id: 'AIS-001', user: 'Muhammad Usman', caseCreated: 'BI-2026-000101', messages: 12, outcome: 'Case Created', started: '2026-01-15T09:00:00Z', ended: '2026-01-15T09:18:00Z' },
];

// ─── Sindh Locations ONLY (Non-Sindh locations removed) ─────────────────────
export const SINDH_CITIES = [
  { id: 'LOC-01', nameEn: 'Karachi Central', province: 'Sindh', courts: 12, lawyers: 142 },
  { id: 'LOC-02', nameEn: 'Karachi East', province: 'Sindh', courts: 10, lawyers: 110 },
  { id: 'LOC-03', nameEn: 'Karachi South', province: 'Sindh', courts: 15, lawyers: 165 },
  { id: 'LOC-04', nameEn: 'Karachi West', province: 'Sindh', courts: 8, lawyers: 88 },
  { id: 'LOC-05', nameEn: 'Hyderabad', province: 'Sindh', courts: 8, lawyers: 78 },
  { id: 'LOC-06', nameEn: 'Sukkur', province: 'Sindh', courts: 6, lawyers: 52 },
  { id: 'LOC-07', nameEn: 'Larkana', province: 'Sindh', courts: 5, lawyers: 41 },
  { id: 'LOC-08', nameEn: 'Naushahro Feroze', province: 'Sindh', courts: 4, lawyers: 33 },
  { id: 'LOC-09', nameEn: 'Mirpur Khas', province: 'Sindh', courts: 4, lawyers: 29 },
  { id: 'LOC-10', nameEn: 'Khairpur', province: 'Sindh', courts: 4, lawyers: 24 },
  { id: 'LOC-11', nameEn: 'Thatta', province: 'Sindh', courts: 3, lawyers: 14 },
  { id: 'LOC-12', nameEn: 'Badin', province: 'Sindh', courts: 3, lawyers: 12 },
  { id: 'LOC-13', nameEn: 'Dadu', province: 'Sindh', courts: 3, lawyers: 15 },
  { id: 'LOC-14', nameEn: 'Jamshoro', province: 'Sindh', courts: 3, lawyers: 11 },
];

export const SINDH_COURTS = [
  { id: 'CRT-01', name: 'Sindh High Court (Karachi Bench)', city: 'Karachi', type: 'High Court', judges: 22 },
  { id: 'CRT-02', name: 'Sindh High Court (Hyderabad Circuit)', city: 'Hyderabad', type: 'High Court Circuit', judges: 8 },
  { id: 'CRT-03', name: 'Sindh High Court (Sukkur Circuit)', city: 'Sukkur', type: 'High Court Circuit', judges: 6 },
  { id: 'CRT-04', name: 'District & Sessions Court Karachi West', city: 'Karachi West', type: 'District Court', judges: 14 },
  { id: 'CRT-05', name: 'District & Sessions Court Naushahro Feroze', city: 'Naushahro Feroze', type: 'District Court', judges: 6 },
];
