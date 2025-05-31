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
import { useEffect, useRef, useState } from 'react';
import { blogFileSchema } from '@/utils/file-schema'; // Asegúrate de importar tu schema de validación
import { X, Loader2, Check, AlertTriangle } from 'lucide-react';
import { Alert } from '@material-tailwind/react';

interface InitializedMDXEditorProps extends MDXEditorProps {
  editorRef?: React.Ref<MDXEditorMethods>;
  IsCreateBlog?: boolean;
    onImageUpload?: (mediaId: number) => void; // AGREGA ESTO
}

export default function InitializedMDXEditor({
  editorRef,
  IsCreateBlog = false,
  onImageUpload,
  ...props
}: InitializedMDXEditorProps) {
  const { authToken } = useAuth();
  const localEditorRef = useRef<MDXEditorMethods>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const refToUse = (editorRef ?? localEditorRef) as React.RefObject<MDXEditorMethods>;
 const [errorMessage, setErrorMessage] = useState('');
const [precautionMessage, setPrecautionMessage] = useState('');
  
    const [uploading, setUploading] = useState(false);

useEffect(() => {
  if (errorMessage) {
    const timer = setTimeout(() => setErrorMessage(''), 3500);
    return () => clearTimeout(timer);
  }
}, [errorMessage]);
  // Plugins base
  const basePlugins = [
    headingsPlugin(),
    listsPlugin(),
    quotePlugin(),
    thematicBreakPlugin(),
    markdownShortcutPlugin(),
    imagePlugin(),
  ];

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
            <button
              type="button"
              title="Subir imagen"
              className="px-2 py-1 rounded hover:bg-gray-200"
              onClick={() => !uploading && inputFileRef.current?.click()}
              disabled={uploading}
              
            >
               {uploading ? <Loader2 className="animate-spin" width="1.2rem" /> : <Image width={"1.2rem"} />}

            </button>
            <InsertThematicBreak />
          </>
        ),
      })
    );
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = blogFileSchema.safeParse(file);
    if (!result.success) {
    setPrecautionMessage(result.error.errors[0].message);
      e.target.value = '';
      return;
    }

    if (!authToken) {
    setErrorMessage("No autenticado. Por favor, inicia sesión.");
      e.target.value = '';
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await postMedia(formData, authToken);
      const imageUrl = response.url;
      const imageId = response.id;

      if (refToUse.current && imageUrl) {
        refToUse.current.insertMarkdown?.(`![](${imageUrl})`);
      }

      // CAMBIO: Notifica al padre el ID de la imagen subida
      if (onImageUpload && imageId) {
        onImageUpload(imageId);
      }

    } catch (error: any) {
    setErrorMessage(`Error al subir la imagen. Por favor, inténtalo de nuevo. ${error?.message || ''}`);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
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
      {errorMessage && (
  <Alert
    open={true}
    color="red"
    animate={{
      mount: { y: 0 },
      unmount: { y: -100 },
    }}
    icon={<X className="h-5 w-5" />}
    onClose={() => setErrorMessage("")}
    className="fixed top-4 right-4 w-72 shadow-lg z-[10001]"
  >
    <p className="text-sm">{errorMessage}</p>
  </Alert>
)}

{precautionMessage && (
  <Alert
    open={true}
    color="orange"
    animate={{
      mount: { y: 0 },
      unmount: { y: -100 },
    }}
    icon={<AlertTriangle className="h-5 w-5" />}
    onClose={() => setPrecautionMessage("")}
    className="fixed top-4 right-4 w-72 shadow-lg z-[10001]"
  >
    <p className="text-sm">{precautionMessage}</p>
  </Alert>
)}

      <MDXEditor
        ref={refToUse}
        plugins={basePlugins}
        className="mdx-custom-height"
        {...props}
      />
    </div>
  );
}
