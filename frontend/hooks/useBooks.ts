'use client';

import { useState, useEffect, useCallback } from 'react';
import { Book, BookFilters, BookStatus } from '@/types/book';
import { bookService } from '@/services/bookService';

export function useBooks(filters: BookFilters) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookService.getBooks(filters);
      setBooks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load books');
    } finally {
      setLoading(false);
    }
    // filters is an object literal from the caller each render, so we
    // depend on its serialized form to avoid an infinite refetch loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.status, filters.tags, filters.search]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const changeStatus = async (id: string, status: BookStatus) => {
    // Optimistic update — dashboard/list feels instant, and we roll back on failure
    const previous = books;
    setBooks((prev) => prev.map((b) => (b._id === id ? { ...b, status } : b)));
    try {
      await bookService.updateStatus(id, status);
    } catch (err) {
      setBooks(previous);
      setError(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  const removeBook = async (id: string) => {
    const previous = books;
    setBooks((prev) => prev.filter((b) => b._id !== id));
    try {
      await bookService.deleteBook(id);
    } catch (err) {
      setBooks(previous);
      setError(err instanceof Error ? err.message : 'Failed to delete book');
    }
  };

  return { books, loading, error, refetch: fetchBooks, changeStatus, removeBook };
}
