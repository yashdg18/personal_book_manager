const Book = require('../models/Book');
const asyncHandler = require('../utils/asyncHandler');
const { validateBookInput, VALID_STATUSES } = require('../validators/bookValidator');

// @route   GET /api/books?status=Reading&tags=fiction,scifi&search=harry
// @access  Private
const getBooks = asyncHandler(async (req, res) => {
  const { status, tags, search } = req.query;

  // Always scope to the logged-in user — this is the single most
  // important line in this file. Without it, any user could read
  // every other user's books.
  const filter = { userId: req.user._id };

  if (status) {
    filter.status = status;
  }

  if (tags) {
    // "fiction,scifi" -> ["fiction", "scifi"], matches books containing ANY of these tags
    const tagList = tags.split(',').map((t) => t.trim().toLowerCase());
    filter.tags = { $in: tagList };
  }

  if (search) {
    // Uses the text index defined on the Book model (title + author)
    filter.$text = { $search: search };
  }

  const books = await Book.find(filter).sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: books.length, data: books });
});

// @route   GET /api/books/stats
// @access  Private
// Powers the dashboard: total count, per-status counts, and 5 most recent books
const getBookStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const counts = await Book.aggregate([
    { $match: { userId } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  // aggregate returns e.g. [{ _id: 'Reading', count: 3 }] — reshape into
  // a flat object with every status guaranteed present, even at 0
  const statusCounts = VALID_STATUSES.reduce((acc, s) => ({ ...acc, [s]: 0 }), {});
  counts.forEach(({ _id, count }) => {
    statusCounts[_id] = count;
  });

  const total = Object.values(statusCounts).reduce((sum, c) => sum + c, 0);

  const recentBooks = await Book.find({ userId }).sort({ createdAt: -1 }).limit(5);

  res.status(200).json({
    success: true,
    data: { total, statusCounts, recentBooks },
  });
});

// @route   GET /api/books/:id
// @access  Private
const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findOne({ _id: req.params.id, userId: req.user._id });

  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }

  res.status(200).json({ success: true, data: book });
});

// @route   POST /api/books
// @access  Private
const createBook = asyncHandler(async (req, res) => {
  const { title, author, tags, status } = req.body;

  const errors = validateBookInput({ title, author, status });
  if (errors.length > 0) {
    res.status(400);
    throw new Error(errors.join(', '));
  }

  const book = await Book.create({
    userId: req.user._id,
    title,
    author,
    tags: tags || [],
    status: status || 'Want to Read',
  });

  res.status(201).json({ success: true, data: book });
});

// @route   PUT /api/books/:id
// @access  Private
const updateBook = asyncHandler(async (req, res) => {
  const { title, author, tags, status } = req.body;

  const errors = validateBookInput({
    title: title ?? 'placeholder', // only validate fields that were actually sent
    author: author ?? 'placeholder',
    status,
  });
  if (errors.length > 0) {
    res.status(400);
    throw new Error(errors.join(', '));
  }

  // findOne + save (not findByIdAndUpdate) so the userId ownership check
  // happens before any write — findByIdAndUpdate would need a separate
  // query filter to achieve the same safety
  const book = await Book.findOne({ _id: req.params.id, userId: req.user._id });

  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }

  if (title !== undefined) book.title = title;
  if (author !== undefined) book.author = author;
  if (tags !== undefined) book.tags = tags;
  if (status !== undefined) book.status = status;

  const updated = await book.save();

  res.status(200).json({ success: true, data: updated });
});

// @route   PATCH /api/books/:id/status
// @access  Private
// Separate lightweight endpoint for the dashboard's "instant status change" —
// avoids sending the full book payload just to flip one field
const updateBookStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!status || !VALID_STATUSES.includes(status)) {
    res.status(400);
    throw new Error(`Status must be one of: ${VALID_STATUSES.join(', ')}`);
  }

  const book = await Book.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { status },
    { new: true, runValidators: true }
  );

  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }

  res.status(200).json({ success: true, data: book });
});

// @route   DELETE /api/books/:id
// @access  Private
const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }

  res.status(200).json({ success: true, data: {} });
});

module.exports = {
  getBooks,
  getBookStats,
  getBookById,
  createBook,
  updateBook,
  updateBookStatus,
  deleteBook,
};
