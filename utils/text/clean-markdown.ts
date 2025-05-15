export function cleanMarkdown(markdown: string): string {
  return markdown
    .replace(/!\[.*?\]\(.*?\)/g, '')                 // imágenes
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')         // enlaces: [text](url) → text
    .replace(/[#_*`~>\-]+/g, '')                     // caracteres markdown
    .replace(/\n+/g, ' ')                            // saltos de línea → espacio
    .trim();
}