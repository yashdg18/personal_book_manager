import api from '@/lib/axios';
import { Book, BookInput, BookStats, BookFilters } from '@/types/book';

interface ListResponse {
  success: boolean;
  count: number;
  data: Book[];
}
interface SingleResponse {
  success: boolean;
  data: Book;
}
interface StatsResponse {
  success: boolean;
  data: BookStats;
}

export const bookService = {
  getBooks: async (filters: BookFilters = {}): Promise<Book[]> => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.tags) params.append('tags', filters.tags);
    if (filters.search) params.append('search', filters.search);

    const res = await api.get<ListResponse>(`/books?${params.toString()}`);
    return res.data.data;
  },

  getStats: async (): Promise<BookStats> => {
    const res = await api.get<StatsResponse>('/books/stats');
    return res.data.data;
  },

  getBook: async (id: string): Promise<Book> => {
    const res = await api.get<SingleResponse>(`/books/${id}`);
    return res.data.data;
  },

  createBook: async (input: BookInput): Promise<Book> => {
    const res = await api.post<SingleResponse>('/books', input);
    return res.data.data;
  },

  updateBook: async (id: string, input: Partial<BookInput>): Promise<Book> => {
    const res = await api.put<SingleResponse>(`/books/${id}`, input);
    return res.data.data;
  },

  updateStatus: async (id: string, status: Book['status']): Promise<Book> => {
    const res = await api.patch<SingleResponse>(`/books/${id}/status`, { status });
    return res.data.data;
  },

  deleteBook: async (id: string): Promise<void> => {
    await api.delete(`/books/${id}`);
  },
};
