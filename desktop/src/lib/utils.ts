import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Callback = () => void;

const listeners = new Set<Callback>();

export function onRefetch(cb: Callback) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function emitRefetch() {
  listeners.forEach((cb) => cb());
}
