import ContentSectionForm from '@/components/admin/ContentSectionForm';

export default function Page({ params }: { params: { id: string } }) {
  return (
    <div className="py-8 px-4">
      <ContentSectionForm id={params.id} />
    </div>
  );
}
