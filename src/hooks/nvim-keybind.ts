import { useNvimStore } from "@/store/nvim-store";
import { useEffect, useRef } from "react";

interface KeyBindConfig {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
}

export function useClickableKeyBinding<T extends HTMLElement>({
  keyBind,
  group,
}: {
  keyBind: string | KeyBindConfig;
  group: string;
}) {
  const currentGroup = useNvimStore((state) => state.group);
  const mode = useNvimStore((state) => state.mode);
  const ref = useRef<T>(null);

  useEffect(() => {
    if (group !== currentGroup || mode === "INSERT") return;

    const handler = (e: KeyboardEvent) => {
      const config = typeof keyBind === "string" ? { key: keyBind } : keyBind;

      const keyMatches = e.key.toLowerCase() === config.key.toLowerCase();
      const ctrlMatches = !config.ctrl || e.ctrlKey;
      const altMatches = !config.alt || e.altKey;
      const shiftMatches = !config.shift || e.shiftKey;
      const metaMatches = !config.meta || e.metaKey;

      if (
        keyMatches &&
        ctrlMatches &&
        altMatches &&
        shiftMatches &&
        metaMatches
      ) {
        e.preventDefault();
        e.stopPropagation();
        ref.current?.click();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [keyBind, group, currentGroup, mode]);

  return ref;
}

export function useInputKeyBinding<T extends HTMLElement>({
  keyBind,
  group,
}: {
  keyBind: string | KeyBindConfig | (string | KeyBindConfig)[];
  group: string;
}) {
  const { setMode, group: currentGroup, mode } = useNvimStore();
  const ref = useRef<T>(null);

  useEffect(() => {
    if (group !== currentGroup) return;

    const handler = (e: KeyboardEvent) => {
      let valid = false;

      if (Array.isArray(keyBind)) {
        valid = keyBind.some((binding) => {
          const config =
            typeof binding === "string" ? { key: binding } : binding;
          const keyMatches = e.key.toLowerCase() === config.key.toLowerCase();
          const ctrlMatches = !config.ctrl || e.ctrlKey;
          const altMatches = !config.alt || e.altKey;
          const shiftMatches = !config.shift || e.shiftKey;
          const metaMatches = !config.meta || e.metaKey;
          return (
            keyMatches &&
            ctrlMatches &&
            altMatches &&
            shiftMatches &&
            metaMatches
          );
        });
      } else {
        const config = typeof keyBind === "string" ? { key: keyBind } : keyBind;
        const keyMatches = e.key.toLowerCase() === config.key.toLowerCase();
        const ctrlMatches = !config.ctrl || e.ctrlKey;
        const altMatches = !config.alt || e.altKey;
        const shiftMatches = !config.shift || e.shiftKey;
        const metaMatches = !config.meta || e.metaKey;
        valid =
          keyMatches &&
          ctrlMatches &&
          altMatches &&
          shiftMatches &&
          metaMatches;
      }

      if (ref.current && mode === "NORMAL" && valid) {
        e.preventDefault();
        e.stopPropagation();

        ref.current.hidden = false;
        ref.current.focus();
        setMode("INSERT");
      }

      if (
        ref.current &&
        (e.key === "Escape" || (e.key === "[" && (e.ctrlKey || e.metaKey)))
      ) {
        e.preventDefault();
        e.stopPropagation();

        ref.current.blur();
        ref.current.hidden = true;
        setMode("NORMAL");
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [keyBind, group, currentGroup, setMode, mode]);

  return ref;
}
