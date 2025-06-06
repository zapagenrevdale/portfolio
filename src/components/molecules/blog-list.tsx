">p>p>puse client";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import React from "react";
import { GitBranch, GitCommitHorizontal, Search } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useNvimNavigate } from "@/hooks/nvim-navigation";
import { useNvimStore } from "@/store/nvim-store";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

export const BlogList = ({
  data,
  search,
}: {
  data: { url: string; title: string; date: string }[];
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
      <ScrollArea className="h-80 py-4 bg-gray-800 overflow-hidden">
        <div
          className="space-y-2"
          ref={animationParent}
          id={`blog-list-${search}`}
        >
          {data.map((blog, index) => (
            <Link
              href={blog.url}
              target="_blank"
              data-nvim={group}
              key={blog.title}
              className="nvim-line w-full flex px-4 items-start gap-4 group"
            >
              <span className="text-current/60 group-focus:text-current group-focus:font-semibold text-sm">
                {index + 1}
              </span>
              <p className="flex flex-col overflow-hidden text-sm">
                <span className="line-clamp-2 sm:line-clamp-none break-words group-focus:text-primary">
                  {blog.title}
                </span>
                <span className="text-current/50 items-center gap-1 hidden group-focus:flex text-xs">
                  <GitCommitHorizontal className="size-4" />
                  genrev-zapa,{" "}
                  {formatDistanceToNow(new Date(blog.date), {
                    addSuffix: true,
                  })}
                </span>
              </p>
            </Link>
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

      <div className="flex items-center justify-between mt-2 px-3 pb-3">
        <div className="flex items-center">
          <p className="px-2 text-popover-foreground w-fit bg-[#7880B5] text-sm sm:text-base">
            {mode}
          </p>
          <p className="px-2 text-[#7880B5] bg-popover text-sm sm:text-base">
            <GitBranch className="inline-flex h-4" /> main
          </p>
          <p className="text-xs sm:text-base px-2">blogs.tsx</p>
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
