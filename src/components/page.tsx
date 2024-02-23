import { format, compareDesc } from "date-fns";
import { MDXRemoteSerializeResult } from "next-mdx-remote"
import MDX from "./mdx"
import { PageItem, PageListItem } from "@/types/page"
import Link from "next/link";

export function Page({ content, pages }: { content?: MDXRemoteSerializeResult, pages?: PageListItem[] }) {
  return <MDX {...content as MDXRemoteSerializeResult} pages={pages as PageListItem[]} />
}

export function List({ list, title }: { list?: PageItem[], title?: string }) {
  list?.sort((a, b) => compareDesc(a.createTime as Date, b.createTime as Date))
  return (
    <main>
      <h1 className="scroll-m-20 pb-6 text-2xl tracking-tight">{title}</h1>
      <ul className="flex flex-col gap-4">
        {list?.map(e =>
          <Link href={(e.slug as string[]).join('/')} className="group flex flex-col md:flex-row justify-between gap-2" key={e.title}>
            <h3 className="transition-colors group-hover:text-fg-hover-color">{e.title}</h3>
            <time dateTime={e.createdTime as string}>{format(new Date(e.createdTime as Date), "MMM dd, yyyy")}</time>
          </Link>
        )}
      </ul>
    </main>
  )
}

export function Article({ content, pages, title }: { content?: MDXRemoteSerializeResult, pages?: PageListItem[], title?: string }) {
  return (
    <>
      <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-3xl mt-6">{title}</h1>
      <div className="flex justify-between items-center mt-4 mb-6 text-sm max-w-[650px]">
        <span className="text-sm text-neutral-600 dark:text-neutral-400">January 7, 2024 (1mo ago)</span>
        <span className="text-neutral-600 dark:text-neutral-400">46,902 views</span>
      </div>
      <article className="prose prose-quoteless prose-neutral dark:prose-invert">
        <MDX {...content as MDXRemoteSerializeResult} pages={pages as PageListItem[]} />
      </article>
    </>
  )
}

const page = {
  list: List,
  page: Page,
  article: Article,
}

export default page