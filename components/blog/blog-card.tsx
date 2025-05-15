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
import { Favorites } from '@/types/favorites';

interface BlogCardProps {
  post: Post;
  className?: string;
}

export default function BlogCard({ post, className = '' }: BlogCardProps) {
  const { favorites, fetchFavorites } = useFavorites();
  const { authToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [previewText, setPreviewText] = useState('');

  const isFavorite = favorites.some((fav: Favorites) => fav.postId === post.id);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!authToken) return;

    setIsLoading(true);
    try {
      if (isFavorite) {
        const fav = favorites.find((f: { postId: number; }) => f.postId === post.id);
        if (fav) await deleteFavorite(fav.id, authToken);
      } else {
        await addFavorite(post.id, authToken);
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
    <Link
      href={`/posts/${post.id}`}
      className={`relative flex flex-col md:flex-row bg-white shadow-md hover:shadow-lg transition-shadow rounded-2xl overflow-hidden w-full h-96sm:h-96 md:h-64 lg:h-64 xl:h-64 ${className}`}
    >
      <div className="absolute top-2 right-2 z-10">
        <FavoriteButton
          variant={isFavorite ? 'active' : 'desactivated'}
          onClick={handleFavoriteClick}
          disabled={isLoading}
        />
      </div>

      <div className="w-full md:w-1/4 h-48 md:h-full flex-shrink-0">
        <CardImage media={post.media?.[0]} className="h-full w-full object-cover" />
      </div>

      <div className="p-4 md:p-6 flex flex-col justify-between w-full">
        <div className="flex flex-col gap-y-1 sm:gap-y-2">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate">
            {post.title}
          </h2>

          {!!post.tags?.length && (
            <div className="flex flex-wrap gap-1">
              {post.tags.map((tag, idx) => (
                <PostsTags
                  key={tag.id || idx}
                  postType={post.postType?.name || 'Blog'}
                  iconType="race"
                  value={tag.name}
                />
              ))}
            </div>
          )}

          <p className="text-xs sm:text-sm md:text-base text-gray-700">{previewText}</p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between mt-3">
          {post.userFullName && (
            <p className="text-[10px] sm:text-xs text-gray-500">Por {post.userFullName}</p>
          )}
          {post.publicationDate && (
            <p
              className="text-[10px] sm:text-xs text-gray-500 self-end"
              title={formatLongDate(post.publicationDate)}
            >
              {formatMediumDate(post.publicationDate)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}