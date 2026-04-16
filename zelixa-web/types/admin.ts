import { ColumnDef } from '@tanstack/react-table';

export interface CrudTableProps<TData, TValue = any> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  onAdd?: () => void;
  onView?: (item: TData) => void;
  onEdit?: (item: TData) => void;
  onDelete?: (item: TData) => void;
  onToggleStatus?: (item: TData) => void;
  onHistory?: (item: TData) => void;
  hasActions?: boolean;
  isLoading?: boolean;
}

export interface CrudFormProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
  onCancel?: () => void;
  submitLabel?: string;
}
