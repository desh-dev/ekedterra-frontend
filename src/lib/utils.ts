import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Capitalizes the first letter of each sentence in a string.
 * @param text The string to capitalize.
 * @returns The capitalized string.
 */
export function capitalize(text: string): string {
  if (!text) return "";

  // Split the text into sentences using period followed by whitespace
  return text
    .split(/(?<=\.\s+)/)
    .map((sentence) => {
      // Trim any leading whitespace and capitalize first letter
      const trimmed = sentence.trimStart();
      return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    })
    .join("");
}
// This check can be removed, it is just for tutorial purposes
export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY;

/**
 * Formats a number with commas as thousand separators
 * @param value The number or string to format
 * @returns Formatted string with commas
 */
export function formatNumber(value: string | number | undefined): string {
  if (value === undefined || value === '') return '';
  
  // Remove all non-digit characters
  const numStr = String(value).replace(/\D/g, '');
  
  // Format with commas as thousand separators
  return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Parses a formatted number string back to a number
 * @param value The formatted number string (e.g., '1,000,000')
 * @returns The parsed number
 */
export function parseFormattedNumber(value: string): number {
  if (!value) return 0;
  return Number(value.replace(/,/g, ''));
}
