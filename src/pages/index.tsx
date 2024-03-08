import { MDXRemoteSerializeResult } from "next-mdx-remote"
import { serialize } from "next-mdx-remote/serialize"
import { getAllPages, getPageById } from "@/libs/page"


export async function getStaticProps() {
  const pages = await getAllPages()
  const data = await getPageById(pages[0].id)
  const mdx = await serialize(data.content as string)
  return {
    props: {
      content: mdx,
      pages
    }
  }
}