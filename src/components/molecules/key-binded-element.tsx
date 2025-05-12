import { RefObject, useEffect, useRef, type ReactNode } from "react";
import { useNvimStore } from "@/store/nvim-store";

export function KeyBindedLink<T extends HTMLAnchorElement>({ content, keyBind }: { keyBind: string, content: (ref: RefObject<T | null>) => ReactNode }) {
  const enabled = useNvimStore(state => state.enabled);
  const ref = useRef<T>(null);

  useEffect(() => {
    if (enabled) {
      const handler = (e: KeyboardEvent) => {
        if (e.key.toLowerCase() === keyBind.toLowerCase()) {
          e.preventDefault()
          if (ref.current) {
            ref.current.click();
            ref.current.focus();
          }
          window.addEventListener("keydown", handler);
        }
      };

      return () => window.removeEventListener("keydown", handler);
    }
  }, [keyBind, enabled]);

  return content(ref)
}


export function KeyBindedButton<T extends HTMLButtonElement>({ content, keyBind }: { keyBind: string, content: (ref: RefObject<T | null>) => ReactNode }) {
  const enabled = useNvimStore(state => state.enabled);
  const ref = useRef<T>(null);

  useEffect(() => {
    if (enabled) {
      const handler = (e: KeyboardEvent) => {
        if (e.key.toLowerCase() === keyBind.toLowerCase()) {
          if (ref.current) {
            e.preventDefault()
            ref.current.click();
          }
        }
      };
      window.addEventListener("keydown", handler);
      return () => window.removeEventListener("keydown", handler);
    };

  }, [keyBind, enabled]);

  return content(ref)
}


export function KeyBindedInput<T extends HTMLInputElement>({ content, keyBind }: { keyBind: string, content: (ref: RefObject<T | null>) => ReactNode }) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === keyBind.toLowerCase()) {
        e.preventDefault()
        if (ref.current) {
          ref.current.focus();
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [keyBind]);

  return content(ref)
}
