const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true, // every query filters by userId — index it
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true, // so "Fiction" and "fiction" filter the same
      },
    ],
    status: {
      type: String,
      enum: {
        values: ['Want to Read', 'Reading', 'Completed'],
        message: '{VALUE} is not a valid status',
      },
      default: 'Want to Read',
    },
  },
  { timestamps: true }
);

// Compound index — most queries filter by userId AND status together
// (e.g. dashboard counts, filtered list views)
bookSchema.index({ userId: 1, status: 1 });

// Text index enables $text search across title and author for the
// search feature, instead of writing separate regex queries for each field
bookSchema.index({ title: 'text', author: 'text' });

module.exports = mongoose.model('Book', bookSchema);
