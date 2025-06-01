export function cleanMarkdown(markdown: string): string {
  return markdown
    // Elimina imágenes ![alt](url)
    .replace(/!\[.*?\]\(.*?\)/g, '')
    // Elimina links pero conserva el texto visible
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Elimina código en bloque ```...```
    .replace(/```[\s\S]*?```/g, '')
    // Elimina código inline `...`
    .replace(/`{1,3}[^`]*`{1,3}/g, '')
    // Elimina títulos markdown (##, ###, etc.)
    .replace(/^#{1,6}\s*/gm, '')
    // Elimina citas >
    .replace(/^\s*>\s?/gm, '')
    // Elimina líneas horizontales (---)
    .replace(/^(-\s?){3,}$/gm, '')
    // Elimina listas (con o sin checkbox)
    .replace(/^\s*[-*+]\s+\[ \]\s+/gm, '') // checkbox vacíos
    .replace(/^\s*[-*+]\s+\[x\]\s+/gim, '') // checkbox marcados
    .replace(/^\s*[-*+]\s+/gm, '') // listas normales
    .replace(/^\s*\d+\.\s+/gm, '') // listas numeradas
    // Elimina etiquetas HTML/JSX
    .replace(/<[^>]+>/g, '')
    // Elimina asteriscos, guiones y tildes de markdown
    .replace(/[*_~`]+/g, '')
    // Elimina entidades HTML como &#x20;
    .replace(/&#x?[0-9a-fA-F]+;/g, ' ')
    // Normaliza saltos de línea y espacios
    .replace(/\n+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}