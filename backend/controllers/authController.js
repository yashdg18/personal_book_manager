const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('../utils/asyncHandler');
const {
  validateRegisterInput,
  validateLoginInput,
} = require('../validators/authValidator');

// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const errors = validateRegisterInput({ name, email, password });
  if (errors.length > 0) {
    res.status(400);
    throw new Error(errors.join(', '));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(409); // 409 Conflict — more semantically correct than 400 for a duplicate
    throw new Error('An account with this email already exists');
  }

  // Password hashing happens automatically in the User model's pre('save') hook —
  // the controller never touches bcrypt directly.
  const user = await User.create({ name, email, password });

  generateToken(res, user._id);

  res.status(201).json({
    success: true,
    data: { id: user._id, name: user.name, email: user.email },
  });
});

// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const errors = validateLoginInput({ email, password });
  if (errors.length > 0) {
    res.status(400);
    throw new Error(errors.join(', '));
  }

  // password has `select: false` on the schema, so it must be explicitly requested
  const user = await User.findOne({ email }).select('+password');

  // Deliberately identical error for "no such user" and "wrong password" —
  // revealing which one it was lets an attacker enumerate valid emails.
  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  generateToken(res, user._id);

  res.status(200).json({
    success: true,
    data: { id: user._id, name: user.name, email: user.email },
  });
});

// @route   POST /api/auth/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0), // immediately expire the cookie
  });
  res.status(200).json({ success: true, message: 'Logged out' });
});

// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  // req.user is attached by the authMiddleware after verifying the JWT
  res.status(200).json({ success: true, data: req.user });
});

module.exports = { registerUser, loginUser, logoutUser, getMe };
