const express = require('express');
const {
  getBooks,
  getBookStats,
  getBookById,
  createBook,
  updateBook,
  updateBookStatus,
  deleteBook,
} = require('../controllers/bookController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Every book route requires a logged-in user
router.use(protect);

// IMPORTANT: /stats must be declared BEFORE /:id — otherwise Express
// matches "/stats" against the "/:id" pattern and treats "stats" as an id
router.get('/stats', getBookStats);

router.route('/').get(getBooks).post(createBook);

router.route('/:id').get(getBookById).put(updateBook).delete(deleteBook);

router.patch('/:id/status', updateBookStatus);

module.exports = router;
