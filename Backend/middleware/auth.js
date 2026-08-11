const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, role, district, phone')
        .eq('id', decoded.id)
        .single();

      if (error || !data) {
        return res.status(401).json({ message: 'User not found' });
      }

      req.user = data;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. ${req.user.role} cannot access this.`
      });
    }
    next();
  };
};

module.exports = { protect, allowRoles };