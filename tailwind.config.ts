import withMT from "@material-tailwind/react/utils/withMT";

module.exports = withMT({
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "text-foreground": "var(--text-foreground)",
        "text-background": "var(--text-background)",
        
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
        "primary-brand-color": "var(--primary-brand-color)",
        "secondary-brand-color": "var(--secondary-brand-color)",
      },
    },
  },
  plugins: [],
});
