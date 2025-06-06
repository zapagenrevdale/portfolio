import Link from "next/link";
import { Github, LayoutDashboard } from "lucide-react";
import { ProjectsDialog } from "./projects-dialog";
import { useClickableKeyBinding } from "@/hooks/nvim-keybind";

export function Header() {
  //const resumeButtonRef = useClickableKeyBinding<HTMLAnchorElement>({
  //  keyBind: {
  //    key: "r",
  //  },
  //  group: "home",
  //});

  const githubButtonRef = useClickableKeyBinding<HTMLAnchorElement>({
    keyBind: {
      key: "g",
    },
    group: "home",
  });

  return (
    <header className="border w-full flex justify-between p-2 rounded">
      <Link href="/">
        {"</"}
        <span className="text-primary">#</span>
        {">"}
        <strong>GenrevZapa</strong>
      </Link>
      <nav className="hidden md:flex gap-5">
        {/* 
        <Link
          className="flex gap-2 items-start"
          ref={resumeButtonRef}
          href="/"
        >
          <FileText className="size-5" />
          <p className="font-thin">[R]esume</p>
        </Link>
        */}
        <ProjectsDialog>
          <button className="flex gap-2 items-start">
            <LayoutDashboard className="size-5" />
            <p className="font-thin">[P]rojects</p>
          </button>
        </ProjectsDialog>
        <Link
          className="flex gap-2 items-start"
          ref={githubButtonRef}
          href="https://github.com/zapagenrevdale"
          target="_blank"
        >
          <Github className="size-5" />
          <p className="font-thin">[G]ithub</p>
        </Link>
      </nav>
      <nav className="flex md:hidden gap-4">
        {/* 
          <Link
            className="flex gap-2 items-start"
            ref={resumeButtonRef}
            href="/resume"
            target="_blank"
          >
            <FileText className="size-5" />
          </Link>
        */}
        <ProjectsDialog>
          <button className="flex gap-2 items-start">
            <LayoutDashboard className="size-5" />
          </button>
        </ProjectsDialog>
        <Link
          className="flex gap-2 items-start"
          ref={githubButtonRef}
          href="https://github.com/zapagenrevdale"
          target="_blank"
        >
          <Github className="size-5" />
        </Link>
      </nav>
    </header>
  );
}
