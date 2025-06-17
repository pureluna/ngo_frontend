import { ReactNode } from 'react';

export function Select({ children, onChange }: { children: ReactNode; onChange?: (e: any) => void }) {
  return <select onChange={onChange}>{children}</select>;
}

export function SelectTrigger({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function SelectValue({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function SelectContent({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function SelectItem({ children, value }: { children: ReactNode; value: string }) {
  return <option value={value}>{children}</option>;
}
