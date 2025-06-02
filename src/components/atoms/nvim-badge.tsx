export function NvimBadge({ text }: { text: string }) {
  return (
    <div className="text-primary text-center align-middle bg-background w-8 h-7 aspect-square px-1.5 group-focus-visible:bg-card-foreground/70 flex items-center justify-center">
      <p className="group-focus-visible:text-card group-focus-visible:font-bold w-fit h-full px-0.5">
        {text}
      </p>
    </div>
  );
}
