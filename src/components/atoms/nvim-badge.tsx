

export function NvimBadge({ text }: { text: string }) {
  return <p className="text-primary text-center align-middle bg-background w-8 h-7 aspect-square px-1.5 py-0.5">
    {text}
  </p>
}
