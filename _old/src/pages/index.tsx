import MDX, { serialize } from "@/components/mdx"
import Meta from "@/components/meta"
import Nav from "@/components/nav"
import { getAllPages, getPageById } from "@/libs/page"
import { PageListItem } from "@/types/page"
import { MDXRemoteSerializeResult } from "next-mdx-remote"


export async function getStaticProps() {
  const pages = await getAllPages()
  const data = await getPageById(pages[0].id)
  const mdx = await serialize(data.content as string)
  return {
    props: {
      content: mdx,
      pages,
      navs: pages.filter(e => e.showInNav).map(e => ({ link: e.slug.join('/'), title: e.title }))
    }
  }
}

export default function Home({ content, pages, navs }: { content: MDXRemoteSerializeResult, pages: PageListItem[], navs: { link: string, title: string }[] }) {
  return (
    <>
      <Meta />
      <Nav navs={navs} />
      <article className="prose prose-quoteless prose-neutral dark:prose-invert">
        <MDX {...content} pages={pages} />

      </article>
    </>
  )
}
