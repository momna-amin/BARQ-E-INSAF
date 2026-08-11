'use strict';
/**
 * seed.js — Barq-e-Insaf Database Seeder
 * Run with: node scripts/seed.js
 *
 * Seeds ALL demo accounts from the specification:
 *  - Super Admin
 *  - 4 SBC Verified Lawyers
 *  - 2 Citizens
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const SALT_ROUNDS = 10;

// ── All seed accounts ────────────────────────────────────────────────────────
const users = [
  // ── Super Admin
  {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'Asad Khan (Super Admin)',
    email: 'admin@barqeinsaf.pk',
    password: 'SuperAdmin@barq2026!',
    role: 'admin',
    phone: '03001234567',
    district: 'Karachi Central',
    gender: 'Male',
  },
  // ── SBC Verified Lawyers
  {
    id: '00000000-0000-0000-0000-000000000002',
    name: 'Miss Aysha Begum',
    email: 'aysha.begum@barqeinsaf.pk',
    password: 'Lawyer@Aysha2026!',
    role: 'lawyer',
    phone: '03011112222',
    district: 'Karachi West',
    gender: 'Female',
    lawyer: {
      sbc_number: 'SBC-20345',
      specialty: 'Family Law',
      district: 'Karachi West',
      gender: 'Female',
      father_name: 'Ata Ur Rehman',
      bio: 'Senior advocate specializing in Family Law and Khula cases with 12+ years experience.',
      rating: 4.8,
      total_ratings: 38,
    },
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    name: 'Mr. Nasrullah',
    email: 'nasrullah.sahito@barqeinsaf.pk',
    password: 'Lawyer@Nasrullah2026!',
    role: 'lawyer',
    phone: '03022223333',
    district: 'Naushahro Feroze',
    gender: 'Male',
    lawyer: {
      sbc_number: 'SBC-475',
      specialty: 'Property Law',
      district: 'Naushahro Feroze',
      gender: 'Male',
      father_name: 'Tahir Khan Sahito',
      bio: 'Property Law expert with expertise in Sindh Land Revenue Act and inheritance disputes.',
      rating: 4.7,
      total_ratings: 55,
    },
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    name: 'Ali Hassan',
    email: 'ali.hassan@law.pk',
    password: 'Lawyer@Ali2026!',
    role: 'lawyer',
    phone: '03033334444',
    district: 'Karachi Central',
    gender: 'Male',
    lawyer: {
      sbc_number: 'SBC-8821',
      specialty: 'Criminal Law',
      district: 'Karachi Central',
      gender: 'Male',
      father_name: 'Hassan Mahmood',
      bio: 'High Court advocate specializing in Criminal Law with 10+ years in Karachi courts.',
      rating: 4.9,
      total_ratings: 72,
    },
  },
  {
    id: '00000000-0000-0000-0000-000000000005',
    name: 'Nadia Memon',
    email: 'nadia.memon@law.pk',
    password: 'Lawyer@Nadia2026!',
    role: 'lawyer',
    phone: '03044445555',
    district: 'Hyderabad',
    gender: 'Female',
    lawyer: {
      sbc_number: 'SBC-9043',
      specialty: 'Family Law',
      district: 'Hyderabad',
      gender: 'Female',
      father_name: 'Ghulam Qadir Memon',
      bio: 'Advocate specializing in Family Law, Custody, and Khula cases in Hyderabad.',
      rating: 4.6,
      total_ratings: 29,
    },
  },
  // ── Citizens
  {
    id: '00000000-0000-0000-0000-000000000006',
    name: 'Muhammad Usman',
    email: 'usman@gmail.com',
    password: 'Usman@Barq2026!',
    role: 'citizen',
    phone: '03001112233',
    district: 'Karachi Central',
    cnic: '42201-1234567-1',
    gender: 'Male',
  },
  {
    id: '00000000-0000-0000-0000-000000000007',
    name: 'Fatima Zahra',
    email: 'fatima.z@gmail.com',
    password: 'Fatima@Barq2026!',
    role: 'citizen',
    phone: '03214445566',
    district: 'Hyderabad',
    cnic: '42301-9876543-2',
    gender: 'Female',
  },
];

// ── Runner ───────────────────────────────────────────────────────────────────
async function seed() {
  console.log('\n🌱 Starting Barq-e-Insaf Database Seeder...\n');
  let successCount = 0;

  for (const user of users) {
    try {
      const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);

      // Upsert user (insert or update on conflict)
      const { data: savedUser, error: userError } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          name: user.name,
          email: user.email.toLowerCase(),
          password: hashedPassword,
          role: user.role,
          phone: user.phone,
          district: user.district,
          cnic: user.cnic || null,
          gender: user.gender || null,
          is_verified: true,
          provider: 'email',
        }, { onConflict: 'email' })
        .select()
        .single();

      if (userError) {
        console.error(`❌ User failed [${user.email}]:`, userError.message);
        continue;
      }

      console.log(`✅ User saved: ${user.name} <${user.email}> [${user.role}]`);

      // If lawyer, also upsert lawyer profile
      if (user.lawyer && savedUser) {
        const { error: lawyerError } = await supabase
          .from('lawyers')
          .upsert({
            user_id: savedUser.id,
            sbc_number: user.lawyer.sbc_number,
            specialty: user.lawyer.specialty,
            district: user.lawyer.district,
            gender: user.lawyer.gender,
            father_name: user.lawyer.father_name,
            bio: user.lawyer.bio,
            rating: user.lawyer.rating,
            total_ratings: user.lawyer.total_ratings,
            is_verified: true,
            verification_status: 'approved',
          }, { onConflict: 'user_id' });

        if (lawyerError) {
          console.error(`  ⚠️  Lawyer profile error [${user.email}]:`, lawyerError.message);
        } else {
          console.log(`   ↳ Lawyer profile: ${user.lawyer.sbc_number} | ${user.lawyer.specialty}`);
        }
      }

      successCount++;
    } catch (err) {
      console.error(`💥 Unexpected error for ${user.email}:`, err.message);
    }
  }

  console.log(`\n🎉 Seeding complete! ${successCount}/${users.length} accounts created.\n`);
  console.log('📋 LOGIN CREDENTIALS:');
  console.log('─────────────────────────────────────────────────────────');
  console.log('ADMIN:');
  console.log('  Email: admin@barqeinsaf.pk   | Password: SuperAdmin@barq2026!');
  console.log('\nLAWYERS:');
  console.log('  Email: aysha.begum@barqeinsaf.pk   | Password: Lawyer@Aysha2026!');
  console.log('  Email: nasrullah.sahito@barqeinsaf.pk | Password: Lawyer@Nasrullah2026!');
  console.log('  Email: ali.hassan@law.pk         | Password: Lawyer@Ali2026!');
  console.log('  Email: nadia.memon@law.pk        | Password: Lawyer@Nadia2026!');
  console.log('\nCITIZENS:');
  console.log('  Email: usman@gmail.com   | Password: Usman@Barq2026!');
  console.log('  Email: fatima.z@gmail.com | Password: Fatima@Barq2026!');
  console.log('─────────────────────────────────────────────────────────\n');

  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeder crashed:', err);
  process.exit(1);
});
