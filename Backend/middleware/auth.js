const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

const fallbackDb = require('../utils/fallbackDb');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'barq-jwt-secret-2026'
      );

      let user = null;
      try {
        if (supabase) {
          const { data, error } = await supabase
            .from('users')
            .select('id, name, email, role, district, phone')
            .eq('id', decoded.id)
            .single();

          if (!error && data) {
            user = data;
          }
        }
      } catch (dbErr) {
        // Supabase error, fall through to fallbackDb
      }

      // Check fallback database
      if (!user) {
        user = fallbackDb.findUserById(decoded.id) || fallbackDb.findUserByEmail(decoded.email);
      }

      // If still not found, construct safe user object from verified JWT token
      if (!user && decoded.id && decoded.role) {
        user = {
          id: decoded.id,
          name: decoded.name || 'User',
          email: decoded.email || 'user@barqeinsaf.pk',
          role: decoded.role,
          district: 'Sindh',
          phone: '',
        };
      }

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      req.user = user;
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