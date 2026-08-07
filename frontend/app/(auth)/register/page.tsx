'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BookOpen } from 'lucide-react';
import { registerSchema, RegisterFormData } from '@/lib/schemas';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null);
    try {
      await registerUser(data.name, data.email, data.password);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-2 mb-6">
          <BookOpen className="h-8 w-8 text-accent" />
          <h1 className="text-xl font-semibold">Create your account</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input label="Name" id="name" {...register('name')} error={errors.name?.message} />
          <Input
            label="Email"
            id="email"
            type="email"
            {...register('email')}
            error={errors.email?.message}
          />
          <Input
            label="Password"
            id="password"
            type="password"
            {...register('password')}
            error={errors.password?.message}
          />

          {serverError && <p className="text-sm text-red-500">{serverError}</p>}

          <Button type="submit" loading={isSubmitting} className="w-full mt-2">
            Create account
          </Button>
        </form>

        <p className="text-sm text-center text-foreground/60 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-accent font-medium">
            Log in
          </Link>
        </p>
      </Card>
    </div>
  );
}
