import MDX, { serialize } from "@/components/mdx"
import { getAllPages, getDatabaseById, getPageById } from "@/libs/page"
import { PageItem, PageListItem } from "@/types/page"
import { MDXRemoteSerializeResult } from "next-mdx-remote"
import pageComponent from "@/components/page"
import Metadata from "@/components/meta"
import Nav from "@/components/nav"

interface Props {
  type: 'list' | 'page' | 'article';
  pages: PageListItem[];
  content?: MDXRemoteSerializeResult;
  list?: PageItem[];
  title?: string;
  navs: { link: string, title: string }[]
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

  if (pgs[0].type === 'list') {
    const { title, list } = await getDatabaseById(pgs[0].id)
    return {
      props: {
        title,
        pages,
        list,
        type: pgs[0].type,
        navs: pages.filter(e => e.showInNav).map(e => ({ link: e.slug.join('/'), title: e.title }))
      }
    }
  }

  const data = await getPageById(pgs[0].id)
  const mdx = await serialize(data.content as string)

  return {
    props: {
      pages,
      title: data.title,
      content: mdx,
      type: pgs[0].type,
      navs: pages.filter(e => e.showInNav).map(e => ({ link: e.slug.join('/'), title: e.title }))
    }
  }
}


export default function MainPage(props: Props) {
  const Component = pageComponent[props.type]
  return (
    <>
      <Metadata />
      <Nav navs={props.navs} />
      <Component
        pages={props.pages}
        list={props.list}
        title={props.title}
        content={props.content as MDXRemoteSerializeResult}
      />
    </>
  )
}

