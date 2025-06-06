import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft, FileText } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { MermaidDiagram } from "@/components/atoms/mermaid-diagram";
import OmniBlogContent from "@/components/markdowns/omni-architecture";
import { CodeCopy } from "@/components/atoms/code-copy";
import Link from "next/link";

export const metadata = {
  title: "Blogs | OMNI Architecture",
  description: "OMNI: An Architecture Overview",
  keywords: "architecture, sst, overview",
};

const customDarkTheme = {
  ...vscDarkPlus,
  'pre[class*="language-"]': {
    ...vscDarkPlus['pre[class*="language-"]'],
    background: "#27272a",
    fontSize: "14px",
    lineHeight: "1.5",
  },
  'code[class*="language-"]': {
    ...vscDarkPlus['code[class*="language-"]'],
    background: "#27272a",
    fontSize: "14px",
    lineHeight: "1.5",
  },
};

export default function OmniBlog() {
  return (
    <div className="max-w-5xl mx-auto py-10 px-1">
      <Card className="py-0">
        <CardHeader className="flex items-center justify-between rounded-t-lg p-3 m-0 border-b border-card-foreground">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-green-400" />
            <span className="font-mono text-sm">omni-architecture.md</span>
          </div>
          <Link href="/">
            <ArrowLeft className="size-5" />
          </Link>
        </CardHeader>
        <CardContent className="font-mono">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ node: _, ...props }) => (
                <>
                  <h1
                    className="text-primary text-3xl font-bold mt-8 mb-6"
                    {...props}
                  />
                  <Separator className="mb-6 bg-zinc-700" />
                </>
              ),
              h2: ({ node: _, ...props }) => (
                <h2
                  className="text-secondary text-2xl font-bold mt-8 mb-4"
                  {...props}
                />
              ),
              h3: ({ node: _, ...props }) => (
                <h3
                  className="text-purple-400 text-xl font-bold mt-6 mb-3"
                  {...props}
                />
              ),
              p: ({ node: _, ...props }) => (
                <p className="my-4 leading-7" {...props} />
              ),
              a: ({ node: _, ...props }) => (
                <a
                  className="text-blue-400 hover:text-blue-300 underline transition-colors"
                  {...props}
                />
              ),
              ul: ({ node: _, ...props }) => (
                <ul className="list-disc pl-6 my-4 space-y-2" {...props} />
              ),
              ol: ({ node: _, ...props }) => (
                <ol className="list-decimal pl-6 my-4 space-y-2" {...props} />
              ),
              li: ({ node: _, ...props }) => (
                <li className="leading-6" {...props} />
              ),
              code: ({ className, children }) => {
                const match = /language-(\w+)/.exec(className || "");
                const language = match ? match[1] : "text";
                const codeString = String(children).replace(/\n$/, "");

                if (language === "mermaid") {
                  return (
                    <Card className="bg-zinc-800 border-zinc-700 p-0 gap-0">
                      <CardHeader className="p-2 border-b border-zinc-700 flex items-center justify-between">
                        <Badge
                          variant="outline"
                          className="w-fit text-zinc-400 border-zinc-600 font-mono text-xs"
                        >
                          mermaid
                        </Badge>
                        <CodeCopy language={language} code={codeString} />
                      </CardHeader>
                      <CardContent className="p-6 bg-zinc-900">
                        <MermaidDiagram chart={codeString} />
                      </CardContent>
                    </Card>
                  );
                }

                return (
                  <Card className="bg-zinc-800 border-zinc-700 p-0 gap-0">
                    <CardHeader className="p-2 border-b border-zinc-700 flex items-center justify-between">
                      <Badge
                        variant="outline"
                        className="w-fit text-zinc-400 border-zinc-600 font-mono text-xs"
                      >
                        {language}
                      </Badge>
                      <CodeCopy language={language} code={codeString} />
                    </CardHeader>
                    <CardContent className="p-0">
                      <SyntaxHighlighter
                        style={customDarkTheme}
                        language={language}
                        PreTag="div"
                        showLineNumbers={false}
                        wrapLines={true}
                        customStyle={{
                          margin: 0,
                          background: "transparent",
                          padding: "1rem",
                        }}
                      >
                        {codeString}
                      </SyntaxHighlighter>
                    </CardContent>
                  </Card>
                );
              },
              table: ({ children, ...props }) => (
                <div className="rounded overflow-hidden">
                  <table className="w-full border-collapse" {...props}>
                    {children}
                  </table>
                </div>
              ),
              th: ({ children, ...props }) => (
                <th
                  className="border border-zinc-700 px-4 py-3 text-left font-bold text-purple-400 bg-zinc-800/50"
                  {...props}
                >
                  {children}
                </th>
              ),
              td: ({ children, ...props }) => (
                <td
                  className="border border-zinc-700 px-4 py-3 text-zinc-300"
                  {...props}
                >
                  {children}
                </td>
              ),
              strong: ({ node: _, ...props }) => (
                <strong className="text-yellow-300 font-bold" {...props} />
              ),
            }}
          >
            {OmniBlogContent}
          </ReactMarkdown>
        </CardContent>
      </Card>
    </div>
  );
}
