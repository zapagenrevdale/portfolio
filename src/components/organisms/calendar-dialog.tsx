import Cal from "@calcom/embed-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";

export function CalendarDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="h-[90vh] overflow-hidden max-w-3xl w-full p-0 ">
        <DialogTitle className="hidden" aria-hidden>
          Book a meeting w/ Genrev
        </DialogTitle>
        <ScrollArea className="h-[90vh] w-full flex justify-center items-center">
          <Cal
            calLink="/genrev-zapa/chat-with-genrev"
            config={{
              layout: "month_view",
            }}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
