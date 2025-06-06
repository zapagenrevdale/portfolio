import { useInputKeyBinding } from "@/hooks/nvim-keybind";
import { Input } from "../ui/input";
import { useNvimStore } from "@/store/nvim-store";

export function DialogInput({
  group,
  text,
  setText,
  callback,
  setOpen,
}: {
  group: string;
  setText: (val: string) => void;
  text: string;
  callback: (keyword: string) => void;
  setOpen: (val: boolean) => void;
}) {
  const setMode = useNvimStore((state) => state.setMode);
  const inputRef = useInputKeyBinding<HTMLInputElement>({
    keyBind: ["/", { key: ":", shift: true }],
    group,
  });

  return (
    <form
      className="relative w-full group mt-1"
      onSubmit={(e) => {
        e.preventDefault();
        if (text === "q" || text === "bd") {
          setText("");
          setMode("NORMAL");
          setOpen(false);
        }
      }}
    >
      <Input
        hidden={true}
        value={text}
        placeholder="Search or command..."
        onChange={(e) => callback(e.target.value)}
        ref={inputRef}
        className="pl-10 rounded-b border-none"
      />
      <span className="absolute left-2 top-1/2 -translate-y-1/2 size-6 p-1 hidden items-center justify-center text-primary bg-background group-focus-within:flex">
        /:
      </span>
      <div className="absolute top-1/2 -translate-y-1/2 right-1 text-xs font-light hidden group-focus-within:block">
        <span className="bg-background/60 font-semibold px-1.5 py-1 text-primary">
          esc
        </span>
      </div>
      <button type="submit" className="hidden" />
    </form>
  );
}
