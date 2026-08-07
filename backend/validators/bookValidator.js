const VALID_STATUSES = ['Want to Read', 'Reading', 'Completed'];

const validateBookInput = ({ title, author, status }) => {
  const errors = [];

  if (!title || title.trim().length === 0) {
    errors.push('Title is required');
  }
  if (!author || author.trim().length === 0) {
    errors.push('Author is required');
  }
  if (status && !VALID_STATUSES.includes(status)) {
    errors.push(`Status must be one of: ${VALID_STATUSES.join(', ')}`);
  }

  return errors;
};

module.exports = { validateBookInput, VALID_STATUSES };
