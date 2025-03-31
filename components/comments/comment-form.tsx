"use client";

import { useState } from "react";
import { UserAvatar } from "../ui/user-avatar";
import { useAuth } from "@/contexts/auth-context";
import { Loader2Icon, SendHorizontal } from "lucide-react";

interface CommentFormProps {
    onSubmit: (content: string) => void;
    placeholder?: string;
    isSubmitting?: boolean;
}

export function CommentForm({ onSubmit, placeholder = "Escribe un comentario...", isSubmitting = false }: CommentFormProps) {
    const [content, setContent] = useState("");
    const { user } = useAuth();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (content.trim() && !isSubmitting) {
            onSubmit(content);
            setContent("");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-start gap-3">
            {user && (
                <UserAvatar user={user} />
            )}
            <div className="flex-1 relative">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={placeholder}
                    rows={2}
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-light-blue-500 focus:border-light-blue-500 disabled:opacity-70"
                />
                <button
                    type="submit"
                    disabled={!content.trim() || isSubmitting}
                    className="absolute right-3 bottom-3 text-white bg-light-blue-500 hover:bg-light-blue-600 rounded-full p-2 disabled:opacity-60 disabled:hover:bg-light-blue-500 flex items-center justify-center"
                >
                    {isSubmitting ? (
                        <Loader2Icon className="w-4 h-4 animate-spin" />
                    ) : (
                        <SendHorizontal className="w-4 h-4" />
                    )}
                </button>
            </div>
        </form>
    );
}