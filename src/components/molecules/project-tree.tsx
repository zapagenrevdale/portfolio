"use client"
import { useAutoAnimate } from '@formkit/auto-animate/react'
import React from "react"
import { Folder, File, MoveUpRight, Globe, FileText } from "lucide-react"
import { ScrollArea } from '@/components/ui/scroll-area'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export type TreeItemType = {
  name: string
  children?: TreeItemType[]
  link?: string
}

interface TreeViewProps {
  data: TreeItemType[]
}

interface TreeItemProps {
  item: TreeItemType
  level: number
  isLast: boolean
  parentIsLast?: boolean[]
}

const TreeItem = ({ item, level, isLast, parentIsLast = [] }: TreeItemProps) => {
  const [expanded, setExpanded] = useState(true)
  const hasChildren = item.children && item.children.length > 0

  const renderPrefix = () => {
    return parentIsLast.map((isParentLast, idx) => (
      <span key={idx} className="inline-block w-4 text-center">
        {isParentLast ? " " : "│"}
      </span>
    ))
  }

  return (
    <div className="whitespace-pre" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      <button
        onClick={() => item.link ? window.open(item.link, "_blank") : setExpanded(!expanded)}
        className="flex items-center nvim-line rounded-none w-full group">
        {renderPrefix()}
        <span className="inline-block w-4 text-center">{isLast ? "└" : "├"}</span>
        <span className="inline-block w-4 text-center">{"─"}</span>
        <div
          className={`flex items-center gap-2 ${hasChildren ? "cursor-pointer" : "cursor-default group-focus-visible:underline group-focus-visible:text-primary hover:underline underline-offset-2"}`}
        >
          {hasChildren ? (
            <>
              <Folder className="size-4 text-yellow-500" />
              <span>{item.name}</span>
            </>
          ) : (
            <>
              {item.name.endsWith(".md") ? <FileText className="size-4" /> : <Globe className="size-4" />}
              <span>{item.name}</span>
            </>
          )}
        </div>
      </button>

      {hasChildren ? (
        <div className={cn({ "hidden": !expanded })}>
          {item.children?.map((child, index) => (
            <TreeItem
              key={child.name}
              item={child}
              level={level + 1}
              isLast={index === item.children!.length - 1}
              parentIsLast={[...parentIsLast, isLast]}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

export const ProjectTree = ({ data, search }: TreeViewProps & { search: string }) => {
  const [animationParent] = useAutoAnimate();

  return <ScrollArea className="h-80 p-4 bg-gray-800">
    <div className="space-y-0.5" ref={animationParent} id={`project-tree-${search}`}>
      {data.length > 0 ? data.map((item, index) => (
        <TreeItem key={item.name} item={item} level={0} isLast={index === data.length - 1} parentIsLast={[]} />
      )) : <div>
        If it&apos;s not here. Why dont <span className="font-semibold text-yellow-500">we build it together?</span>
      </div>}
    </div>
  </ScrollArea >
}
