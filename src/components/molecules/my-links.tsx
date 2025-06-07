">puse client";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import React from "react";
import { GitBranch, LucideIcon, Search } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useNvimNavigate } from "@/hooks/nvim-navigation";
import { useNvimStore } from "@/store/nvim-store";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { useClickableKeyBinding } from "@/hooks/nvim-keybind";

const MyLink = ({
  link: { url, title, Icon },
  index,
  group,
}: {
  link: { url: string; title: string; Icon: LucideIcon };
  index: number;
  group: string;
}) => {
  const ref = useClickableKeyBinding<HTMLAnchorElement>({
    keyBind: {
      key: index.toString(),
    },
    group: group,
  });

  return (
    <Link
      href={url}
      target="_blank"
      data-nvim={group}
      key={title}
      ref={ref}
      className="nvim-line w-full flex px-4 items-center gap-4 group"
    >
      <span className="text-current/60 group-focus:text-current group-focus:font-semibold text-sm group-hover:font-semibold group-hover:text-current">
        {index}
      </span>
      <p className="flex overflow-hidden text-sm gap-2 py-1">
        <Icon className="size-5 group-focus:text-purple-200 group-hover:text-primary/80" />
        <span className="line-clamp-2 sm:line-clamp-none break-words group-focus:text-primary group-hover:underline group-focus:underline group-hover:text-primary/80">
          {title}
        </span>
      </p>
    </Link>
  );
};

export const LinkList = ({
  data,
  search,
}: {
  data: { url: string; title: string; Icon: LucideIcon }[];
  search: string;
}) => {
  const mode = useNvimStore((state) => state.mode);
  const group = `blog-list-${search}`;

  const { index, length } = useNvimNavigate({
    group,
  });

  const [animationParent] = useAutoAnimate();

  return (
    <>
      <ScrollArea className="h-40 py-4 bg-gray-800 overflow-hidden">
        <div
          className="space-y-2"
          ref={animationParent}
          id={`blog-list-${search}`}
        >
          {data.map((link, index) => (
            <MyLink
              key={link.title}
              link={link}
              index={index + 1}
              group={group}
            />
          ))}
        </div>
        <Tooltip>
          <TooltipTrigger
            className="px-2 absolute right-2 bottom-2 bg-background/90 text-xs py-1 rounded"
            autoFocus={true}
          >
            {search}
            {search === "q" || search === "bd" ? (
              <span className="ml-1.5 text-sm font-semibold text-primary leading-0">
                !
              </span>
            ) : (
              <Search className="ml-1.5 inline-flex size-4 rotate-90" />
            )}
          </TooltipTrigger>
          <TooltipContent className="rounded-xs">
            <p className="">
              press &quot;<strong>/</strong>&quot; to search
            </p>
          </TooltipContent>
        </Tooltip>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="flex items-center justify-between mt-2 px-3 pb-1">
        <div className="flex items-center">
          <p className="px-2 text-popover-foreground w-fit bg-[#7880B5] text-sm sm:text-base">
            {mode}
          </p>
          <p className="px-2 text-[#7880B5] bg-popover text-sm sm:text-base">
            <GitBranch className="inline-flex h-4" /> main
          </p>
          <p className="text-xs sm:text-base px-2">links.tsx</p>
        </div>
        <div className="flex">
          <p className="px-2 text-card-foreground w-fit bg-[#7880B5] tracking-wider text-sm sm:text-base">
            {index + 1}:{length}
          </p>
        </div>
      </div>
    </>
  );
};
