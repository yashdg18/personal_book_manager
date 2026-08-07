// Kept deliberately simple (no external validation library on the backend —
// Zod lives on the frontend per the spec). These just guard against
// obviously bad input before it reaches Mongoose.

const validateRegisterInput = ({ name, email, password }) => {
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    errors.push('A valid email is required');
  }
  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  return errors;
};

const validateLoginInput = ({ email, password }) => {
  const errors = [];

  if (!email) errors.push('Email is required');
  if (!password) errors.push('Password is required');

  return errors;
};

module.exports = { validateRegisterInput, validateLoginInput };
