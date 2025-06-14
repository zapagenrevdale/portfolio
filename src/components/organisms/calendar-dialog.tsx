import Cal from "@calcom/embed-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

export function CalendarDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl w-full p-0 overflow-hidden">
        <DialogTitle className="hidden" aria-hidden>
          Book a meeting w/ Genrev
        </DialogTitle>
        <ScrollArea className="max-h-[90vh] w-full flex justify-center items-center">
          <Cal
            calLink="/genrev-zapa/chat-with-genrev"
            config={{
              layout: "month_view",
            }}
          />
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
