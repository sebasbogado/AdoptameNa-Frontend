import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder: string;
}

export const Input = ({ placeholder, ...props }: InputProps) => {
  return (
    <input
      className="border p-2 w-full rounded"
      placeholder={placeholder}
      {...props} // Spread all additional props
    />
  );
};