'use client';

import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  type MDXEditorMethods,
  type MDXEditorProps,
  imagePlugin,
} from '@mdxeditor/editor';

interface InitializedMDXEditorProps extends MDXEditorProps {
  editorRef?: React.Ref<MDXEditorMethods>;
}

export default function InitializedMDXEditor({
  editorRef,
  ...props
}: InitializedMDXEditorProps) {
  return (
    <MDXEditor
      ref={editorRef}
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        imagePlugin(),
        
      ]}
      {...props}
    />
  );
}
