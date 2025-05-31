"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";

interface ImageModalProps {
  images: Array<{ id: number; url: string }>;
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

const ImageModal = ({
  images,
  initialIndex,
  isOpen,
  onClose,
}: ImageModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";

      // Focus the modal for keyboard navigation
      const modalElement = document.getElementById("image-modal");
      if (modalElement) {
        modalElement.focus();
      }
    } else {
      // Restore body scroll
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.preventDefault();
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowLeft") {
      goToPrevious();
    } else if (e.key === "ArrowRight") {
      goToNext();
    }
  };

  const modalContent = (
    <div
      id='image-modal'
      className='fixed inset-0 bg-black bg-opacity-95 z-[9999] flex items-center justify-center p-4'
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}>
      {" "}
      {/* Close button */}
      <button
        onClick={onClose}
        className='absolute top-6 right-6 z-10 p-3 bg-black bg-opacity-60 text-white rounded-full hover:bg-opacity-80 transition-all duration-200 backdrop-blur-sm'
        title='Cerrar (Esc)'>
        <X size={24} />
      </button>
      {/* Navigation buttons - only show if multiple images */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className='absolute left-6 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-black bg-opacity-60 text-white rounded-full hover:bg-opacity-80 transition-all duration-200 backdrop-blur-sm'
            title='Imagen anterior (←)'>
            <ChevronLeft size={28} />
          </button>
          <button
            onClick={goToNext}
            className='absolute right-6 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-black bg-opacity-60 text-white rounded-full hover:bg-opacity-80 transition-all duration-200 backdrop-blur-sm'
            title='Siguiente imagen (→)'>
            <ChevronRight size={28} />
          </button>
        </>
      )}{" "}
      {/* Image container */}
      <div className='relative w-[95vw] h-[90vh] flex items-center justify-center'>
        <Image
          src={images[currentIndex].url}
          alt={`Imagen ${currentIndex + 1} de ${images.length}`}
          fill
          className='object-contain rounded-lg shadow-2xl'
          priority
          unoptimized
          sizes="95vw"
        />
      </div>
      {/* Image counter - only show if multiple images */}
      {images.length > 1 && (
        <div className='absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm'>
          {currentIndex + 1} de {images.length}
        </div>
      )}{" "}
      {/* Thumbnail navigation - only show if multiple images */}
      {images.length > 1 && (
        <div className='absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-3 max-w-full overflow-x-auto px-6 py-2 bg-black bg-opacity-40 rounded-2xl backdrop-blur-sm'>
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setCurrentIndex(index)}
              className={clsx(
                "flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-3 transition-all duration-200",
                index === currentIndex
                  ? "border-white scale-110 shadow-lg"
                  : "border-transparent opacity-70 hover:opacity-90 hover:scale-105"
              )}>
              <Image
                src={image.url}
                alt={`Miniatura ${index + 1}`}
                width={80}
                height={80}
                className='w-full h-full object-cover'
              />
            </button>
          ))}{" "}
        </div>
      )}
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ImageModal;
