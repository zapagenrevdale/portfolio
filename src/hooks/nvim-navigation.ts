import { useNvimStore } from "@/store/nvim-store";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const nvimNavigateKey = "nvim-navigate";

export function useNvimNavigate({ group }: { group: string }) {
  const { mode, group: currentGroup } = useNvimStore();

  const [index, setIndex] = useState(-1);

  const { data: elements } = useQuery({
    queryKey: [group],
    gcTime: 0,
    queryFn: () => {
      setIndex(-1);
      const nvimElements = document.querySelectorAll<HTMLElement>(
        `[data-nvim="${group}"]`,
      );
      for (let i = 0; i < nvimElements.length; i++) {
        nvimElements[i].onfocus = () => setIndex(i);
      }
      return nvimElements;
    },
  });

  useEffect(() => {
    if (elements && mode === "NORMAL" && group === currentGroup) {
      const handleKeyDown = (event: KeyboardEvent) => {
        const count = elements.length;

        if (
          (event.key === "Tab" && !event.shiftKey) ||
          event.key.toLowerCase() === "j" ||
          (event.key === "ArrowDown" &&
            !event.ctrlKey &&
            !event.altKey &&
            !event.metaKey)
        ) {
          event.preventDefault();
          if (count > 0) {
            setIndex((index + 1) % count);
          }
        }

        if (
          (event.key === "Tab" && event.shiftKey) ||
          event.key.toLowerCase() === "k" ||
          (event.key === "ArrowUp" &&
            !event.ctrlKey &&
            !event.altKey &&
            !event.metaKey)
        ) {
          event.preventDefault();
          if (count > 0) {
            setIndex((index - 1 + count) % count);
          }
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
  }, [index, elements, setIndex, mode, currentGroup, group]);

  return { index, length: elements?.length ?? 0, setIndex };
}
