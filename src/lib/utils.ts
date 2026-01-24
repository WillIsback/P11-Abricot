import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import DOMPurify from 'dompurify';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ============================================
// UTILITAIRES DE SANITIZATION
// ============================================

/**
 * Nettoie et valide une chaîne de texte
 * - Supprime les espaces inutiles
 * - Nettoie les caractères HTML dangereux
 */
export const sanitizeString = (value: string): string => {
  if (typeof value !== 'string') return '';
  return DOMPurify.sanitize(value.trim(), { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
};

/**
 * Nettoie un texte riche (permet le HTML sûr pour les descriptions)
 */
export const sanitizeRichText = (value: string): string => {
  if (typeof value !== 'string') return '';
  return DOMPurify.sanitize(value.trim(), {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'br', 'p', 'a'],
    ALLOWED_ATTR: ['href', 'target']
  });
};
