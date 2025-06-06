'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Post } from '@/types/post';
import { cleanMarkdown } from '@/utils/text/clean-markdown';
import PostsTags from '../petCard/tag';
import CardImage from '../petCard/card-image';
import FavoriteButton from '../buttons/favorite-button';
import { formatLongDate, formatMediumDate } from '@/utils/date-format';
import { addFavorite, deleteFavorite } from '@/utils/favorites-posts.http';
import { useAuth } from '@/contexts/auth-context';
import { useFavorites } from '@/contexts/favorites-context';
import { getAnimalIcon } from '@/utils/Utils';
import { Alert } from '@material-tailwind/react';
import { Check } from 'lucide-react';

interface BlogCardProps {
  post: Post;
  className?: string;
}

export default function BlogCard({ post, className = '' }: BlogCardProps) {
  const { favorites, fetchFavorites } = useFavorites();
  const { authToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [previewText, setPreviewText] = useState('');

  const [successMessage, setSuccessMessage] = useState("");

  const isFavorite = favorites.some((fav: Post) => fav.id === post.id);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!authToken) return;

    setIsLoading(true);
    try {
      if (isFavorite) {
        const fav = favorites.find((f: { id: number; }) => f.id === post.id);
        if (fav) {
          await deleteFavorite(fav.id, authToken)
          setSuccessMessage("Publicación eliminada de favoritos");
          setTimeout(() => { setSuccessMessage("") }, 2500);
        };
      } else {
        await addFavorite(post.id, authToken);
        setSuccessMessage("Publicación añadida a favoritos");
        setTimeout(() => { setSuccessMessage("") }, 2500);
      }
      await fetchFavorites();
    } catch (err) {
      console.error('Error al cambiar favorito', err);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    const content = cleanMarkdown(post.content || '');
    const updatePreview = () => {
      const width = window.innerWidth;
      let length = 100;
      if (width < 640) length = 80;
      else if (width < 768) length = 120;
      else if (width < 1024) length = 200;
      else length = 300;

      setPreviewText(content.slice(0, length) + '...');
    };

    updatePreview();
    window.addEventListener('resize', updatePreview);
    return () => window.removeEventListener('resize', updatePreview);
  }, [post.content]);

  return (
    <>
      {successMessage && (
        <Alert
          open={true}
          color="green"
          animate={{
            mount: { y: 0 },
            unmount: { y: -100 },
          }}
          icon={<Check className="h-5 w-5" />}
          onClose={() => setSuccessMessage("")}
          className="fixed top-4 right-4 w-72 shadow-lg z-[10001]"
        >
          <p className="text-sm">{successMessage}</p>
        </Alert>
      )}
      <Link
        href={`/blog/${post.id}`}
        className={`relative flex flex-col md:flex-row bg-white shadow-[0_0_10px_rgba(0,0,0,0.1)] hover:shadow-[0_0_10px_rgba(0,0,0,0.15)] transition-shadow rounded-2xl overflow-hidden w-full h-96 sm:h-96 md:h-64 lg:h-64 xl:h-64 ${className}`}
      >
        <div className="absolute top-2 right-2 z-10">
          <FavoriteButton
            variant={isFavorite ? 'active' : 'desactivated'}
            onClick={handleFavoriteClick}
            disabled={isLoading}
          />
        </div>

        <div className="w-full md:w-1/4 h-48 md:h-full flex-shrink-0">
          <CardImage media={post.media?.[0]} isBlogCard isSensitive={post.hasSensitiveImages} className="flex-grow w-full object-cover" />
        </div>

        <div className="p-4 md:p-6 flex flex-col w-full flex-grow">
          {/* Contenido (título, tags, texto) */}
          <div className="flex flex-col gap-2 overflow-hidden max-h-[calc(100%-4rem)]">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 line-clamp-1">
              {post.title}
            </h2>

            {!!post.tags?.length && (
              <div className="flex flex-wrap gap-1">
                {post.tags.map((tag, idx) => (
                  <PostsTags
                    key={tag.id || idx}
                    postType={post.postType?.name || 'Blog'}
                    iconType={getAnimalIcon(tag.name)}
                    value={tag.name}
                  />
                ))}
              </div>
            )}

            <p className="text-xs sm:text-sm md:text-base text-gray-700 line-clamp-3">
              {previewText}
            </p>
          </div>

          {/* Footer: autor + fecha */}
          <div className="mt-auto flex justify-between items-center  text-[10px] sm:text-xs text-gray-500">
            <p>Por {post.organizationName || post.userFullName}</p>
            {post.publicationDate && (
              <p title={formatLongDate(post.publicationDate)}>
                {formatMediumDate(post.publicationDate)}
              </p>
            )}
          </div>
        </div>
      </Link>
    </>
  );
}