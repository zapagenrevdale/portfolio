"use client";

import { Copy } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";

export function CodeCopy({
  code,
  language,
}: {
  code: string;
  language: string;
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-6 w-6 p-0 text-zinc-400 hover:text-zinc-200"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(code);
          toast.success(`Copied ${language} snippet`);
        } catch (err) {
          console.error("Failed to copy code:", err);
        }
      }}
    >
      <Copy size={12} />
    </Button>
  );
}
