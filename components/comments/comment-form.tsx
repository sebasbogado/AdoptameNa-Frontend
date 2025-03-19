"use client";

import { useState } from "react";
import { UserAvatar } from "../ui/user-avatar";
import { useAuth } from "@/contexts/authContext";

interface CommentFormProps {
    onSubmit: (content: string) => void;
    placeholder?: string;
}

export function CommentForm({ onSubmit, placeholder = "Escribe un comentario..." }: CommentFormProps) {
    const { user } = useAuth();
    const [content, setContent] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (content.trim()) {
            onSubmit(content);
            setContent("");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-start gap-3 w-full">
            {user && (
                <UserAvatar user={user} />
            )}
            <div className="flex-1 flex gap-2">
                <input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={placeholder}
                    className="flex-1 px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    disabled={!content.trim()}
                    className="px-4 py-2 bg-blue-500 text-light-blue-900 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Comentar
                </button>
            </div>
        </form>
    );
}