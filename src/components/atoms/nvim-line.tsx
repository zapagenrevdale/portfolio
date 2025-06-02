export function NvimLine({
  group,
  children,
}: {
  group: string;
  children: React.ReactNode;
}) {
  return (
    <div data-nvim={group} className="group nvim-line" tabIndex={0}>
      {children}
    </div>
  );
}
