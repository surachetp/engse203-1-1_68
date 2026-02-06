// middleware/validateUser.js
const validateUser = (req, res, next) => {
  const { name, email, role } = req.body;

  // name
  if (!name || typeof name !== 'string') {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Name is required and must be a string'
      }
    });
  }

  // email
  if (!email || !email.includes('@')) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Valid email is required'
      }
    });
  }

  // role (optional)
  if (role && !['admin', 'user'].includes(role)) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Role must be admin or user'
      }
    });
  }

  next(); // ผ่าน validation
};

module.exports = validateUser;
