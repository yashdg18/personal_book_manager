'use client';

import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from './StatusBadge';
import { Book, BookStatus } from '@/types/book';

const STATUSES: BookStatus[] = ['Want to Read', 'Reading', 'Completed'];

interface BookCardProps {
  book: Book;
  onStatusChange: (id: string, status: BookStatus) => void;
  onDelete: (id: string) => void;
}

export function BookCard({ book, onStatusChange, onDelete }: BookCardProps) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold leading-tight">{book.title}</h3>
          <p className="text-sm text-foreground/60">{book.author}</p>
        </div>
        <StatusBadge status={book.status} />
      </div>

      {book.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {book.tags.map((tag) => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-border/50">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-border">
        <select
          value={book.status}
          onChange={(e) => onStatusChange(book._id, e.target.value as BookStatus)}
          className="text-xs rounded-md border border-border bg-card px-2 py-1 outline-none
            focus:ring-2 focus:ring-accent/50"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-1">
          <Link
            href={`/books/${book._id}/edit`}
            className="p-1.5 rounded-md hover:bg-border/40 transition-colors"
            aria-label="Edit book"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <button
            onClick={() => onDelete(book._id)}
            className="p-1.5 rounded-md hover:bg-red-500/10 text-red-500 transition-colors"
            aria-label="Delete book"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Card>
  );
}
