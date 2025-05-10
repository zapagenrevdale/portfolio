import { NvimBadge } from "@/components/atoms/nvim-badge";
import { Card } from "@/components/ui/card";
import { FileText, GitBranch, Github, LayoutDashboard } from "lucide-react";
import Link from "next/link";


export default function Home() {
  return <div className="flex justify-center items-center h-screen">
    <main className="w-full">
      <Card className="max-w-2xl font-mono mx-auto">
        <div className="px-4 flex flex-col gap-6">
          <div className="border w-full flex justify-between p-2 rounded">
            <Link href="/">
              {"</"}<span className="text-primary">#</span>{">GenrevZapa"}
            </Link>
            <div className="flex gap-5">
              <Link className="flex gap-2 items-start" href="/">
                <FileText className="size-5" />
                <p className="font-thin">Resume</p>
              </Link>
              <Link className="flex gap-2 items-start" href="/">
                <LayoutDashboard className="size-5" />
                <p className="font-thin">Projects</p>
              </Link>
              <Link className="flex gap-2 items-start" href="/">
                <Github className="size-5" />
                <p className="font-thin">Github</p>
              </Link>
            </div>
          </div>

          <div className="flex gap-[1ch] mt-1">
            <h2 className="font-bold text-primary">
              # Full Stack Software Engineer
            </h2>
            <Link className="" href="/">
              @FocusGlobalInc
            </Link>
          </div>

          <p>
            Startup enthusiast with a love for early-stage chaos — co-founded <Link href="https://www.aetherlenz.com" className="underline underline-offset-2 font-semibold">
              AetherLenz
            </Link>.
          </p>

          <div className="p-3.5 rounded border relative mt-2">
            <label className="absolute left-3.5 -top-3 px-2 bg-card-foreground text-card">
              Contents
            </label>
            <div className="mt-4 space-y-1.5">
              <div className="flex items-center gap-2">
                <NvimBadge text="P" />
                Projects
              </div>
              <div className="flex items-center gap-2">
                <NvimBadge text="B" />
                Blogs
              </div>
              <div className="flex items-center gap-2">
                <NvimBadge text="L" />
                Links
              </div>
              <div className="flex items-center gap-2">
                <NvimBadge text="/" />
                Search
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex">
            <p className="px-2 text-card-foreground w-fit bg-[#7880B5]">
              NORMAL
            </p>
            <p className="px-2 text-[#7880B5] bg-background">
              <GitBranch className="inline-flex h-4" /> main
            </p>
            <p className="px-2">
              homepage.tsx
            </p>
          </div>
          <div className="flex">
            <p className="px-2">
              utf-8
            </p>
            <p className="px-3 bg-background">
              Top
            </p>
            <p className="px-2 text-card-foreground w-fit bg-[#7880B5] tracking-wider">
              1:1
            </p>
          </div>
        </div>

      </Card>
    </main>
  </div>;
}
