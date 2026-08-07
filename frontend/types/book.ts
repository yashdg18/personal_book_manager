export type BookStatus = 'Want to Read' | 'Reading' | 'Completed';

export interface Book {
  _id: string;
  userId: string;
  title: string;
  author: string;
  tags: string[];
  status: BookStatus;
  createdAt: string;
  updatedAt: string;
}

export interface BookInput {
  title: string;
  author: string;
  tags: string[];
  status: BookStatus;
}

export interface BookStats {
  total: number;
  statusCounts: Record<BookStatus, number>;
  recentBooks: Book[];
}

export interface BookFilters {
  status?: BookStatus;
  tags?: string;
  search?: string;
}
