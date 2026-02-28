import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getAgeString(birthDate: Date): string {
  const now = new Date();
  const years = now.getFullYear() - birthDate.getFullYear();
  const months = now.getMonth() - birthDate.getMonth();

  const totalMonths = years * 12 + months;

  if (totalMonths < 12) {
    return `${totalMonths} month${totalMonths !== 1 ? "s" : ""}`;
  }

  const y = Math.floor(totalMonths / 12);
  const m = totalMonths % 12;

  if (m === 0) return `${y} year${y !== 1 ? "s" : ""}`;
  return `${y}y ${m}m`;
}

export function getAgeInMonths(birthDate: Date): number {
  const now = new Date();
  return (now.getFullYear() - birthDate.getFullYear()) * 12 +
    (now.getMonth() - birthDate.getMonth());
}
