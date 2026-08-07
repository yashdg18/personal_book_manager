'use client';

import { Navbar } from '@/components/ui/Navbar';
import { BookForm } from '@/components/books/BookForm';
import { bookService } from '@/services/bookService';
import { BookInput } from '@/types/book';

export default function AddBookPage() {
  const handleCreate = async (data: BookInput) => {
    await bookService.createBook(data);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">Add a Book</h1>
        <BookForm onSubmit={handleCreate} submitLabel="Add Book" />
      </main>
    </div>
  );
}
