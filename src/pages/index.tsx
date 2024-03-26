import { MDXRemoteSerializeResult } from "next-mdx-remote"
import { serialize } from "next-mdx-remote/serialize"
import Component from "@/components/page";
import { getAllPages, getPageById } from "@/libs/page";
import Metadata from "@/components/metadata";
import Layout from "@/components/layout";
import { PageInfo } from "@/type";
import { getNavs } from "@/libs/site";

export interface Props {
  content: MDXRemoteSerializeResult;
  pages: PageInfo[]
}

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


export default function Index({ pages, content }: Props) {
  const navs = getNavs(pages)
  return (
    <Layout navs={navs}>
      <Metadata />
      <Component type="page" content={content} />
    </Layout>
  )
}