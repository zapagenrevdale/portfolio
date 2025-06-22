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
import { ArrowDown, ArrowUp, FileDigit } from "lucide-react";
import { useNvimStore } from "@/store/nvim-store";
import { useEffect, useState } from "react";
import { DialogInput } from "../molecules/dialog-input";
import { BlogList } from "../molecules/blog-list";

const blogList = [
  {
    title: "OMNI: An Architecture Overview",
    url: "/blogs/omni-architecture",
    date: "2025-06-06T04:00:00.000Z",
  },
  {
    title: "A Glimpse into AetherLenz's Architecture",
    url: "/blogs/aetherlenz-architecture",
    date: "2025-06-07T05:00:00.000Z",
  },
  {
    title: "Lazy Reader: How I Built a Smarter, Shorter Way to Read Blogs",
    url: "/blogs/lazy-reader",
    date: "2025-06-06T04:00:00.000Z",
  },
  {
    title: "B2B SaaS: How I Automated Preview Deployments and On-Prem Delivery",
    url: "/blogs/b2b-saas",
    date: "2025-06-022T10:00:00.000Z",
  },
];

export function BlogsDialog({ children }: { children: React.ReactNode }) {
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
              <FileDigit className="size-5" />
              Blogs
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
            Me talking to myself, but publicly.
          </DialogDescription>
        </DialogHeader>
        <BlogList search={text} data={data} />
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
