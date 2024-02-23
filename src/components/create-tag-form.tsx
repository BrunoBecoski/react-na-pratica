import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Dialog from "@radix-ui/react-dialog";
import { Check, Loader2, X } from "lucide-react";

import { Button } from "./ui/button";

const createTagSchema = z.object({
  title: z.string().min(3, { message: 'Minimum 3 characters.'})
})

type CreateTagSchema = z.infer<typeof createTagSchema>

function getSlugFromString(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, '-')
}

export function CreateTagForm() {
  const queryClient = useQueryClient();

  const { register, handleSubmit, watch, formState, reset } = useForm<CreateTagSchema>({ 
    resolver: zodResolver(createTagSchema)
  });

  const slug = watch('title') 
    ? getSlugFromString(watch('title'))
    : ''

  const { mutateAsync } = useMutation({
    mutationFn: async ({ title }: CreateTagSchema) => {
      // delay 2s
      // await new Promise(resolver => setTimeout(resolver, 2000))

      await fetch('http://localhost:3333/tags', {
        method: 'POST',
        body: JSON.stringify({
          title,
          slug,
          amountOfVideos: 0
        })
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['get-tags']
      }),
      reset()
    }
  })

  async function createTag({ title }: CreateTagSchema) {
    await mutateAsync({ title })
  }

  return (
    <form onSubmit={handleSubmit(createTag)} className="w-full space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium block" htmlFor="name">Tag name</label>
        
        <input
          className="border border-zinc-800 rounded-lg px-3 py-2.5 bg-zinc-800/50 w-full text-sm"
          id="name" 
          type="text"
          {...register('title')}
        />

        {formState.errors?.title && (
          <p className="text-sm text-red-400">{formState.errors.title?.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium block" htmlFor="slug">Slug</label>
        
        <input
          className="border border-zinc-800 rounded-lg px-3 py-2.5 bg-zinc-800/50 w-full text-sm"
          id="slug"
          type="text"
          readOnly
          value={slug}
        />
      </div>

      <div className="flex items-center justify-end gap-2">
        <Dialog.Close asChild>
          <Button>
            <X className="size-3" />
            Cancel
          </Button>
        </Dialog.Close>
        
        <Button
          className="bg-teal-400 text-teal-950 hover:bg-teal-500"
          type="submit"
          disabled={formState.isSubmitting}
        >
          {formState.isSubmitting 
            ? <Loader2 className="size-3 animate-spin" />
            : <Check className="size-3" />
          }
          Save
        </Button>
      </div>
    </form>
  )
}