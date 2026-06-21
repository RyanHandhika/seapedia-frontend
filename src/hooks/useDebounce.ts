// src/hooks/useDebounce.ts
// Delays updating a value until the user stops changing it.
// Used for search inputs so we don't fire a request on every keystroke.
import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer); // Clear timer if value changes again
  }, [value, delay]);

  return debounced;
}
