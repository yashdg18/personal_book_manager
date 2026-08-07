import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  accentClass?: string;
}

export function StatCard({ label, value, icon: Icon, accentClass = 'text-accent' }: StatCardProps) {
  return (
    <Card className="flex items-center gap-4">
      <div className={`h-11 w-11 rounded-lg flex items-center justify-center bg-current/10 ${accentClass}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-2xl font-semibold leading-none">{value}</p>
        <p className="text-sm text-foreground/60 mt-1">{label}</p>
      </div>
    </Card>
  );
}
