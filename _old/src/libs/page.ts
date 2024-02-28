import siteConfig from "@/site.config"
import { getPropertyKey, getPropertyTitle, getPropertyValue, notionClient } from "./notion"
import { Database, PageItem, PageListItem } from "@/types/page"
import { NotionToMarkdown } from "notion-to-md"

export const getAllPages = async function (): Promise<PageListItem[]> {
  const client = notionClient(),
    { rootPageId } = siteConfig

  const { results } = await client.blocks.children.list({
    block_id: rootPageId
  })

  if (!results.length) {
    return []
  }
  const res: PageListItem[] = []
  for (const result of results) {
    // @ts-ignore
    if (result.type === 'child_page') {
      // @ts-ignore
      const title = result.child_page.title;
      res.push({
        id: result.id.replace(/[-]/g, ''),
        slug: [title.toLowerCase().replace(/\s+/g, '-')],
        type: 'page',
        title: title,
        showInNav: true,
      })
      // @ts-ignore
    } else if (result.type === 'child_database') {
      // @ts-ignore
      const prefix = result.child_database.title.toLowerCase();
      const databasePages = await client.databases.query({
        database_id: result.id,
        page_size: 100,
      })
      for (const dbRes of databasePages.results) {
        // @ts-ignore
        const title = Object.values(dbRes.properties).filter(e => e.type === 'title')[0].title[0]?.text.content
        // @ts-ignore
        const slug = dbRes.properties['Slug']?.rich_text[0]?.plain_text
        res.push({
          id: dbRes.id.replace(/[-]/g, ''),
          slug: [prefix, slug ? slug : title.toLowerCase().replace(/\s+/g, '-')],
          type: 'article',
          title,
          showInNav: false,
          // @ts-ignore
          listTitle: result.child_database.title,
        })
      }
      res.push({
        id: result.id.replace(/[-]/g, ''),
        slug: [prefix.replace(/\s+/g, '-')],
        type: 'list',
        // @ts-ignore
        title: result.child_database.title,
        showInNav: true,
      })
    }
  }
  res[0].slug = ["/"]
  return res
}


export const getPageById = async function (pageId: string): Promise<PageItem> {
  const client = notionClient(),
    n2m = new NotionToMarkdown({ notionClient: client });
  const [metadata, content] = await Promise.all([client.pages.retrieve({ page_id: pageId }), n2m.pageToMarkdown(pageId)])
  const mdString = n2m.toMarkdownString(content);
  const properties: PageItem = {}
  // @ts-ignore
  Object.keys(metadata.properties).forEach(e => {
    // @ts-ignore
    if (metadata.properties[e].type === 'title') {
      // @ts-ignore
      properties['title'] = getPropertyValue(metadata.properties[e])
    } else {
      const key = getPropertyKey(e)
      // @ts-ignore
      properties[key] = getPropertyValue(metadata.properties[e])
    }
  })
  console.log(properties)
  return {
    content: mdString.parent,
    // @ts-ignore
    title: getPropertyTitle(Object.values(metadata.properties)),
    // @ts-ignore
    systemCreatedTime: metadata.created_time
  }
}

export const getDatabaseById = async function (databaseId: string): Promise<Database> {
  const client = notionClient()
  const [metaData, { results }] = await Promise.all([
    client.databases.retrieve({ database_id: databaseId }),
    client.databases.query({
      database_id: databaseId,
      page_size: 100,
    })
  ])

  const pages = await getAllPages()
  const res: PageItem[] = []
  for (let i = 0; i < results.length; i++) {
    const item = results[i]
    const cur: PageItem = {}
    // @ts-ignore
    Object.keys(item.properties).forEach(e => {
      // @ts-ignore
      if (item.properties[e].type === 'title') {
        // @ts-ignore
        cur['title'] = getPropertyValue(item.properties[e])
      } else {
        const key = getPropertyKey(e)
        // @ts-ignore
        cur[key] = getPropertyValue(item.properties[e])
      }
    })
    cur.slug = pages.filter(page => page.title === cur.title)[0].slug;
    // @ts-ignore
    cur.systemCreatedTime = item.created_time;
    res.push(cur)
  }
  return {
    // @ts-ignore
    title: metaData.title[0].plain_text,
    list: res,
  }
}
