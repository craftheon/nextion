import { getAllPages, getDatabaseById, getPageById } from "@/libs/page";
import Component from "@/components/page";
import Metadata from "@/components/metadata";


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
    console.log(articles)
    return {
      props: {
        title,
      }
    }
  }
  const { title, content } = await getPageById(currentPage.id);
  return {
    props: {
      title,
      content
    }
  }
}

export default function Page() {
  return (
    <>
      <Metadata />
      <Component />
    </>
  )
}