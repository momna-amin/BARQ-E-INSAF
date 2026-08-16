'use strict';
const router = require('express').Router();
const supabase = require('../config/supabase');
const { protect, allowRoles } = require('../middleware/auth');

// GET /api/schedules
// Fetch schedules for a specific lawyer by lawyer ID (passed in query)
router.get('/', protect, async (req, res) => {
  try {
    const { lawyerId } = req.query;
    if (!lawyerId) {
      return res.status(400).json({ message: 'lawyerId query parameter is required' });
    }

    const { data, error } = await supabase
      .from('lawyer_schedules')
      .select('*')
      .eq('lawyer_id', lawyerId);

    if (error) return res.status(500).json({ message: error.message });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// GET /api/schedules/my
// Fetch logged-in lawyer's schedules
router.get('/my', protect, allowRoles('lawyer'), async (req, res) => {
  try {
    const { data: lawyerRow, error: le } = await supabase
      .from('lawyers')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    if (le || !lawyerRow) {
      return res.status(404).json({ message: 'Lawyer profile not found' });
    }

    const { data, error } = await supabase
      .from('lawyer_schedules')
      .select('*')
      .eq('lawyer_id', lawyerRow.id);

    if (error) return res.status(500).json({ message: error.message });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// POST /api/schedules
// Add a slot (for logged-in lawyer only)
router.post('/', protect, allowRoles('lawyer'), async (req, res) => {
  try {
    const { day, time } = req.body;
    if (!day || !time) {
      return res.status(400).json({ message: 'Day and Time are required' });
    }

    const { data: lawyerRow, error: le } = await supabase
      .from('lawyers')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    if (le || !lawyerRow) {
      return res.status(404).json({ message: 'Lawyer profile not found' });
    }

    let start_time = time;
    let end_time = time;
    if (time.includes('-')) {
      const parts = time.split('-');
      start_time = parts[0].trim();
      end_time = parts[1].trim();
    }

    const { data, error } = await supabase
      .from('lawyer_schedules')
      .insert({
        lawyer_id: lawyerRow.id,
        day_of_week: day,
        start_time,
        end_time,
        is_available: true
      })
      .select()
      .single();

    if (error) return res.status(500).json({ message: error.message });
    return res.status(201).json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// DELETE /api/schedules/:id
router.delete('/:id', protect, allowRoles('lawyer'), async (req, res) => {
  try {
    const { id } = req.params;

    const { data: lawyerRow } = await supabase
      .from('lawyers')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    if (!lawyerRow) return res.status(404).json({ message: 'Lawyer profile not found' });

    const { error } = await supabase
      .from('lawyer_schedules')
      .delete()
      .eq('id', id)
      .eq('lawyer_id', lawyerRow.id);

    if (error) return res.status(500).json({ message: error.message });
    return res.json({ message: 'Time slot deleted successfully' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
