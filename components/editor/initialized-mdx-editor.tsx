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
  toolbarPlugin,
  UndoRedo,
  Separator,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  ListsToggle,
  InsertThematicBreak,
  imagePlugin,
} from '@mdxeditor/editor';
import { Image } from 'lucide-react';
import { useRef } from 'react';

interface InitializedMDXEditorProps extends MDXEditorProps {
  editorRef?: React.Ref<MDXEditorMethods>;
  IsCreateBlog?: boolean;
}

export default function InitializedMDXEditor({
  editorRef,
  IsCreateBlog = false,
  ...props
}: InitializedMDXEditorProps) {
  const { authToken } = useAuth();
  const localEditorRef = useRef<MDXEditorMethods>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const refToUse = (editorRef ?? localEditorRef) as React.RefObject<MDXEditorMethods>;

  // Plugins base - SIN imagePlugin
  const basePlugins = [
    headingsPlugin(),
    listsPlugin(),
    quotePlugin(),
    thematicBreakPlugin(),
    markdownShortcutPlugin(),
    imagePlugin()
  ];

  // Toolbar personalizado con tu propio botón de imagen
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
            
            {/* Botón personalizado para imagen */}
            <button
              type="button"
              title="Subir imagen"
              className="px-2 py-1 rounded hover:bg-gray-200"
              onClick={() => inputFileRef.current?.click()}
            >
              <Image
               width={"1.2rem"}
              />
            </button>
            <InsertThematicBreak />
          </>
        ),
      })
    );
  }

  // Lógica personalizada de imagen
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!authToken) {
      alert("No auth token");
      return;
    }

    // Sube la imagen y obtiene la URL
    const formData = new FormData();
    formData.append("file", file);
    const response = await postMedia(formData, authToken);
    const imageUrl = response.url;

    // Inserta el markdown de la imagen donde está el cursor
    if (refToUse.current && imageUrl) {
      refToUse.current.insertMarkdown?.(`![](${imageUrl})`);
    }
    // Limpia el input para poder subir la misma imagen otra vez
    e.target.value = '';
  };

  return (
    <div className="flex flex-col gap-2 custom-editor">
      {/* Input oculto para subir imagen */}
      <input
        type="file"
        accept="image/*"
        ref={inputFileRef}
        style={{ display: 'none' }}
        onChange={handleImageUpload}
      />
      <MDXEditor
        ref={refToUse}
        plugins={basePlugins}
        className="mdx-custom-height"
        {...props}
      />
    </div>
  );
}