import { keepPreviousData ,useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { FileDown, MoreHorizontal, Plus, Search } from "lucide-react";


import { Header } from "./components/header";
import { Tabs } from "./components/tabs";
import { Button } from "./components/ui/button";
import { Control, Input } from "./components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table";
import { Pagination } from "./components/pagination";

export interface TagResponse {
  first: number
  prev: number | null
  next: number | null
  last: number
  pages: number
  items: number
  data: Tag[]
}

export interface Tag {
  title: string
  amountOfVideos: number
  id: string
}


export function App() {
  const [searchParams] = useSearchParams()

  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1

  const { data: tagsResponse, isLoading } = useQuery<TagResponse>({
    queryKey: ['get-tags', page],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3333/tags?_page=${page}&_per_page=10`)
      const data = await response.json()

      // delay 2s
      await new Promise(resolver => setTimeout(resolver, 2000))

      return data
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60, // 60s 
  })

  if (isLoading) {
    return null
  }

  return (
    <div className="p-10 space-y-8">
      <main className="max-w-6xl mx-auto space-y-5">
        <Header />

        <Tabs />

        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold">Tags</h1>

          <Button variant="primary">
            <Plus className="size-3" />
            Create new
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <Input variant="filter">
            <Search className="size-3" />
            <Control placeholder="Search tags" />
          </Input>

          <Button>
            Export
            <FileDown className="size-3" />
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Tag</TableHead>
              <TableHead>Amount of videos</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {tagsResponse?.data.map((tag) => {
              return (
                <TableRow key={tag.id}>
                  <TableCell></TableCell>
                  
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium text-zinc-100">{tag.title}</span>
                      <span className="font-sm text-zinc-500">{tag.id}</span>
                    </div>
                  </TableCell>
    
                  <TableCell className="text-zinc-300">
                    {tag.amountOfVideos} vídeo(s)
                  </TableCell>
    
                  <TableCell className="text-right">
                    <Button size="icon">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

        {tagsResponse && 
          <Pagination
            pages={tagsResponse.pages}
            items={tagsResponse.items}
            page={page}
          />
        }        
      </main>
    </div>
  );
} 