'use client';

import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false,
  loading: () => <div className="h-64 w-full bg-slate-100 dark:bg-white/5 animate-pulse rounded-2xl" />
});

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'link',
    'image',
  ];

  return (
    <div className="rich-text-editor-container">
      <style jsx global>{`
        .rich-text-editor-container .ql-container {
          border-bottom-left-radius: 1.5rem;
          border-bottom-right-radius: 1.5rem;
          border: none;
          background: rgba(241, 245, 249, 0.5);
          font-family: inherit;
          min-height: 300px;
        }
        .dark .rich-text-editor-container .ql-container {
          background: rgba(255, 255, 255, 0.03);
          color: white;
        }
        .rich-text-editor-container .ql-toolbar {
          border-top-left-radius: 1.5rem;
          border-top-right-radius: 1.5rem;
          border: none;
          background: rgba(241, 245, 249, 0.8);
          padding: 0.75rem 1rem;
        }
        .dark .rich-text-editor-container .ql-toolbar {
          background: rgba(255, 255, 255, 0.05);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .rich-text-editor-container .ql-editor {
          font-size: 0.875rem;
          line-height: 1.6;
          padding: 1.5rem;
        }
        .rich-text-editor-container .ql-editor.ql-blank::before {
          color: #94a3b8;
          font-style: italic;
          font-weight: 500;
        }
        .rich-text-editor-container .ql-snow .ql-stroke {
          stroke: #64748b;
        }
        .dark .rich-text-editor-container .ql-snow .ql-stroke {
          stroke: #94a3b8;
        }
        .rich-text-editor-container .ql-snow .ql-fill {
          fill: #64748b;
        }
        .dark .rich-text-editor-container .ql-snow .ql-fill {
          fill: #94a3b8;
        }
        .rich-text-editor-container .ql-snow .ql-picker {
          color: #64748b;
        }
        .dark .rich-text-editor-container .ql-snow .ql-picker {
          color: #94a3b8;
        }
      `}</style>
      <ReactQuill
        theme="snow"
        value={value || ''}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  );
}
