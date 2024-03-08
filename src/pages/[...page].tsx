import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { getAllPages, getDatabaseById, getPageById } from "@/libs/page";
import Component from "@/components/page";
import Metadata from "@/components/metadata";
import { Article } from "@/type";

interface Props {
  title: string;
  lists?: Article[];
  type: 'list' | 'article' | 'page';
  metadata?: any;
  content: MDXRemoteSerializeResult;
}

export async function getStaticPaths() {
  const res = await getAllPages()
  const paths = res.map((post: any) => ({
    params: { page: post?.slug },
  }))
  return { paths, fallback: false }
}

export async function getStaticProps({ params: { page } }: { params: { page: string[] } }) {
  const pages = await getAllPages()
  const pgs = pages.filter(pg => {
    const slug = pg.slug
    if (slug.length !== page.length) return false
    for (let i = 0; i < slug.length; i++) {
      if (slug[i] !== page[i]) {
        return false
      }
    }
    return true
  })
  if (!pgs.length) {
    return {
      notFound: true,
    }
  }
  const currentPage = pgs[0]
  if (currentPage.type === 'list') {
    const { title, articles } = await getDatabaseById(currentPage.id)
    return {
      props: {
        title,
        type: currentPage.type,
        list: articles
      }
    }
  }
  const { title, content, ...metadata } = await getPageById(currentPage.id);
  return {
    props: {
      title,
      type: currentPage.type,
      metadata,
      content
    }
  }
}

export default function Page({ title, lists, content, type, metadata }: Props) {
  return (
    <>
      <Metadata title={title} description={metadata?.summary} />
      <Component />
    </>
  )
}