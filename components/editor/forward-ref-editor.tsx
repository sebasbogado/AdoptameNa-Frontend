'use client';
import '@/styles/editor.css'; // Tu CSS personalizado DESPUÉS

import dynamic from 'next/dynamic';
import { useRef } from 'react';
import type { MDXEditorMethods, MDXEditorProps } from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css'; // Importación de estilos predeterminados

const Editor = dynamic(() => import('./initialized-mdx-editor'), {
  ssr: false,
});

interface ForwardRefEditorProps extends MDXEditorProps {
  IsCreateBlog?: boolean; 
}

export default function ForwardRefEditor({
  IsCreateBlog = false, 
  ...props
}: ForwardRefEditorProps) {
  const editorRef = useRef<MDXEditorMethods>(null);
  return (
    <div className='custom-editor'>
      {/* Le pasas la prop */}
      <Editor editorRef={editorRef} IsCreateBlog={IsCreateBlog} {...props} />
    </div>
  );
}