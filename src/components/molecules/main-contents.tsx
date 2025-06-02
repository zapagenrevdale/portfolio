import { NvimBadge } from "@/components/atoms/nvim-badge";
import { ProjectsDialog } from "@/components/organisms/projects-dialog";
import { useClickableKeyBinding } from "@/hooks/nvim-keybind";

export function MainContents() {
  const projectButtonRef = useClickableKeyBinding<HTMLButtonElement>({
    keyBind: "p",
    group: "home",
  });

  return (
    <div className="p-3.5 rounded border relative mt-2">
      <label className="absolute left-3.5 -top-3 px-2 bg-card-foreground text-card">
        Contents
      </label>
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
        <button
          className="group w-full flex items-center gap-2 nvim-line"
          data-nvim="home"
        >
          <NvimBadge text="B" />
          Blogs
        </button>
        <button
          className="group w-full flex items-center gap-2 nvim-line"
          data-nvim="home"
        >
          <NvimBadge text="L" />
          Links
        </button>
        <button
          className="group w-full flex items-center gap-2 nvim-line"
          data-nvim="home"
        >
          <NvimBadge text="/" />
          Search
        </button>
      </div>
    </div>
  );
}
