"use client";

import { useEffect, useState } from "react";

/**
 * One shared debounce. Use it for every table search box — do not re-implement
 * per screen (dgtool_fe had this duplicated everywhere before consolidating).
 */
export function useDebounce<T>(value: T, delay = 350): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
