const supabase = require('../config/supabase');

// GET /api/admin/stats
const getStats = async (req, res) => {
  try {
    const [users, lawyers, cases, flagged, pending] = await Promise.all([
      supabase.from('users').select('id', { count: 'exact', head: true }),
      supabase.from('lawyers').select('id', { count: 'exact', head: true }).eq('is_verified', true),
      supabase.from('cases').select('id', { count: 'exact', head: true }),
      supabase.from('cases').select('id', { count: 'exact', head: true }).eq('is_flagged', true),
      supabase.from('lawyers').select('id', { count: 'exact', head: true }).eq('verification_status', 'pending'),
    ]);

    res.json({
      totalUsers:     users.count,
      totalLawyers:   lawyers.count,
      totalCases:     cases.count,
      flaggedCases:   flagged.count,
      pendingLawyers: pending.count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/admin/pending-lawyers
const getPendingLawyers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('lawyers')
      .select('*, user:user_id(id, name, email, phone)')
      .eq('verification_status', 'pending');

    if (error) return res.status(500).json({ message: error.message });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/admin/lawyers/:id/verify
const verifyLawyer = async (req, res) => {
  try {
    const { status } = req.body;

    const { data, error } = await supabase
      .from('lawyers')
      .update({
        verification_status: status,
        is_verified: status === 'approved',
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) return res.status(500).json({ message: error.message });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/admin/flagged-cases
const getFlaggedCases = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cases')
      .select('*, citizen:citizen_id(id, name, email)')
      .eq('is_flagged', true);

    if (error) return res.status(500).json({ message: error.message });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStats, getPendingLawyers, verifyLawyer, getFlaggedCases };