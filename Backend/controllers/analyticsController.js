const supabase = require('../config/supabase');

// GET /api/analytics/cases-by-type
const casesByType = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cases')
      .select('type');

    if (error) return res.status(500).json({ message: error.message });

    const counts = data.reduce((acc, c) => {
      acc[c.type] = (acc[c.type] || 0) + 1;
      return acc;
    }, {});

    res.json(Object.entries(counts).map(([type, count]) => ({ type, count })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/analytics/cases-by-district
const casesByDistrict = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cases')
      .select('district');

    if (error) return res.status(500).json({ message: error.message });

    const counts = data.reduce((acc, c) => {
      acc[c.district] = (acc[c.district] || 0) + 1;
      return acc;
    }, {});

    res.json(Object.entries(counts).map(([district, count]) => ({ district, count })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/analytics/lawyers-by-district
const lawyersByDistrict = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('lawyers')
      .select('district')
      .eq('is_verified', true);

    if (error) return res.status(500).json({ message: error.message });

    const counts = data.reduce((acc, l) => {
      acc[l.district] = (acc[l.district] || 0) + 1;
      return acc;
    }, {});

    res.json(Object.entries(counts).map(([district, count]) => ({ district, count })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { casesByType, casesByDistrict, lawyersByDistrict };