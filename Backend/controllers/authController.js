const supabase = require('../config/supabase');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || '6A0B08FB-FD82-405B-BE80-46853142BF22', { expiresIn: '30d' });
};

// In-Memory Authentic Local User Database (Fallback / Local Sync)
const localUsersDB = [
  {
    id: 'ADMIN-001',
    name: 'Asad Khan (Super Admin)',
    email: 'admin@barqeinsaf.pk',
    passwordHash: bcrypt.hashSync('SuperAdmin@Barq2026!', 10),
    role: 'admin',
    phone: '+92 300 9990000',
    district: 'Karachi Central',
    province: 'Sindh',
    gender: 'Male',
    cnic: '42101-9999999-1',
  },
  {
    id: 'LAW-20345',
    name: 'Miss Aysha Begum',
    fatherName: 'Ata Ur Rehman',
    email: 'aysha.begum@barqeinsaf.pk',
    passwordHash: bcrypt.hashSync('Lawyer@Aysha2026!', 10),
    role: 'lawyer',
    phone: '+92 321 2034500',
    district: 'Karachi West',
    division: 'KARACHI',
    subdistrict: '0',
    province: 'Sindh',
    gender: 'Female',
    sbcNumber: '20345',
    enrollType: 'HC',
    lcDate: '24-07-2020',
    hcDate: '06-08-2022',
    specialty: 'Civil & High Court Litigation',
    status: 'Valid',
    isVerified: true,
  },
  {
    id: 'LAW-00475',
    name: 'Mr. Nasrullah',
    fatherName: 'Tahir Khan Sahito',
    email: 'nasrullah.sahito@barqeinsaf.pk',
    passwordHash: bcrypt.hashSync('Lawyer@Nasrullah2026!', 10),
    role: 'lawyer',
    phone: '+92 333 4750000',
    district: 'Naushahro Feroze',
    division: 'SUKKUR',
    subdistrict: 'Kandiaro',
    province: 'Sindh',
    gender: 'Male',
    sbcNumber: '475',
    enrollType: 'HC',
    lcDate: '08-11-2004',
    hcDate: '26-09-2011',
    specialty: 'Criminal & High Court Litigation',
    status: 'Valid',
    isVerified: true,
  },
  {
    id: 'USR-001',
    name: 'Muhammad Usman',
    email: 'usman@gmail.com',
    passwordHash: bcrypt.hashSync('Usman@Barq2026!', 10),
    role: 'citizen',
    phone: '+92 300 1112233',
    district: 'Karachi East',
    province: 'Sindh',
    gender: 'Male',
    cnic: '42201-1234567-1',
  },
  {
    id: 'USR-002',
    name: 'Fatima Zahra',
    email: 'fatima.z@gmail.com',
    passwordHash: bcrypt.hashSync('Fatima@Barq2026!', 10),
    role: 'citizen',
    phone: '+92 321 4445566',
    district: 'Hyderabad',
    province: 'Sindh',
    gender: 'Female',
    cnic: '42301-9876543-2',
  },
];

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const {
      name, email, password, role, phone, district, cnic, gender,
      sbcNumber, specialty, fatherName, division, subdistrict, enrollType, lcDate, hcDate
    } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password and role are required' });
    }

    // Check local DB
    const existingLocal = localUsersDB.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingLocal) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Try Supabase insert
    let newUser = null;
    try {
      const { data: existingSupabase } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (existingSupabase) {
        return res.status(400).json({ message: 'User already exists in Database' });
      }

      const { data: sbUser, error: sbError } = await supabase
        .from('users')
        .insert([{
          name, email, password: hashedPassword, role, phone, district,
          province: 'Sindh', gender: gender || 'Male', cnic
        }])
        .select()
        .single();

      if (!sbError && sbUser) {
        newUser = sbUser;
        if (role === 'lawyer') {
          await supabase.from('lawyers').insert([{
            user_id: sbUser.id,
            sbc_number: sbcNumber || 'SBC-TEMP',
            specialty: specialty || 'General',
            district: district || 'Karachi',
            father_name: fatherName,
            division: division || 'KARACHI',
            subdistrict: subdistrict || '0',
            gender: gender || 'Male',
            enroll_type: enrollType || 'HC',
            lc_date: lcDate,
            hc_date: hcDate,
            is_verified: true,
            verification_status: 'approved'
          }]);
        }
      }
    } catch (dbErr) {
      console.warn('Supabase offline or table missing, using local user DB fallback:', dbErr.message);
    }

    // Save to localUsersDB as well to guarantee immediate authentic authentication
    const createdRecord = {
      id: newUser ? newUser.id : `USR-${Date.now()}`,
      name,
      email,
      passwordHash: hashedPassword,
      role,
      phone,
      district: district || 'Karachi',
      province: 'Sindh',
      gender: gender || 'Male',
      cnic,
      sbcNumber,
      specialty,
      fatherName,
      division,
      subdistrict,
      enrollType,
      lcDate,
      hcDate,
    };
    localUsersDB.push(createdRecord);

    res.status(201).json({
      id: createdRecord.id,
      name: createdRecord.name,
      email: createdRecord.email,
      role: createdRecord.role,
      district: createdRecord.district,
      gender: createdRecord.gender,
      token: generateToken(createdRecord.id),
      message: 'Account registered successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Check local Users DB (seeded + dynamically registered)
    const localUser = localUsersDB.find(u => u.email.toLowerCase() === cleanEmail);
    if (localUser) {
      const isMatch = await bcrypt.compare(password, localUser.passwordHash);
      if (isMatch) {
        return res.json({
          id: localUser.id,
          name: localUser.name,
          email: localUser.email,
          role: localUser.role,
          district: localUser.district,
          gender: localUser.gender,
          token: generateToken(localUser.id),
        });
      } else {
        return res.status(401).json({ message: 'Invalid password' });
      }
    }

    // 2. Check Supabase DB
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', cleanEmail)
        .single();

      if (!error && user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          return res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            district: user.district,
            gender: user.gender,
            token: generateToken(user.id),
          });
        }
      }
    } catch (sbErr) {
      console.warn('Supabase query error:', sbErr.message);
    }

    return res.status(401).json({ message: 'Invalid credentials. User not found or incorrect password.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  res.json(req.user);
};

module.exports = { register, login, getMe, localUsersDB };