import { useNvimStore } from "@/store/nvim-store";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const nvimNavigateKey = "nvim-navigate"

export function useNvimNavigate({ id, override }: { id?: string; override?: boolean }) {

  const enabled = useNvimStore(state => state.enabled);
  const mode = useNvimStore(state => state.mode);

  const [index, setIndex] = useState(-1);

  const { data: elements } = useQuery({
    queryKey: [id],
    gcTime: 0,
    queryFn: () => {
      if (id) {
        const parentElement = document.getElementById(id);

        if (parentElement) {
          const nvimElements = parentElement.querySelectorAll<HTMLElement>(".nvim-line");
          for (let i = 0; i < nvimElements.length; i++) {
            nvimElements[i].onfocus = () => setIndex(i);
          }
          return [...nvimElements].filter(element => Object.keys(element).length !== 0);
        } else {
          return []
        }
      } else {
        const nvimElements = document.querySelectorAll<HTMLElement>(".nvim-line");
        return [...nvimElements]
      }
    }
  })

  useEffect(() => {
    if (elements && mode === "NORMAL" && (enabled || override)) {
      const handleKeyDown = (event: KeyboardEvent) => {
        const count = elements.length;

        if ((event.key === "Tab" && !event.shiftKey) || event.key.toLowerCase() === "j" || event.key === "ArrowDown" && !event.ctrlKey && !event.altKey && !event.metaKey) {
          event.preventDefault();
          setIndex((index + 1) % count);
        }

        if ((event.key === "Tab" && event.shiftKey) || event.key.toLowerCase() === "k" || event.key === "ArrowUp" && !event.ctrlKey && !event.altKey && !event.metaKey) {
          event.preventDefault();
          setIndex((index - 1 + count) % count);
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      if (elements[index]) {
        (elements[index] as HTMLElement).focus();
      }

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [index, elements, setIndex, enabled, override, mode]);

  return { index, length: elements?.length ?? 0, setIndex }

}
