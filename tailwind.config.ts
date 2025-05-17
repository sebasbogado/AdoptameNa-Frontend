import withMT from "@material-tailwind/react/utils/withMT";
import { circle } from "leaflet";

module.exports = withMT({
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: ["text-blog", "text-marketplace", "text-found"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "text-foreground": "var(--text-foreground)",
        "text-background": "var(--text-background)",
        blue: "var(--blue)",
        // Botones
        "btn-primary": "var(--btn-primary)",
        "btn-secondary": "var(--btn-secondary)",
        "btn-tertiary": "var(--btn-tertiary)",
        "btn-danger": "var(--btn-danger)",
        "btn-action": "var(--btn-action)",
        "btn-cta": "var(--btn-cta)",
        "btn-favorite": "var(--btn-favorite)",
        "btn-menu": "var(--btn-menu)",
        "btn-trash": "var(--btn-trash)",
        // Color de texto
        "btn-primary-text": "var(--btn-primary-text)",
        "btn-secondary-text": "var(--btn-secondary-text)",
        "btn-tertiary-text": "var(--btn-tertiary-text)",
        "btn-danger-text": "var(--btn-danger-text)",
        "btn-action-text": "var(--btn-action-text)",
        "btn-cta-text": "var(--btn-cta-text)",
        "btn-favorite-text": "var(--btn-favorite-text)",
        "btn-menu-text": "var(--btn-menu-text)",
        //colores para tags y titulos de secciones
        adoption: "var(--color-adoption)",
        missing: "var(--color-missing)",
        volunteering: "var(--color-volunteering)",
        blog: "var(--color-blog)",
        marketplace: "var(--color-marketplace)",
        found: "var(--color-found)",
        //missing and found tags
        "found-tag": "var(--color-found-tag)",
        "missing-tag": "var(--color-missing-tag)",
        //Brand colors
        "primary-brand-color": "var(--primary-brand-color)",
        "secondary-brand-color": "var(--secondary-brand-color)",
        "lilac-background": "var(--color-lilac-backgorund)",  
        //Text colors
        "text-primary": "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
      },
      fontFamily: {
        roboto: "var( --font-family)",
      },
    },
    keyframes: {
      pulse: {
        "0%, 100%": { opacity: "1" },
        "50%": { opacity: "0.3" },
      },
      spin: {
        from: { transform: "rotate(0deg)" },
        to: { transform: "rotate(360deg)" },
      },
    },
    animation: {
      pulse: "pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      spin: "spin 1s linear infinite",
    },
  },
  plugins: [require("tailwindcss-animate")],
});
