import { createId } from "@paralleldrive/cuid2";

import { ProjectTree, TreeItemType } from "@/components/molecules/project-tree";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowDown, ArrowUp, LayoutDashboard } from "lucide-react";
import { useNvimStore } from "@/store/nvim-store";
import { useCallback, useEffect, useState } from "react";
import { DialogInput } from "../molecules/dialog-input";

const projectData = [
  {
    name: "Personal Projects",
    children: [
      {
        name: "AetherLenz",
        children: [
          { name: "main.html", link: "https://www.aetherlenz.com/" },
          {
            name: "photographer.html",
            link: "https://photographer.aetherlenz.com/",
          },
          { name: "organizer.html", link: "https://organizer.aetherlenz.com/" },
          {
            name: "architecture.md",
            link: "/blogs/aetherlenz-architecture",
          },
        ],
      },
      {
        name: "LazyReader",
        children: [
          {
            name: "lazy-reader.html",
            link: "https://lazy-reader.genrevzapa.com/",
          },
          {
            name: "architecture.md",
            link: "/blogs/lazy-reader",
          },
        ],
      },
    ],
  },
  {
    name: "Work Projects",
    children: [
      {
        name: "OMNI | FGI",
        children: [
          {
            name: "OMNI-X (Ecommerce API)",
            children: [
              {
                name: "architecture.md",
                link: "/blogs/omni-architecture",
              },
            ],
          },
          {
            name: "OMNI-I (Ecommerce Tool)",
            children: [
              {
                name: "architecture.md",
                link: "/blogs/omni-architecture",
              },
            ],
          },
        ],
      },
      {
        name: "Microsites | FGI",
        children: [
          {
            name: "siematic-ph.html",
            link: "https://siematic-philippines.com",
          },
        ],
      },
      {
        name: "Ecommerce | FGI",
        children: [
          { name: "sealy-ph.html", link: "https://www.sealy.ph" },
          { name: "kitchenaid-ph.html", link: "https://shop.kitchenaid.ph" },
          { name: "kitchenaid-sg.html", link: "https://www.kitchenaid.sg" },
          { name: "brumate-ph.html", link: "https://www.brumate.com.ph" },
          { name: "brumate-sg.html", link: "https://www.brumate.com.sg" },
          { name: "brumate-my.html", link: "https://www.brumate.com.my" },
          {
            name: "coleman-ph.html",
            link: "https://www.colemanphilippines.com",
          },
          { name: "levoit-ph.html", link: "https://levoit.com.ph" },
        ],
      },
    ],
  },
];

function filterTree(node: TreeItemType, keyword: string): TreeItemType | null {
  const nameMatches = node.name.toLowerCase().includes(keyword.toLowerCase());

  if (nameMatches) {
    return node;
  }

  if (node.children) {
    const filteredChildren: TreeItemType[] = node.children
      .map((child) => filterTree(child, keyword))
      .filter((child): child is TreeItemType => child !== null);

    if (filteredChildren.length > 0) {
      return { ...node, children: filteredChildren };
    }
  }

  return null;
}

export function ProjectsDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [data, setData] = useState<TreeItemType[]>(projectData);

  const { setMode, setGroup } = useNvimStore();

  const group = `project-tree-${text}`;

  const filterHandler = useCallback(
    (keyword: string) => {
      const filtered = projectData.map((item) => filterTree(item, keyword));

      const result = [];

      for (const root of filtered) {
        if (root) {
          result.push(root);
        }
      }

      setData(result);
      setText(keyword);
    },
    [setText, setData],
  );

  useEffect(() => {
    if (open) {
      setData(projectData);
    } else {
      setMode("NORMAL");
    }
  }, [open, setMode, setText]);

  useEffect(() => {
    if (open) {
      setGroup(group);
    } else {
      setGroup("home");
    }
  }, [open, setGroup, group]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="sm:max-w-md font-mono gap-0 p-0"
        id={createId()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="p-4">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LayoutDashboard className="size-5" />
              Projects
            </div>
            <div className="flex gap-1.5 text-xs pr-8 items-center text-foreground/80">
              <span className="bg-popover-foreground/20 text-primary font-bold px-1 flex justify-center items-center">
                <ArrowDown className="size-3 inline-flex" />j
              </span>
              <span className="bg-popover-foreground/20 text-primary font-bold px-1 flex justify-center items-center">
                <ArrowUp className="size-3 inline-flex" />k
              </span>
              <span className="bg-popover-foreground/20 text-primary font-bold px-1 flex justify-center items-center">
                :q
              </span>
            </div>
          </DialogTitle>
          <DialogDescription className="text-left">
            Cool and exciting projects I’ve been lucky to be part of — building,
            learning, and growing.
          </DialogDescription>
        </DialogHeader>
        <ProjectTree data={data} search={text} />
        <DialogFooter className="w-full font-mono grid grid-cols-1">
          <DialogInput
            group={group}
            text={text}
            setText={setText}
            callback={filterHandler}
            setOpen={setOpen}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
