"use client";
import { useNvimNavigate } from "@/hooks/nvim-navigation";
import { Card } from "@/components/ui/card";
import { GitBranch } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/organisms/header";
import { useNvimStore } from "@/store/nvim-store";
import { MainInput } from "@/components/molecules/main-input";
import { MainContents } from "@/components/molecules/main-contents";

export default function Home() {
  const mode = useNvimStore((state) => state.mode);

  const { index, length } = useNvimNavigate({
    group: "home",
  });

  return (
    <div className="flex justify-center items-center h-screen">
      <main className="w-full px-1" id="main-page">
        <Card className="max-w-4xl font-mono mx-auto gap-2 pb-0 overflow-hidden relative">
          <div className="px-4 flex flex-col gap-6">
            <Header />

            <Link
              data-nvim="home"
              href="https://www.linkedin.com/company/focus-global-inc"
              target="_blank"
              className="relative group flex gap-[1ch] mt-1 nvim-line"
            >
              <h2 className="font-bold text-primary select-text">
                # Full Stack Software Engineer{" "}
                <span className="group-focus:underline group-focus:underline-offset-2 text-primary-foreground/90">
                  @FocusGlobalInc
                </span>
              </h2>
            </Link>
            <Link
              href="https://www.aetherlenz.com"
              data-nvim="home"
              className="nvim-line"
              target="_blank"
            >
              Startup enthusiast with a love for early-stage chaos — co-founded{" "}
              <span className="underline underline-offset-2 font-semibold">
                AetherLenz
              </span>
              .
            </Link>
            <MainContents />
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="flex">
              <p className="px-2 text-card-foreground w-fit bg-[#7880B5]">
                {mode}
              </p>
              <p className="px-2 text-[#7880B5] bg-background">
                <GitBranch className="inline-flex h-4" /> main
              </p>
              <p className="hidden sm:inline-flex px-2">homepage.tsx</p>
              <p className="sm:hidden px-2">home.tsx</p>
            </div>
            <div className="flex">
              <p className="px-2 hidden sm:inline-flex">utf-8</p>
              <p className="px-3 bg-background">
                {(((index + 1) * 100) / length).toFixed()}%
              </p>
              <p className="px-2 text-card-foreground w-fit bg-[#7880B5] tracking-wider">
                {index + 1}:{length}
              </p>
            </div>
          </div>
          <MainInput />
        </Card>
      </main>
    </div>
  );
}
