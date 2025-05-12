import Link from "next/link";
import { FileText, Github, LayoutDashboard } from "lucide-react";
import { ProjectsDialog } from "./projects-dialog";
import { KeyBindedLink } from "../molecules/key-binded-element";

export function Header() {
  return <header className="border w-full flex justify-between p-2 rounded">
    <Link href="/">
      {"</"}<span className="text-primary">#</span>{">"}
      <strong>GenrevZapa</strong>
    </Link>
    <nav className="flex gap-5">
      <KeyBindedLink keyBind="R" content={(ref) => <Link className="flex gap-2 items-start" ref={ref} href="/resume" target="_blank">
        <FileText className="size-5" />
        <p className="font-thin">[R]esume</p>
      </Link>
      } />
      <ProjectsDialog>
        <button className="flex gap-2 items-start">
          <LayoutDashboard className="size-5" />
          <p className="font-thin">[P]rojects</p>
        </button>
      </ProjectsDialog>
      <KeyBindedLink keyBind="G" content={(ref) => <Link className="flex gap-2 items-start" ref={ref} href="https://github.com/zapagenrevdale" target="_blank">
        <Github className="size-5" />
        <p className="font-thin">[G]ithub</p>
      </Link>
      } />
    </nav>
  </header>

}
