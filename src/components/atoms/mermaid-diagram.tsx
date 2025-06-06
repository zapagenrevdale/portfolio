"use client"
import mermaid from "mermaid"

import { JSX, useEffect, useRef } from "react"

export function MermaidDiagram({ chart }: { chart: string }): JSX.Element {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      mermaid.initialize({
        theme: "dark",
        themeVariables: {
          primaryColor: "#c084fc",
          primaryTextColor: "#e4e4e7",
          primaryBorderColor: "#52525b",
          lineColor: "#71717a",
          secondaryColor: "#3f3f46",
          tertiaryColor: "#27272a",
          background: "#18181b",
          mainBkg: "#27272a",
          secondBkg: "#3f3f46",
          tertiaryBkg: "#52525b",
        },
        fontFamily: "monospace",
      })

      mermaid.render(`mermaid-${Date.now()}`, chart).then(({ svg }) => {
        if (ref.current) {
          ref.current.innerHTML = svg
        }
      })
    }
  }, [chart])

  return <div ref={ref} className="flex justify-center" />
}
