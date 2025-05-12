import { useEffect, useState, type ReactNode } from "react";

import { ProjectTree, TreeItemType } from "@/components/molecules/project-tree";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { GitBranch, LayoutDashboard } from "lucide-react";
import { useNvimStore } from "@/store/nvim-store";
import { KeyBindedInput } from "../molecules/key-binded-element";
import { useNvimNavigate } from "@/hooks/nvim-navigation";
import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

const projectData = [
  {
    name: "Personal Projects",
    children: [
      {
        name: "AetherLenz",
        children: [
          { name: "main.html", link: "https://www.aetherlenz.com/" },
          { name: "photographer.html", link: "https://photographer.aetherlenz.com/" },
          { name: "organizer.html", link: "https://organizer.aetherlenz.com/" },
          {
            name: "Documentation",
            children: [
              { name: "architecture.md", link: "/blogs/aetherlenz#architecture" },
            ]
          },
        ],
      },
    ],
  },
  {
    name: "Work Projects",
    children: [
      {
        name: "Ecommerce | FGI",
        children: [
          { name: "sealy-ph.html", link: "https://www.sealy.ph" },
          { name: "kitchenaid-ph.html", link: "https://shop.kitchenaid.ph" },
          { name: "kitchenaid-sg.html", link: "https://www.kitchenaid.sg" },
          { name: "brumate-ph.html", link: "https://www.brumate.com.ph" },
          { name: "brumate-sg.html", link: "https://www.brumate.com.sg" },
          { name: "brumate-my.html", link: "https://www.brumate.com.my" },
          { name: "coleman-ph.html", link: "https://www.colemanphilippines.com" },
          { name: "levoit-ph.html", link: "https://levoit.com.ph" },
          { name: "alif.html", link: "https://alifeinfocus.ph" },
        ],
      },
      {
        name: "OMNI | FGI",
        children: [
          {
            name: "OMNI-X (Ecommerce API)",
            children: [
              { name: "architecture.md", link: "/blogs/omni#extenal-architecture" },
            ],
          },
          {
            name: "OMNI-I (Ecommerce Tool)",
            children: [
              { name: "architecture.md", link: "/blogs/omni#internal-architecture" },
            ],
          },
        ],
      },
    ],
  },
]

function filterTree(node: TreeItemType, keyword: string): TreeItemType | null {
  const nameMatches = node.name.toLowerCase().includes(keyword.toLowerCase());

  if (nameMatches) {
    return node;
  }

  if (node.children) {
    const filteredChildren: TreeItemType[] = node.children
      .map(child => filterTree(child, keyword))
      .filter((child): child is TreeItemType => child !== null);

    if (filteredChildren.length > 0) {
      return { ...node, children: filteredChildren };
    }
  }

  return null;
}

export function ProjectsDialog({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState("")

  const [data, setData] = useState<TreeItemType[]>(projectData);

  const { setMode, setEnabled, mode } = useNvimStore()

  const qc = useQueryClient();

  const { index, length, setIndex } = useNvimNavigate({
    id: `project-tree-${text}`,
    override: true,
  });

  const filterHandler = useCallback((keyword: string) => {
    setIndex(-1);
    if (!keyword) {
      setData(projectData);
      return;
    }

    const filtered = projectData
      .map(item => filterTree(item, keyword));

    const result = [];

    for (const root of filtered) {
      if (root) {
        result.push(root)
      }
    }

    setData(result);
    setText(keyword);
  }, [setText, setIndex]);


  useEffect(() => {
    if (open) {
      setEnabled(false)
      setMode("INSERT")
      setText("projects")
    } else {
      setEnabled(true)
      setMode("NORMAL")
    }
  }, [open, setEnabled, setMode, qc])

  return <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
      {children}
    </DialogTrigger>
    <DialogContent className="sm:max-w-md font-mono">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <LayoutDashboard className="size-5" />
          Projects
        </DialogTitle>
        <DialogDescription>
          Cool and exciting projects I’ve been lucky to be part of — building, learning, and growing.
        </DialogDescription>
        <ProjectTree data={data} search={text} />
        <div className="flex items-center justify-between mt-2">
          <div className="flex">
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
      </DialogHeader>
      <DialogFooter className="w-full font-mono mt-2">
        <div className="relative w-full">
          <KeyBindedInput keyBind="/" content={(ref) => <Input
            onFocus={() => setMode("INSERT")}
            onBlur={() => setMode("NORMAL")}
            ref={ref} className="pl-10" placeholder="Search..." autoFocus onChange={(e) => filterHandler(e.target.value)} />
          } />
          <span className="absolute left-2 top-1/2 -translate-y-1/2 size-6 p-1 flex items-center justify-center text-primary bg-background">
            /
          </span>
        </div>
      </DialogFooter>
    </DialogContent>
  </Dialog>
}

