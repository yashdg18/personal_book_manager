'use client';

import { useState } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { FilterBar } from '@/components/books/FilterBar';
import { BookCard } from '@/components/books/BookCard';
import { useBooks } from '@/hooks/useBooks';
import { BookStatus } from '@/types/book';

export default function BooksPage() {
  const [status, setStatus] = useState<BookStatus | 'All'>('All');
  const [search, setSearch] = useState('');
  const [tags, setTags] = useState('');

  const { books, loading, error, changeStatus, removeBook } = useBooks({
    status: status === 'All' ? undefined : status,
    search: search || undefined,
    tags: tags || undefined,
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">My Books</h1>

        <div className="mb-6">
          <FilterBar
            status={status}
            onStatusChange={setStatus}
            search={search}
            onSearchChange={setSearch}
            tags={tags}
            onTagsChange={setTags}
          />
        </div>

        {loading && <p className="text-foreground/60">Loading books...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && books.length === 0 && (
          <p className="text-foreground/60">No books match these filters.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.map((book) => (
            <BookCard
              key={book._id}
              book={book}
              onStatusChange={changeStatus}
              onDelete={removeBook}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
