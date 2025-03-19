import React from "react";
import Image from "next/image";
import clsx from "clsx";

interface GoogleLoginButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    size?: "sm" | "md" | "lg";
    onClick?: () => void;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
    size = "md",
    className,
    disabled,
    onClick,
    ...props
}) => {
    const baseStyles =
        "w-full border border-gray-300 text-gray-700 rounded-xl bg-white flex items-center justify-center space-x-2 hover:bg-gray-100 transition-all duration-200";

    const sizes = {
        sm: "py-2 px-4 w-36",
        md: "py-3 px-5 w-48",
        lg: "py-4 px-6 w-56",
    };

    return (
        <button
            type="button"
            className={clsx(baseStyles, sizes[size], className)}
            disabled={disabled}
            onClick={onClick}
            {...props}
        >
            <Image
                src="/Google_logo.svg"
                alt="Google Logo"
                width={20}
                height={20}
                className="min-w-5"
            />
            <span>Iniciar con Google</span>
        </button>
    );
};

export default GoogleLoginButton;
