import { motion } from "motion/react";
import Confetti from "react-confetti";
import { useInputKeyBinding } from "@/hooks/nvim-keybind";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "../ui/input";

export function MainInput() {
  const [text, setText] = useState("");
  const router = useRouter();
  const [show, setShow] = useState(false);

  const inputRef = useInputKeyBinding<HTMLInputElement>({
    keyBind: ":",
    group: "home",
  });

  const confetti = (
    <motion.div
      className="absolute top-0 left-0 w-full h-full"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 4, duration: 1 }}
    >
      <Confetti className="mx-auto" width={800} height={500} />
    </motion.div>
  );

  return (
    <>
      {show ? confetti : null}
      <form
        className="relative w-full group mt-1"
        onSubmit={(e) => {
          e.preventDefault();
          if (text.toLowerCase() === "q") {
            setText("👁️👄👁️ nooo!!! pls hire me!!!");
            return setTimeout(
              () => router.push("https://youtu.be/xvFZjo5PgG0"),
              1000,
            );
          }
          setShow(true);
          setTimeout(() => setShow(false), 6000);
          setText("");
        }}
      >
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={() => {
            setText("");
          }}
          ref={inputRef}
          className="pl-10 rounded-b border-none"
        />
        <span className="absolute left-2 top-1/2 -translate-y-1/2 size-6 p-1 hidden items-center justify-center text-primary bg-background group-focus-within:flex">
          :
        </span>
        <div className="absolute top-1/2 -translate-y-1/2 right-1 text-xs font-light hidden group-focus-within:block">
          <span className="bg-background/60 font-semibold px-1.5 py-1 text-primary">
            esc
          </span>
        </div>
        <button type="submit" className="hidden" />
      </form>
    </>
  );
}
