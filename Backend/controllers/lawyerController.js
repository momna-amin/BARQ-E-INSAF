const supabase = require('../config/supabase');

// GET /api/lawyers
const getLawyers = async (req, res) => {
  try {
    let query = supabase
      .from('lawyers')
      .select('*, user:user_id(id, name, email, phone)')
      .eq('is_verified', true);

    if (req.query.specialty) query = query.eq('specialty', req.query.specialty);
    if (req.query.district)  query = query.eq('district',  req.query.district);

    const { data, error } = await query;
    if (error) return res.status(500).json({ message: error.message });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/lawyers/:id
const getLawyerById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('lawyers')
      .select('*, user:user_id(id, name, email, phone)')
      .eq('id', req.params.id)
      .single();

    if (error) return res.status(404).json({ message: 'Lawyer not found' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/lawyers/:id/rate
const rateLawyer = async (req, res) => {
  try {
    const { rating } = req.body;

    const { data: lawyer, error } = await supabase
      .from('lawyers')
      .select('rating, total_ratings')
      .eq('id', req.params.id)
      .single();

    if (error) return res.status(404).json({ message: 'Lawyer not found' });

    const newTotal  = lawyer.total_ratings + 1;
    const newRating = ((lawyer.rating * lawyer.total_ratings) + rating) / newTotal;

    const { data, error: updateError } = await supabase
      .from('lawyers')
      .update({
        rating: Math.round(newRating * 10) / 10,
        total_ratings: newTotal,
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (updateError) return res.status(500).json({ message: updateError.message });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getLawyers, getLawyerById, rateLawyer };