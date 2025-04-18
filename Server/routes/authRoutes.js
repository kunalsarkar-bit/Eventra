// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { login, forgotPassword, resetPassword , register } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/', register);
router.post('/logout', protect, (req, res) => {
    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(0),
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
    });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  });
  

// Example of a protected route
router.get('/me', protect, (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      id: req.user._id,
      email: req.user.email
    }
  });
});

module.exports = router;