const jwt = require('jsonwebtoken');

// Signs a JWT for the given user id and attaches it to the response
// as an HTTP-only cookie. HTTP-only means client-side JS can't read it
// (mitigates XSS token theft) — the browser just sends it automatically
// on every request to the API domain.
const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  });

  return token;
};

module.exports = generateToken;
