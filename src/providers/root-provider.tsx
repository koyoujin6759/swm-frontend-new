import { type ReactNode } from 'react';
import { QueryProvider } from '@/providers';

export default function RootProvider({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
        {children}
    </QueryProvider>
  );
} 