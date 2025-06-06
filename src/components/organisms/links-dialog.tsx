"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowDown,
  ArrowUp,
  Github,
  Instagram,
  Link2,
  Linkedin,
} from "lucide-react";
import { useNvimStore } from "@/store/nvim-store";
import { useEffect, useState } from "react";
import { DialogInput } from "../molecules/dialog-input";
import { LinkList } from "../molecules/my-links";

const blogList = [
  {
    title: "Github",
    url: "https://github.com/zapagenrevdale",
    Icon: Github,
  },
  {
    title: "LinkedIn",
    url: "https://www.linkedin.com/in/genrev-dale-zapa",
    Icon: Linkedin,
  },
  {
    title: "Instagram",
    url: "https://www.instagram.com/_porarisu",
    Icon: Instagram,
  },
];

export function LinksDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [data, setData] = useState(blogList);

  const { setMode, setGroup } = useNvimStore();

  const group = `blog-list-${text}`;

  useEffect(() => {
    if (open) {
      setData(blogList);
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

  const filterBlogs = (search: string) => {
    setData(
      blogList.filter((blog) =>
        blog.title.toLowerCase().includes(search.toLowerCase()),
      ),
    );
    setText(search);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="sm:max-w-md font-mono gap-0 p-0"
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="p-4">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link2 className="size-5" />
              Links
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
            My API endpoints for human interaction.
          </DialogDescription>
        </DialogHeader>
        <LinkList data={data} search={text} />
        <DialogFooter className="w-full font-mono grid grid-cols-1">
          <DialogInput
            setOpen={setOpen}
            setText={setText}
            text={text}
            callback={filterBlogs}
            group={group}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
