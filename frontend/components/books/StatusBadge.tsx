import { BookStatus } from '@/types/book';

const styles: Record<BookStatus, string> = {
  'Want to Read': 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  Reading: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
  Completed: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
};

export function StatusBadge({ status }: { status: BookStatus }) {
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${styles[status]}`}>
      {status}
    </span>
  );
}
