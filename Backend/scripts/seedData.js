const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const seed = async () => {
  console.log('Seeding data...');

  // Clear existing
  await supabase.from('cases').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('lawyers').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('Cleared existing data');

  const hash = async (pw) => await bcrypt.hash(pw, 10);

  // Insert all users
  const { data: users, error: userError } = await supabase
    .from('users')
    .insert([
      // Citizens
      { name: 'Ahmed Khan',   email: 'ahmed@test.com',  password: await hash('123456'), role: 'citizen', phone: '03001111111', district: 'Karachi'   },
      { name: 'Fatima Ali',   email: 'fatima@test.com', password: await hash('123456'), role: 'citizen', phone: '03002222222', district: 'Hyderabad' },
      // Lawyers
      { name: 'Sara Raza',    email: 'sara@test.com',   password: await hash('123456'), role: 'lawyer',  phone: '03004444444', district: 'Karachi'   },
      { name: 'M. Karim',     email: 'karim@test.com',  password: await hash('123456'), role: 'lawyer',  phone: '03005555555', district: 'Hyderabad' },
      // Admin
      { name: 'Admin User',   email: 'admin@test.com',  password: await hash('123456'), role: 'admin',   phone: '03009999999', district: 'Karachi'   },
    ])
    .select();

  if (userError) {
    console.error('User insert error:', userError.message);
    return;
  }
  console.log('Users created');

  // Find lawyer users
  const sara  = users.find(u => u.email === 'sara@test.com');
  const karim = users.find(u => u.email === 'karim@test.com');

  // Insert lawyer profiles
  const { error: lawyerError } = await supabase.from('lawyers').insert([
    {
      user_id: sara.id,
      sbc_number: 'SBC-4421',
      specialty: 'Property',
      district: 'Karachi',
      bio: 'Experienced in property and land disputes across Sindh.',
      experience: 8,
      is_verified: true,
      verification_status: 'approved',
      rating: 4.9,
      total_ratings: 34,
      total_cases: 42,
    },
    {
      user_id: karim.id,
      sbc_number: 'SBC-3310',
      specialty: 'Family',
      district: 'Hyderabad',
      bio: 'Specialist in family law, custody, and divorce cases.',
      experience: 6,
      is_verified: true,
      verification_status: 'approved',
      rating: 4.7,
      total_ratings: 28,
      total_cases: 31,
    },
  ]);

  if (lawyerError) {
    console.error('Lawyer insert error:', lawyerError.message);
    return;
  }
  console.log('Lawyer profiles created');

  // Find citizens
  const ahmed  = users.find(u => u.email === 'ahmed@test.com');
  const fatima = users.find(u => u.email === 'fatima@test.com');

  // Insert cases
  const { error: caseError } = await supabase.from('cases').insert([
    {
      citizen_id: ahmed.id,
      lawyer_id: sara.id,
      title: 'Property Dispute — Karachi East',
      type: 'Property',
      description: 'Boundary wall conflict with neighbor over 5 marla plot.',
      district: 'Karachi',
      court: 'Civil Court Karachi',
      status: 'active',
      hearing_date: '2025-04-24T10:00:00',
      notes: 'Documents submitted. Awaiting court date.',
    },
    {
      citizen_id: ahmed.id,
      lawyer_id: karim.id,
      title: 'Inheritance Claim — Karachi',
      type: 'Inheritance',
      description: 'Dispute over ancestral property share among siblings.',
      district: 'Karachi',
      court: 'Family Court Karachi',
      status: 'pending',
      hearing_date: '2025-05-03T10:00:00',
    },
    {
      citizen_id: fatima.id,
      lawyer_id: sara.id,
      title: 'Property Dispute — Hyderabad',
      type: 'Property',
      description: 'Land encroachment by neighbour on agricultural land.',
      district: 'Hyderabad',
      court: 'Civil Court Hyderabad',
      status: 'hearing',
      hearing_date: '2025-04-22T11:00:00',
    },
    {
      citizen_id: fatima.id,
      lawyer_id: null,
      title: 'Custody Case — Hyderabad',
      type: 'Family',
      description: 'Child custody dispute following divorce proceedings.',
      district: 'Hyderabad',
      status: 'open',
    },
  ]);

  if (caseError) {
    console.error('Case insert error:', caseError.message);
    return;
  }
  console.log('Cases created');

  console.log('\n✅ Seed complete');
  console.log('─────────────────────────────');
  console.log('All passwords: 123456');
  console.log('citizen  → ahmed@test.com');
  console.log('citizen  → fatima@test.com');
  console.log('lawyer   → sara@test.com');
  console.log('lawyer   → karim@test.com');
  console.log('admin    → admin@test.com');
  console.log('─────────────────────────────');
};

seed().catch(console.error);