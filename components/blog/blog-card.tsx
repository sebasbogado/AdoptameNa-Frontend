'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/types/post';
import { cleanMarkdown } from '@/utils/text/clean-markdown';

interface BlogCardProps {
  post: Post;
  className?: string;
}

export default function BlogCard({ post, className = '' }: BlogCardProps) {
  const imageUrl = post.media?.[0]?.url || '/logo.png';
  const previewText = cleanMarkdown(post.content || '').slice(0, 200) + '...';

  return (
    <Link
      href={`/posts/${post.id}`}
  className={`flex flex-col md:flex-row bg-white shadow-md hover:shadow-lg transition-shadow rounded-2xl overflow-hidden w-full ${className}`}
    >
      {/* Imagen */}
      <div className="w-full md:w-1/3 h-64 md:h-auto relative">
        <Image
          src={imageUrl}
          alt={post.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      {/* Texto */}
      <div className="p-4 md:p-6 flex flex-col justify-between w-full md:w-2/3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 truncate">{post.title}</h2>
          <p className="text-sm text-gray-700 line-clamp-4">{previewText}</p>
        </div>
        {post.userFullName && (
          <p className="text-xs text-gray-500 mt-4 self-end">Por {post.userFullName}</p>
        )}
      </div>
    </Link>
  );
}