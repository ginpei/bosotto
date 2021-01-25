import { useEffect } from "react";

export function usePointerDown(
  callback: (event: PointerEvent) => void,
  root: Document | HTMLElement = document
): void {
  useEffect(() => {
    // without this casting, callback does not meet its type
    (root as Document).addEventListener("pointerdown", callback);
    return () =>
      (root as Document).removeEventListener("pointerdown", callback);
  }, [callback, root]);
}

export function useFocusIn(
  callback: (event: FocusEvent) => void,
  root: Document | HTMLElement = document
): void {
  useEffect(() => {
    // without this casting, callback does not meet its type
    (root as Document).addEventListener("focusin", callback);
    return () => (root as Document).removeEventListener("focusin", callback);
  }, [callback, root]);
}

export function useKeyDown(callback: (event: KeyboardEvent) => void): void {
  useEffect(() => {
    document.addEventListener("keydown", callback);
    return () => document.removeEventListener("keydown", callback);
  }, [callback]);
}
