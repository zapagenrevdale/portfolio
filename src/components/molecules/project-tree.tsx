"use client";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import React from "react";
import { Folder, Globe, FileText, GitBranch, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useNvimNavigate } from "@/hooks/nvim-navigation";
import { useNvimStore } from "@/store/nvim-store";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";


export type TreeItemType = {
  name: string;
  children?: TreeItemType[];
  link?: string;
};

interface TreeViewProps {
  data: TreeItemType[];
}

interface TreeItemProps {
  item: TreeItemType;
  level: number;
  isLast: boolean;
  parentIsLast?: boolean[];
  group: string;
}

const TreeItem = ({
  group,
  item,
  level,
  isLast,
  parentIsLast = [],
}: TreeItemProps) => {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = item.children && item.children.length > 0;

  const renderPrefix = () => {
    return parentIsLast.map((isParentLast, idx) => (
      <span key={idx} className="inline-block w-4 text-center">
        {isParentLast ? " " : "│"}
      </span>
    ));
  };

  return (
    <div
      className="whitespace-pre"
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
    >
      <button
        data-nvim={group}
        onClick={() =>
          item.link ? window.open(item.link, "_blank") : setExpanded(!expanded)
        }
        className="flex items-center nvim-line rounded-none w-full group"
      >
        {renderPrefix()}
        <span className="inline-block w-4 text-center">
          {isLast ? "└" : "├"}
        </span>
        <span className="inline-block w-4 text-center">{"─"}</span>
        <div
          className={`flex items-center gap-2 ${hasChildren ? "cursor-pointer" : "cursor-default group-focus-visible:underline group-focus-visible:text-primary hover:underline underline-offset-2"}`}
        >
          {hasChildren ? (
            <>
              <Folder className="size-4 text-yellow-500" />
              <span>{item.name}</span>
            </>
          ) : (
            <>
              {item.name.endsWith(".md") ? (
                <FileText className="size-4" />
              ) : (
                <Globe className="size-4" />
              )}
              <span>{item.name}</span>
            </>
          )}
        </div>
      </button>

      {hasChildren ? (
        <div className={cn({ hidden: !expanded })}>
          {item.children?.map((child, index) => (
            <TreeItem
              group={group}
              key={child.name}
              item={child}
              level={level + 1}
              isLast={index === item.children!.length - 1}
              parentIsLast={[...parentIsLast, isLast]}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export const ProjectTree = ({
  data,
  search,
}: TreeViewProps & { search: string }) => {
  const mode = useNvimStore((state) => state.mode);
  const group = `project-tree-${search}`;

  const { index, length } = useNvimNavigate({
    group,
  });

  const [animationParent] = useAutoAnimate();

  return (
    <>
      <ScrollArea className="h-80 p-4 bg-gray-800">
        <div
          className="space-y-0.5"
          ref={animationParent}
          id={`project-tree-${search}`}
        >
          {data.length > 0 ? (
            data.map((item, index) => (
              <TreeItem
                group={group}
                key={item.name}
                item={item}
                level={0}
                isLast={index === data.length - 1}
                parentIsLast={[]}
              />
            ))
          ) : (
            <div>
              If it&apos;s not here. Why dont{" "}
              <span className="font-semibold text-yellow-500">
                we build it together?
              </span>
            </div>
          )}
        </div>
        <Tooltip>
          <TooltipTrigger className="px-2 absolute right-2 bottom-2 bg-background/90 text-xs py-1 rounded">
            {search}
            {search === "q" || search === "bd" ? <span className="ml-1.5 text-sm font-semibold text-primary leading-0">!</span> : <Search className="ml-1.5 inline-flex size-4 rotate-90" />}
          </TooltipTrigger>
          <TooltipContent className="rounded-xs">
            <p className="">
              press &quot;<strong>/</strong>&quot; to search
            </p>
          </TooltipContent>
        </Tooltip>

      </ScrollArea>

      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center">
          <p className="px-2 text-popover-foreground w-fit bg-[#7880B5]">
            {mode}
          </p>
          <p className="px-2 text-[#7880B5] bg-popover">
            <GitBranch className="inline-flex h-4" /> main
          </p>
          <p className="px-2">
            projects.tsx
          </p>
        </div>
        <div className="flex">
          <p className="px-2 text-card-foreground w-fit bg-[#7880B5] tracking-wider">
            {index + 1}:{length}
          </p>
        </div>
      </div>
    </>
  );
};
