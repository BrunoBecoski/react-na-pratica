import * as Dialog from "@radix-ui/react-dialog";
import { Check, X } from "lucide-react";

import { Button } from "./ui/button";

export function CreateTagForm() {
  return (
    <form className="w-full space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium block" htmlFor="name">Tag name</label>
        <input
          className="border border-zinc-800 rounded-lg px-3 py-2.5 bg-zinc-800/50 w-full text-sm"
          id="name" 
          type="text"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium block" htmlFor="slug">Slug</label>
        <input
          className="border border-zinc-800 rounded-lg px-3 py-2.5 bg-zinc-800/50 w-full text-sm"
          id="slug"
          type="text"
          readOnly
        />
      </div>

      <div className="flex items-center justify-end gap-2">
        <Dialog.Close asChild>
          <Button>
            <X className="size-3" />
            Cancel
          </Button>
        </Dialog.Close>
        
        <Button className="bg-teal-400 text-teal-950 hover:bg-teal-500" type="submit">
          <Check className="size-3" />
          Save
        </Button>
      </div>
    </form>
  )
}