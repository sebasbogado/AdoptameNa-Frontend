'use client';
import '@/styles/editor.css'; // Tu CSS personalizado DESPUÉS

import dynamic from 'next/dynamic';
import { useRef } from 'react';
import type { MDXEditorMethods, MDXEditorProps } from '@mdxeditor/editor';

const Editor = dynamic(() => import('./initialized-mdx-editor'), {
  ssr: false,
});

interface ForwardRefEditorProps extends MDXEditorProps {}

export default function ForwardRefEditor(props: ForwardRefEditorProps) {
  const editorRef = useRef<MDXEditorMethods>(null);
  return (
    <div>
      <Editor editorRef={editorRef} {...props} />
    </div>
  );
}