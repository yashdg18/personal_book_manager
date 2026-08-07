'use client';

import Link from 'next/link';
import { BookOpen, LogOut, Plus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './Button';

export function Navbar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <header className="border-b border-border sticky top-0 z-10 bg-background/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <BookOpen className="h-5 w-5 text-accent" />
          Book Manager
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            href="/books"
            className="text-sm text-foreground/70 hover:text-foreground transition-colors"
          >
            My Books
          </Link>
          <Link href="/books/add">
            <Button variant="primary" className="!py-1.5">
              <Plus className="h-4 w-4" /> Add Book
            </Button>
          </Link>
          <ThemeToggle />
          <Button variant="ghost" onClick={() => logout()} aria-label="Logout">
            <LogOut className="h-4 w-4" />
          </Button>
        </nav>
      </div>
    </header>
  );
}
