'use client';

import { useEffect, useState } from 'react';
import { BookMarked, BookOpen, CheckCircle2, Library } from 'lucide-react';
import { Navbar } from '@/components/ui/Navbar';
import { StatCard } from '@/components/dashboard/StatCard';
import { BookCard } from '@/components/books/BookCard';
import { bookService } from '@/services/bookService';
import { BookStats, BookStatus } from '@/types/book';

export default function DashboardPage() {
  const [stats, setStats] = useState<BookStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await bookService.getStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleStatusChange = async (id: string, status: BookStatus) => {
    if (!stats) return;
    await bookService.updateStatus(id, status);
    fetchStats(); // simplest correct approach — status change affects counts too
  };

  const handleDelete = async (id: string) => {
    if (!stats) return;
    await bookService.deleteBook(id);
    fetchStats();
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

        {loading && <p className="text-foreground/60">Loading dashboard...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {stats && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <StatCard label="Total Books" value={stats.total} icon={Library} />
              <StatCard
                label="Want to Read"
                value={stats.statusCounts['Want to Read']}
                icon={BookMarked}
                accentClass="text-amber-500"
              />
              <StatCard
                label="Reading"
                value={stats.statusCounts['Reading']}
                icon={BookOpen}
                accentClass="text-blue-500"
              />
              <StatCard
                label="Completed"
                value={stats.statusCounts['Completed']}
                icon={CheckCircle2}
                accentClass="text-emerald-500"
              />
            </div>

            <h2 className="text-lg font-semibold mb-4">Recent Books</h2>
            {stats.recentBooks.length === 0 ? (
              <p className="text-foreground/60">
                No books yet. Click &quot;Add Book&quot; to get started.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.recentBooks.map((book) => (
                  <BookCard
                    key={book._id}
                    book={book}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
