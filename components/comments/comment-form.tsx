"use client";

import { useAuth } from "@/contexts/auth-context";
import { UserAvatar } from "../ui/user-avatar";
import { Loader2Icon, SendHorizontal } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { CommentFormData, commentSchema } from "@/validations/comment-schema";



interface CommentFormProps {
    onSubmit: (content: string) => void;
    placeholder?: string;
    isSubmitting?: boolean;
}

export function CommentForm({
    onSubmit,
    placeholder = "Escribe un comentario...",
    isSubmitting = false
}: CommentFormProps) {
    const { user } = useAuth();

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors }
    } = useForm<CommentFormData>({
        resolver: zodResolver(commentSchema),
        defaultValues: {
            content: ""
        }
    });

    const content = watch("content");
    const contentLength = content?.length || 0;

    useEffect(() => {
        if (content && content.length > 500) {
            setValue('content', content.slice(0, 500), { shouldValidate: true });
        }
    }, [content, setValue]);

    const onFormSubmit = (data: CommentFormData) => {
        if (!isSubmitting) {
            onSubmit(data.content);
            reset();
        }
    };

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        if (value.length <= 500) {
            setValue('content', value, { shouldValidate: true });
        }
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col">
            <div className="flex items-start gap-3">
                {user && (
                    <UserAvatar user={user} />
                )}
                <div className="flex-1 relative">
                    <textarea
                        {...register("content")}
                        placeholder={placeholder}
                        disabled={isSubmitting}
                        onChange={handleTextareaChange}
                        maxLength={500} // Atributo HTML para limitar entrada
                        className={`w-full px-3 py-2 bg-gray-50 border ${errors.content ? "border-red-400 focus:border-red-500 focus:ring-red-500" : "border-gray-200 focus:ring-light-blue-500 focus:border-light-blue-500"} rounded-lg resize-none focus:outline-none focus:ring-1 disabled:opacity-70`}
                    />
                    <div className="absolute right-3 bottom-3 flex items-center gap-2">
                        <span className={`text-xs ${contentLength > 450 ? (contentLength >= 500 ? "text-red-500 font-medium" : "text-amber-600") : "text-gray-500"}`}>
                            {contentLength}/500
                        </span>
                        <button
                            type="submit"
                            disabled={isSubmitting || !!errors.content || contentLength === 0}
                            className="text-white bg-light-blue-500 hover:bg-light-blue-600 rounded-full p-2 disabled:opacity-60 disabled:hover:bg-light-blue-500 flex items-center justify-center"
                        >
                            {isSubmitting ? (
                                <Loader2Icon className="w-4 h-4 animate-spin" />
                            ) : (
                                <SendHorizontal className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {errors.content && (
                <div className="mt-1 ml-12 text-sm text-red-500">
                    {errors.content.message}
                </div>
            )}
        </form>
    );
}