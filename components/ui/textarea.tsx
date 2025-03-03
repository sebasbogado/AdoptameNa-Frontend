import React from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  placeholder: string;
}

export const Textarea = ({ placeholder, ...props }: TextareaProps) => {
  return (
    <textarea
      className="border p-2 w-full rounded"
      placeholder={placeholder}
      {...props} // Spread all additional props
    />
  );
};