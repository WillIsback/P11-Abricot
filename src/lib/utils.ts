import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import DOMPurify from "isomorphic-dompurify";

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
  return DOMPurify.sanitize(value)
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

// ============================================
// LOGGER CENTRALISÉ (usage simple)
// ============================================
// Utilise console.* mais centralise pour pouvoir plugger un provider plus tard.

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const logFn: Record<LogLevel, (...args: unknown[]) => void> = {
  debug: (...args) => console.debug('[DEBUG]', ...args),
  info: (...args) => console.info('[INFO]', ...args),
  warn: (...args) => console.warn('[WARN]', ...args),
  error: (...args) => console.error('[ERROR]', ...args),
};

export const logger = {
  debug: (...args: unknown[]) => logFn.debug(...args),
  info: (...args: unknown[]) => logFn.info(...args),
  warn: (...args: unknown[]) => logFn.warn(...args),
  error: (...args: unknown[]) => logFn.error(...args),
};

export const formDataToObject = (formData: FormData, arrayFields?: string[]) => {
  const result: Record<string, unknown> = {};
  const keys = Array.from(formData.keys());
  
  for (const key of keys) {
    const values = formData.getAll(key);
    let value = values.length === 1 ? values[0] : values;
    
    // Si c'est un champ à transformer en array (toujours, pas juste avec virgules)
    if (arrayFields?.includes(key) && typeof value === 'string') {
      // Split par virgule, trim les items, et filter les strings vides
      value = value
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);
    }
    
    result[key] = value;
  }
  return result;
}
