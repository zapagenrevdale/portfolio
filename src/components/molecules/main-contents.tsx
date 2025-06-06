import { NvimBadge } from "@/components/atoms/nvim-badge";
import { ProjectsDialog } from "@/components/organisms/projects-dialog";
import { useClickableKeyBinding } from "@/hooks/nvim-keybind";
import { BlogsDialog } from "../organisms/blogs-dialog";
import { ArrowDown, ArrowUp } from "lucide-react";
import { LinksDialog } from "../organisms/links-dialog";

export function MainContents() {
  const projectButtonRef = useClickableKeyBinding<HTMLButtonElement>({
    keyBind: "p",
    group: "home",
  });

  const blogButtonRef = useClickableKeyBinding<HTMLButtonElement>({
    keyBind: "b",
    group: "home",
  });

  const linksButtonRef = useClickableKeyBinding<HTMLButtonElement>({
    keyBind: "l",
    group: "home",
  });

  return (
    <div className="p-3.5 rounded border relative mt-2">
      <label className="absolute left-3.5 -top-3 px-2 bg-card-foreground text-card">
        Contents
      </label>
      <div className="flex gap-1.5 text-xs items-center text-foreground/80 absolute right-1 top-1">
        <span className="bg-card-foreground/10 text-primary font-bold px-1 flex justify-center items-center">
          <ArrowDown className="size-3 inline-flex" />j
        </span>
        <span className="bg-card-foreground/10 text-primary font-bold px-1 flex justify-center items-center">
          <ArrowUp className="size-3 inline-flex" />k
        </span>
        <span className="bg-card-foreground/10 text-primary font-bold px-1 flex justify-center items-center">
          enter
        </span>
      </div>
      <div className="mt-4 space-y-1.5">
        <ProjectsDialog>
          <button
            className="group w-full flex items-center gap-2 nvim-line"
            ref={projectButtonRef}
            data-nvim="home"
          >
            <NvimBadge text="P" />
            Projects
          </button>
        </ProjectsDialog>
        <BlogsDialog>
          <button
            className="group w-full flex items-center gap-2 nvim-line"
            data-nvim="home"
            ref={blogButtonRef}
          >
            <NvimBadge text="B" />
            Blogs
          </button>
        </BlogsDialog>
        <LinksDialog>
          <button
            className="group w-full flex items-center gap-2 nvim-line"
            data-nvim="home"
            ref={linksButtonRef}
          >
            <NvimBadge text="L" />
            Links
          </button>
        </LinksDialog>
      </div>
    </div>
  );
}
