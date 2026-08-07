'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/ui/Navbar';
import { BookForm } from '@/components/books/BookForm';
import { bookService } from '@/services/bookService';
import { Book, BookInput } from '@/types/book';

export default function EditBookPage() {
  const params = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    bookService
      .getBook(params.id)
      .then(setBook)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load book'))
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleUpdate = async (data: BookInput) => {
    await bookService.updateBook(params.id, data);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">Edit Book</h1>

        {loading && <p className="text-foreground/60">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {book && (
          <BookForm
            defaultValues={{
              title: book.title,
              author: book.author,
              tags: book.tags.join(', '),
              status: book.status,
            }}
            onSubmit={handleUpdate}
            submitLabel="Save Changes"
          />
        )}
      </main>
    </div>
  );
}
