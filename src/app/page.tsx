"use client"
import { NvimBadge } from "@/components/atoms/nvim-badge";
import { useNvimNavigate } from "@/hooks/nvim-navigation";
import { Card } from "@/components/ui/card";
import { GitBranch } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/organisms/header";
import { ProjectsDialog } from "@/components/organisms/projects-dialog";
import { KeyBindedButton } from "@/components/molecules/key-binded-element";
import { useNvimStore } from "@/store/nvim-store";


export default function Home() {

  const { index, length } = useNvimNavigate({
    id: "main-page",
  })

  const enabled = useNvimStore(state => state.enabled);
  const mode = useNvimStore(state => state.mode);

  return <div className="flex justify-center items-center h-screen">
    <main className="w-full" id="main-page">
      <Card className="max-w-4xl font-mono mx-auto">
        <div className="px-4 flex flex-col gap-6">
          <Header />
          <Link href="https://www.linkedin.com/company/focus-global-inc" target="_blank" className="group flex gap-[1ch] mt-1 nvim-line" tabIndex={0}>
            <h2 className="font-bold text-primary select-text">
              # Full Stack Software Engineer
            </h2>
            <span className="group-focus:underline group-focus:underline-offset-2">
              @FocusGlobalInc
            </span>
          </Link>
          {JSON.stringify({ enabled })}

          <p tabIndex={0} className="nvim-line">
            Startup enthusiast with a love for early-stage chaos — co-founded <Link href="https://www.aetherlenz.com" className="underline underline-offset-2 font-semibold">
              AetherLenz
            </Link>.
          </p>

          <div className="p-3.5 rounded border relative mt-2">
            <label className="absolute left-3.5 -top-3 px-2 bg-card-foreground text-card">
              Contents
            </label>
            <div className="mt-4 space-y-1.5">
              <KeyBindedButton keyBind="P" content={(ref) => <ProjectsDialog>
                <button className="group w-full flex items-center gap-2 nvim-line" ref={ref}>
                  <NvimBadge text="P" />
                  Projects
                </button>
              </ProjectsDialog>} />

              <button className="group w-full flex items-center gap-2 nvim-line">
                <NvimBadge text="B" />
                Blogs
              </button>
              <button className="group w-full flex items-center gap-2 nvim-line">
                <NvimBadge text="L" />
                Links
              </button>
              <button className="group w-full flex items-center gap-2 nvim-line">
                <NvimBadge text="/" />
                Search
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex">
            <p className="px-2 text-card-foreground w-fit bg-[#7880B5]">
              {mode}
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
              {((index + 1) * 100 / length).toFixed()}%
            </p>
            <p className="px-2 text-card-foreground w-fit bg-[#7880B5] tracking-wider">
              {index + 1}:{length}
            </p>
          </div>
        </div>
      </Card>
    </main>
  </div>;
}
