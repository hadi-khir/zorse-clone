import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getEstDate = (date: Date): Date => {
  return new Date(date.toLocaleString('en-US', {
    timeZone: 'America/New_York'
  }));
}
