"use client";

import { ReactNode } from "react";
import { useFloatingChat } from "@/contexts/floating-chat-context";

// NOTA: Esta versión del proveedor no se utiliza actualmente.
// El FloatingChatProvider del contexto (contexts/floating-chat-context.tsx) es el que se usa.
// Se mantiene este archivo para evitar errores de importación en caso de que sea referenciado.

export function FloatingChatProvider({ children }: { children: ReactNode }) {
  // Simplemente renderiza los children, ya que la lógica real está en el contexto
  return <>{children}</>;
}
