'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { bookSchema, BookFormData } from '@/lib/schemas';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { BookInput } from '@/types/book';

interface BookFormProps {
  defaultValues?: Partial<BookFormData>;
  onSubmit: (data: BookInput) => Promise<void>;
  submitLabel: string;
}

export function BookForm({ defaultValues, onSubmit, submitLabel }: BookFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: { status: 'Want to Read', ...defaultValues },
  });

  const handleFormSubmit = async (data: BookFormData) => {
    setServerError(null);
    try {
      await onSubmit({
        title: data.title,
        author: data.author,
        status: data.status,
        tags: data.tags
          ? data.tags.split(',').map((t) => t.trim()).filter(Boolean)
          : [],
      });
      router.push('/books');
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  return (
    <Card className="max-w-lg mx-auto">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
        <Input label="Title" {...register('title')} error={errors.title?.message} />
        <Input label="Author" {...register('author')} error={errors.author?.message} />
        <Input
          label="Tags (comma separated)"
          placeholder="fiction, favorites"
          {...register('tags')}
          error={errors.tags?.message}
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="status" className="text-sm font-medium text-foreground/80">
            Status
          </label>
          <select
            id="status"
            {...register('status')}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none
              focus:ring-2 focus:ring-accent/50"
          >
            <option value="Want to Read">Want to Read</option>
            <option value="Reading">Reading</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {serverError && <p className="text-sm text-red-500">{serverError}</p>}

        <div className="flex gap-3 mt-2">
          <Button type="submit" loading={isSubmitting}>
            {submitLabel}
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
