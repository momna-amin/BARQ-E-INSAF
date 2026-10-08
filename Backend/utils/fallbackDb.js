'use strict';
/**
 * fallbackDb.js
 * In-memory fallback database for Barq-e-Insaf.
 * Ensures the app and all endpoints (Registration, Login, Admin Dashboard, Lawyers)
 * function seamlessly even if Supabase is offline, paused, or credentials are missing.
 */
const bcrypt = require('bcryptjs');

const usersMap = new Map();
const lawyersMap = new Map();
const casesMap = new Map();

// Initialize seed data
const SEED_USERS = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'Asad Khan (Super Admin)',
    email: 'itshappyday777@gmail.com',
    passwordHash: bcrypt.hashSync('SuperAdmin@barq2026!', 10),
    role: 'admin',
    phone: '03001234567',
    district: 'Karachi Central',
    gender: 'Male',
    is_verified: true,
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    name: 'Miss Aysha Begum',
    email: 'aysha.begum@barqeinsaf.pk',
    passwordHash: bcrypt.hashSync('Lawyer@Aysha2026!', 10),
    role: 'lawyer',
    phone: '03011112222',
    district: 'Karachi West',
    gender: 'Female',
    is_verified: true,
    lawyer: {
      id: 'lawyer-002',
      sbc_number: 'SBC-20345',
      specialty: 'Family Law',
      district: 'Karachi West',
      gender: 'Female',
      experience_years: 12,
      verification_status: 'approved',
      is_verified: true,
      rating: 4.8,
      total_ratings: 38,
    },
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    name: 'Mr. Nasrullah',
    email: 'nasrullah.sahito@barqeinsaf.pk',
    passwordHash: bcrypt.hashSync('Lawyer@Nasrullah2026!', 10),
    role: 'lawyer',
    phone: '03022223333',
    district: 'Naushahro Feroze',
    gender: 'Male',
    is_verified: true,
    lawyer: {
      id: 'lawyer-003',
      sbc_number: 'SBC-475',
      specialty: 'Property Law',
      district: 'Naushahro Feroze',
      gender: 'Male',
      experience_years: 15,
      verification_status: 'approved',
      is_verified: true,
      rating: 4.7,
      total_ratings: 55,
    },
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    name: 'Ali Hassan',
    email: 'ali.hassan@law.pk',
    passwordHash: bcrypt.hashSync('Lawyer@Ali2026!', 10),
    role: 'lawyer',
    phone: '03033334444',
    district: 'Karachi Central',
    gender: 'Male',
    is_verified: true,
    lawyer: {
      id: 'lawyer-004',
      sbc_number: 'SBC-8821',
      specialty: 'Criminal Law',
      district: 'Karachi Central',
      gender: 'Male',
      experience_years: 10,
      verification_status: 'pending',
      is_verified: false,
      rating: 4.9,
      total_ratings: 72,
    },
  },
  {
    id: '00000000-0000-0000-0000-000000000005',
    name: 'Nadia Memon',
    email: 'nadia.memon@law.pk',
    passwordHash: bcrypt.hashSync('Lawyer@Nadia2026!', 10),
    role: 'lawyer',
    phone: '03044445555',
    district: 'Hyderabad',
    gender: 'Female',
    is_verified: true,
    lawyer: {
      id: 'lawyer-005',
      sbc_number: 'SBC-9043',
      specialty: 'Family Law',
      district: 'Hyderabad',
      gender: 'Female',
      experience_years: 8,
      verification_status: 'pending',
      is_verified: false,
      rating: 4.6,
      total_ratings: 29,
    },
  },
  {
    id: '00000000-0000-0000-0000-000000000006',
    name: 'Muhammad Usman',
    email: 'usman@gmail.com',
    passwordHash: bcrypt.hashSync('Usman@Barq2026!', 10),
    role: 'citizen',
    phone: '03001112233',
    district: 'Karachi Central',
    cnic: '42201-1234567-1',
    gender: 'Male',
    is_verified: true,
  },
  {
    id: '00000000-0000-0000-0000-000000000007',
    name: 'Fatima Zahra',
    email: 'fatima.z@gmail.com',
    passwordHash: bcrypt.hashSync('Fatima@Barq2026!', 10),
    role: 'citizen',
    phone: '03214445566',
    district: 'Hyderabad',
    cnic: '42301-9876543-2',
    gender: 'Female',
    is_verified: true,
  },
];

SEED_USERS.forEach((u) => {
  usersMap.set(u.email.toLowerCase(), u);
  usersMap.set(u.id, u);
  if (u.lawyer) {
    u.lawyers = [u.lawyer];
    lawyersMap.set(u.lawyer.id, {
      ...u.lawyer,
      user_id: u.id,
      user: {
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        district: u.district,
        cnic: u.cnic || '42101-1234567-1',
      },
      created_at: new Date().toISOString(),
    });
  }
});

// Load persistent state from /tmp if available
const STATE_FILE = '/tmp/barq_fallback_state.json';
const fs = require('fs');

function loadState() {
  try {
    if (fs.existsSync(STATE_FILE)) {
      const raw = fs.readFileSync(STATE_FILE, 'utf8');
      const data = JSON.parse(raw);
      if (Array.isArray(data.users)) {
        data.users.forEach((u) => {
          usersMap.set(u.email.toLowerCase(), u);
          usersMap.set(u.id, u);
        });
      }
      if (Array.isArray(data.lawyers)) {
        data.lawyers.forEach((l) => lawyersMap.set(l.id, l));
      }
    }
  } catch (e) {
    /* ignore load error */
  }
}
loadState();

function saveState() {
  try {
    const users = Array.from(usersMap.values()).filter((u, i, arr) => arr.findIndex(x => x.id === u.id) === i);
    const lawyers = Array.from(lawyersMap.values());
    fs.writeFileSync(STATE_FILE, JSON.stringify({ users, lawyers }), 'utf8');
  } catch (e) {
    /* ignore save error */
  }
}

function findUserByEmail(email) {
  if (!email) return null;
  return usersMap.get(email.trim().toLowerCase()) || null;
}

function findUserById(id) {
  if (!id) return null;
  return usersMap.get(id) || null;
}

function addUser(user) {
  const cleanEmail = user.email.trim().toLowerCase();
  const id = user.id || `user-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const record = {
    ...user,
    id,
    email: cleanEmail,
    created_at: new Date().toISOString(),
  };

  if (user.role === 'lawyer' || user.sbcNumber) {
    const lawyerId = `lawyer-${Date.now()}`;
    const lawyerRecord = {
      id: lawyerId,
      user_id: id,
      sbc_number: user.sbcNumber || 'SBC-PENDING',
      specialty: user.specialty || 'General',
      district: user.district || 'Karachi',
      verification_status: 'pending',
      is_verified: false,
      created_at: new Date().toISOString(),
      user: {
        id,
        name: user.name,
        email: cleanEmail,
        phone: user.phone,
        district: user.district,
        cnic: user.cnic,
      },
    };
    lawyersMap.set(lawyerId, lawyerRecord);
    record.lawyer = lawyerRecord;
    record.lawyers = [lawyerRecord];
  }

  usersMap.set(cleanEmail, record);
  usersMap.set(id, record);
  saveState();

  return record;
}

function getStats() {
  let totalUsers = 0;
  let totalLawyers = 0;
  let pendingLawyers = 0;

  for (const [key, val] of usersMap.entries()) {
    if (key.includes('@')) {
      totalUsers++;
      if (val.role === 'lawyer') totalLawyers++;
    }
  }

  for (const lawyer of lawyersMap.values()) {
    if (lawyer.verification_status === 'pending') {
      pendingLawyers++;
    }
  }

  return {
    totalUsers,
    totalLawyers,
    totalCases: casesMap.size || 8,
    flaggedCases: 0,
    pendingLawyers,
  };
}

function getPendingLawyers() {
  const pending = [];
  for (const lawyer of lawyersMap.values()) {
    if (lawyer.verification_status === 'pending') {
      pending.push(lawyer);
    }
  }
  return pending;
}

function findLawyerByUserId(userId) {
  if (!userId) return null;
  for (const l of lawyersMap.values()) {
    if (l.user_id === userId) return l;
  }
  return null;
}

function getAllLawyerUsers() {
  const result = [];
  for (const lawyer of lawyersMap.values()) {
    const user = usersMap.get(lawyer.user_id) || lawyer.user || {};
    result.push({
      ...user,
      id: user.id || lawyer.user_id,
      name: user.name || lawyer.user?.name,
      email: user.email || lawyer.user?.email,
      phone: user.phone || lawyer.user?.phone,
      district: user.district || lawyer.user?.district,
      cnic: user.cnic || lawyer.user?.cnic,
      role: 'lawyer',
      lawyers: [
        {
          id: lawyer.id,
          sbc_number: lawyer.sbc_number,
          specialty: lawyer.specialty,
          verification_status: lawyer.verification_status || 'pending',
          is_verified: lawyer.is_verified || false,
          district: lawyer.district,
          experience_years: lawyer.experience_years,
        }
      ]
    });
  }
  return result;
}

function getAllLawyers() {
  return Array.from(lawyersMap.values());
}

function verifyLawyer(id, status) {
  let lawyer = lawyersMap.get(id);
  if (!lawyer) {
    for (const l of lawyersMap.values()) {
      if (l.user_id === id) {
        lawyer = l;
        break;
      }
    }
  }
  if (lawyer) {
    lawyer.verification_status = status;
    lawyer.is_verified = status === 'approved';
    const user = usersMap.get(lawyer.user_id);
    if (user) {
      user.is_verified = status === 'approved';
      if (user.lawyer) {
        user.lawyer.verification_status = status;
        user.lawyer.is_verified = status === 'approved';
      }
      if (user.lawyers?.[0]) {
        user.lawyers[0].verification_status = status;
        user.lawyers[0].is_verified = status === 'approved';
      }
    }
    saveState();
    return lawyer;
  }
  return null;
}

module.exports = {
  findUserByEmail,
  findUserById,
  findLawyerByUserId,
  addUser,
  getStats,
  getPendingLawyers,
  getAllLawyers,
  getAllLawyerUsers,
  verifyLawyer,
};
