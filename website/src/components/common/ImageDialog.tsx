import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogPortal,
  DialogTrigger,
} from "../ui/dialog";
import Image from "next/image";
import { ZoomIn } from "lucide-react";

export default function ImageDialog({
  imgUrl,
}: Readonly<{ imgUrl: string | null }>) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button disabled={!imgUrl} className="w-fit  bg-black/40 hover:bg-black/80 text-white p-2 rounded-md">
          <ZoomIn className="h-5 w-5"/>
        </button>
      </DialogTrigger>
      <DialogPortal>
        <DialogContent className="bg-transparent border-none">
          <Image src={imgUrl ?? ""} alt="" width={1000} height={1000} />
          <DialogClose />
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
