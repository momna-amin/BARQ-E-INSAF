const supabase = require('../config/supabase');

// POST /api/cases
const createCase = async (req, res) => {
  try {
    const { title, type, description, district, court } = req.body;

    const { data, error } = await supabase
      .from('cases')
      .insert([{
        citizen_id: req.user.id,
        title, type, description, district, court,
      }])
      .select()
      .single();

    if (error) return res.status(500).json({ message: error.message });
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/cases/my
const getMyCases = async (req, res) => {
  try {
    let query = supabase.from('cases');

    if (req.user.role === 'lawyer') {
      const { data: lawyerRow, error: le } = await supabase
        .from('lawyers')
        .select('id')
        .eq('user_id', req.user.id)
        .single();

      if (le || !lawyerRow) {
        return res.status(404).json({ message: 'Lawyer profile not found' });
      }

      query = query
        .select('*, citizen:citizen_id(id, name, email, phone)')
        .eq('lawyer_id', lawyerRow.id);
    } else {
      query = query
        .select('*, lawyer:lawyer_id(id, user:user_id(name, email))')
        .eq('citizen_id', req.user.id);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) return res.status(500).json({ message: error.message });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/cases/:id
const getCaseById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cases')
      .select('*, citizen:citizen_id(id, name, email, phone), lawyer:lawyer_id(id, user:user_id(name, email))')
      .eq('id', req.params.id)
      .single();

    if (error) return res.status(404).json({ message: 'Case not found' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/cases/:id/status
const updateCaseStatus = async (req, res) => {
  try {
    const { status, hearing_date, notes } = req.body;

    const { data, error } = await supabase
      .from('cases')
      .update({ status, hearing_date, notes })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) return res.status(500).json({ message: error.message });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/cases/:id/assign
const assignLawyer = async (req, res) => {
  try {
    const { lawyerId } = req.body;

    const { data, error } = await supabase
      .from('cases')
      .update({ lawyer_id: lawyerId, status: 'active' })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) return res.status(500).json({ message: error.message });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/cases/:id
const updateCase = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { data, error } = await supabase
      .from('cases')
      .update({ title, description })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) return res.status(500).json({ message: error.message });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createCase, getMyCases, getCaseById, updateCaseStatus, assignLawyer, updateCase };