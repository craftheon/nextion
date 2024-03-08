import { MDXRemoteSerializeResult } from "next-mdx-remote"
import { serialize } from "next-mdx-remote/serialize"
import Component from "@/components/page";
import { getAllPages, getPageById } from "@/libs/page";
import Metadata from "@/components/metadata";


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


export default function Index() {
  return (
    <>
      <Metadata />
      <Component type="page" />
    </>
  )
}