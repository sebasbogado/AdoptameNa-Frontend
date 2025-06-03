"use client";

import { useState, useRef } from "react";
import { SendHorizontal, ImagePlus, X, Loader2 } from "lucide-react";
import { Alert } from "@material-tailwind/react";
import clsx from "clsx";
import Image from "next/image";
import { useChatImageUpload, ImagePreview } from "@/hooks/use-chat-image-upload";

interface ChatInputProps {
  onSendMessage: (content: string, mediaIds?: number[], images?: ImagePreview[]) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSendMessage, disabled = false }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    selectedImages,
    isUploading,
    uploadingCount,
    uploadError,
    setUploadError,
    handleImageSelect,
    removeImage,
    getImageIds,
    getImages,
    clearImages,
    hasImages,
  } = useChatImageUpload();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if ((!message.trim() && !hasImages) || disabled || isUploading) return;
    
    setSubmitError(null);
    
    try {
      const mediaIds = hasImages ? getImageIds() : [];
      const images = hasImages ? getImages() : [];
      
      if (message.trim() || mediaIds.length > 0) {
        onSendMessage(message.trim() || "", mediaIds, images);
        setMessage("");
        clearImages();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitError('Error al enviar el mensaje. Intenta de nuevo.');
    }
  };
  const handleImageButtonClick = () => {
    setSubmitError(null);
    fileInputRef.current?.click();
  };
  
  return (
    <div className="bg-white border-t border-gray-200 w-full">
      {(uploadError || submitError) && (
        <Alert
          open={true}
          color="red"
          animate={{
            mount: { y: 0 },
            unmount: { y: -100 },
          }}
          onClose={() => {
            setUploadError(null);
            setSubmitError(null);
          }}
          className="fixed top-4 right-4 w-72 shadow-lg z-[10001]"
        >
          <p className="text-sm">{uploadError || submitError}</p>
        </Alert>
      )}
      
      {/* Image Preview */}
      {hasImages && (
        <div className="p-3 border-b border-gray-100">
          {/* Image count indicator */}
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-gray-600 font-medium">
              Imágenes ({selectedImages.filter(img => !img.isUploading && img.id !== -1).length}/4)
            </span>
            {selectedImages.filter(img => !img.isUploading && img.id !== -1).length >= 4 && (
              <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                Límite alcanzado
              </span>
            )}
          </div>
          
          {/* Upload progress indicator */}
          {isUploading && (
            <div className="mb-3 flex items-center gap-2 text-sm text-purple-600 bg-purple-50 p-2 rounded">
              <Loader2 size={16} className="animate-spin" />
              <span>Subiendo {uploadingCount} imagen{uploadingCount !== 1 ? 'es' : ''}...</span>
            </div>
          )}
          
          <div className="flex gap-2 flex-wrap">
            {selectedImages.map((image, index) => (
              <div key={index} className="relative">
                <div className="relative">
                  <Image
                    src={image.url}
                    alt="Preview"
                    width={80}
                    height={80}
                    className={clsx(
                      "object-cover rounded-lg border border-gray-200 transition-opacity",
                      image.isUploading ? "opacity-60" : "opacity-100"
                    )}
                  />
                  {/* Upload overlay */}
                  {image.isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
                      <Loader2 size={20} className="text-white animate-spin" />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => removeImage(index)}
                  disabled={image.isUploading}
                  className={clsx(
                    "absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center rounded-full transition-colors",
                    image.isUploading 
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-red-500 text-white hover:bg-red-600"
                  )}
                  title="Eliminar imagen"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Input Form */}
      <form 
        onSubmit={handleSubmit}
        className="flex items-center gap-2 p-3"
      >
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageSelect}
          className="hidden"
        />        {/* Image upload button */}
        <button
          type="button"
          onClick={handleImageButtonClick}
          disabled={disabled || isUploading || selectedImages.filter(img => !img.isUploading && img.id !== -1).length >= 4}
          className={clsx(
            "p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
            isUploading 
              ? "text-purple-500 bg-purple-50"
              : selectedImages.filter(img => !img.isUploading && img.id !== -1).length >= 4
              ? "text-gray-400 bg-gray-100"
              : "text-gray-500 hover:text-purple-500 hover:bg-purple-50"
          )}
          title={
            isUploading 
              ? "Subiendo imágenes..." 
              : selectedImages.filter(img => !img.isUploading && img.id !== -1).length >= 4
              ? "Máximo 4 imágenes por mensaje"
              : `Agregar imágenes (${selectedImages.filter(img => !img.isUploading && img.id !== -1).length}/4)`
          }
        >
          {isUploading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <ImagePlus size={20} />
          )}
        </button>
          <input
          type="text"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            // Clear submit error when user starts typing
            if (submitError) setSubmitError(null);
          }}
          placeholder="Escribe un mensaje..."
          className="flex-1 min-w-0 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 truncate"
          disabled={disabled || isUploading}
          maxLength={1000}
        />
        <button
          type="submit"
          disabled={(!message.trim() && !hasImages) || disabled || isUploading}
          className={clsx(
            "p-2 rounded-full transition-colors",
            (message.trim() || hasImages) && !disabled && !isUploading
              ? "bg-purple-500 text-white hover:bg-purple-600" 
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          )}
        >
          <SendHorizontal size={20} />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
