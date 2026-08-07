require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Start the HTTP server immediately so /api/health responds even if
// MongoDB Atlas is briefly unreachable — then connect to the DB
// asynchronously and log the outcome. In production you may prefer to
// only start listening after a successful DB connection; for local dev
// this pattern makes debugging faster.
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

connectDB().catch(() => {
  console.error('Server is running but DB is not connected. Check MONGO_URI.');
});
