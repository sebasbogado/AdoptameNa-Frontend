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
  codeBlockPlugin,
  codeMirrorPlugin,
  InsertCodeBlock,
} from '@mdxeditor/editor';
import { Image } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { blogFileSchema } from '@/utils/file-schema'; // Asegúrate de importar tu schema de validación
import { X, Loader2, Check, AlertTriangle } from 'lucide-react';

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
 
  
    const [uploading, setUploading] = useState(false);
  const [alertInfo, setAlertInfo] = useState<{
    open: boolean;
    color: "green" | "red" | "blue";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (alertInfo?.open) {
      const timer = setTimeout(() => {
        setAlertInfo(prev => prev ? { ...prev, open: false } : null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alertInfo]);

  // Plugins base
  const basePlugins = [
    headingsPlugin(),
    listsPlugin(),
    quotePlugin(),
    thematicBreakPlugin(),
    markdownShortcutPlugin(),
    imagePlugin(),
    codeBlockPlugin({ defaultCodeBlockLanguage: 'js' }),
    codeMirrorPlugin({
      codeBlockLanguages: {
        js: 'JavaScript',
        ts: 'TypeScript',
        jsx: 'JSX',
        tsx: 'TSX',
        css: 'CSS',
        html: 'HTML',
        bash: 'Bash',
        json: 'JSON',
        md: 'Markdown',
        python: 'Python',
        java: 'Java',
      }
    }),
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
            <InsertCodeBlock />
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
      setAlertInfo({ open: true, color: "red", message: result.error.errors[0].message });
      e.target.value = '';
      return;
    }

    if (!authToken) {
      setAlertInfo({ open: true, color: "red", message: "No autenticado. Por favor, inicia sesión." });
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
      setAlertInfo({ open: true, color: "red", message: `Error al subir la imagen. Por favor, inténtalo de nuevo. ${error?.message || ''}` });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };
  return (
      <div className="flex flex-col gap-2 custom-editor">
      {/* Feedback visual */}
      {alertInfo && alertInfo.open && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded shadow-lg z-[10001] 
          ${alertInfo.color === "red" ? "bg-red-500 text-white"
            : "bg-blue-500 text-white"}`}>
          <div className="flex gap-2 items-center">
            {alertInfo.color === "green" && <Check size={18} />}
            {alertInfo.color === "red" && <X size={18} />}
            {alertInfo.color === "blue" && <AlertTriangle size={18} />}
            <span className="text-sm">{alertInfo.message}</span>
          </div>
        </div>
      )}
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
