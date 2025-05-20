'use client';

import { useAuth } from '@/contexts/auth-context';
import { postMedia } from '@/utils/media.http';
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
  toolbarPlugin,
  UndoRedo,
  Separator,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  ListsToggle,
  InsertImage,
  InsertThematicBreak,
} from '@mdxeditor/editor';

interface InitializedMDXEditorProps extends MDXEditorProps {
  editorRef?: React.Ref<MDXEditorMethods>;
  IsCreateBlog?: boolean; // <-- Aquí agregas la prop
}

export default function InitializedMDXEditor({
  editorRef,
  IsCreateBlog = false, // Valor por default
  ...props
}: InitializedMDXEditorProps) {
  const { authToken } = useAuth();

  // Plugins base
  const basePlugins = [
    headingsPlugin(),
    listsPlugin(),
    quotePlugin(),
    thematicBreakPlugin(),
    imagePlugin({
      imageUploadHandler: async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        if (!authToken) throw new Error("No auth token available for image upload.");
        const response = await postMedia(formData, authToken);
        return response.url;
      }
    }),
    markdownShortcutPlugin(),
  ];

  // Solo agrega el toolbarPlugin si IsCreateBlog es true
  if (IsCreateBlog) {
    basePlugins.splice(4, 0, 
      toolbarPlugin({
        toolbarContents: () => (
          <>
            <UndoRedo />
            <Separator />
            <BlockTypeSelect />
            <Separator />
            <BoldItalicUnderlineToggles />
            <Separator />
            <ListsToggle />
            <Separator />
            <InsertImage />
            <InsertThematicBreak />
          </>
        ),
      })
    );
  }

  return (
    <MDXEditor
      ref={editorRef}
      plugins={basePlugins}
       className="mdx-custom-height min-h-[400px] h-[400px] flex flex-col"

      {...props}
    />
  );
}