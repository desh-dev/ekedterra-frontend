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

/**
 * Formats a date in Instagram-style relative time format
 * @param dateString The date string to format (ISO format)
 * @param monthNames Array of month names in the desired language (lowercase)
 * @returns Formatted date string (e.g., '1m', '5h', '2d', '3w', '6mo', '1y', 'november 4', 'november 4, 2022')
 */
export function formatInstagramDate(
  dateString: string,
  monthNames: string[] = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
  ]
): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  const currentYear = now.getFullYear();
  const postYear = date.getFullYear();

  // If older than 1 week, check if we should show month/day format
  if (diffDays >= 7) {
    if (postYear === currentYear) {
      // Same year: "november 4"
      const month = monthNames[date.getMonth()];
      const day = date.getDate();
      return `${month} ${day}`;
    } else {
      // Previous year: "november 4, 2022"
      const month = monthNames[date.getMonth()];
      const day = date.getDate();
      const year = date.getFullYear();
      return `${month} ${day}, ${year}`;
    }
  }

  // Less than 1 week: use relative time formats
  // Less than 1 minute
  if (diffSeconds < 60) return '1m';
  
  // Less than 1 hour
  if (diffMinutes < 60) return `${diffMinutes}m`;
  
  // Less than 24 hours
  if (diffHours < 24) return `${diffHours}h`;
  
  // Less than 7 days
  return `${diffDays}d`;
}
