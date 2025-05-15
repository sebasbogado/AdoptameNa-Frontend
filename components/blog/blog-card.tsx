'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/types/post';
import { cleanMarkdown } from '@/utils/text/clean-markdown';
import PostsTags from '../petCard/tag';
import CardImage from '../petCard/card-image';
import FavoriteButton from '../buttons/favorite-button';
import { formatLongDate, formatMediumDate, formatTimeAgo } from '@/utils/date-format';
import { addFavorite, deleteFavorite } from '@/utils/favorites-posts.http';
import { useAuth } from '@/contexts/auth-context';
import { useFavorites } from '@/contexts/favorites-context';
import { Favorites } from '@/types/favorites';

interface BlogCardProps {
  post: Post;
  className?: string;
}

export default function BlogCard({ post, className = '' }: BlogCardProps) {
  const previewText = cleanMarkdown(post.content || '').slice(0, 1000) + '...';

  const { favorites, fetchFavorites } = useFavorites();
  const { authToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

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

    return (
    <Link
      href={`/posts/${post.id}`}
      className={`relative flex flex-col md:flex-row bg-white shadow-md hover:shadow-lg transition-shadow rounded-2xl overflow-hidden w-full ${className}`}
    >
      <div className="absolute top-2 right-2 z-10">
        <FavoriteButton
          variant={isFavorite ? 'active' : 'desactivated'}
          onClick={handleFavoriteClick}
          disabled={isLoading}
        />
      </div>
      <div className="w-full md:w-1/4 h-48 md:h-auto flex-shrink-0">
        <CardImage media={post.media?.[0]} className="h-full w-full" />
      </div>

      <div className="p-4 md:p-6 flex flex-col justify-between w-full">
          <h2 className="text-2xl font-bold text-gray-900 truncate">{post.title}</h2>
         

        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
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

        <p className="text-sm text-gray-700 line-clamp-3 mt-2">{previewText}</p>
        <div className='flex flex-col  md:flex-row items-center justify-between mt-4'>
          {post.userFullName && (
            <p className="text-xs text-gray-500">Por {post.userFullName}</p>
          )}
           {post.publicationDate && (
            <p
              className="text-xs text-gray-500 self-end"
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