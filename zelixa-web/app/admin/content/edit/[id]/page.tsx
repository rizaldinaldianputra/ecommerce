'use client';

import ContentItemForm from '@/components/admin/ContentItemForm';
import { use } from 'react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditContentPage({ params }: PageProps) {
  const { id } = use(params);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <ContentItemForm id={id} />
    </div>
  );
}
