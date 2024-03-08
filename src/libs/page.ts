import { ChildDatabaseBlockObjectResponse, ChildPageBlockObjectResponse, PageObjectResponse, PropertyItemObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { ArticleSummary, FullPage, PageInfo } from "@/type";
import { getPureUuid, getNotionClient, getPagePath, getPropertyTitle, getPropertyValue, getFullPagePath, getPropertyKey } from "./notion";
import siteConfig from "../../site.config";
import { toCamelCase } from "./utils";
import { NotionToMarkdown } from "notion-to-md";

export const getAllPages = async function (): Promise<PageInfo[]> {
  const notion = getNotionClient(),
    { notionPageId } = siteConfig;

  const { results } = await notion.blocks.children.list({
    block_id: notionPageId
  })

  if (!results.length) {
    return []
  }

  const list: PageInfo[] = []

  const handler = {
    async childPage(result: ChildPageBlockObjectResponse) {
      const title = result.child_page.title,
        id = getPureUuid(result.id);

      list.push({
        id,
        slug: [getFullPagePath(id, title)],
        title,
        type: "page"
      })
    },
    async childDatabase(result: ChildDatabaseBlockObjectResponse) {
      const title = result.child_database.title;
      const pathSuffix = getPagePath(title);
      const { results } = await notion.databases.query({
        database_id: result.id,
        page_size: 100, // TODO next page
      })
      const id = getPureUuid(result.id);

      list.push({
        id,
        slug: [getFullPagePath(id, title)],
        title,
        type: 'list',
      })
      for (let res of results) {
        // @ts-ignore
        const title = getPropertyTitle(Object.values((res.properties))),
          id = getPureUuid(res.id),
          // @ts-ignore
          customerSlug = getPropertyValue(res.properties['Slug']),
          defaultPath = getPagePath(title),
          path = customerSlug || defaultPath;
        list.push({
          id,
          slug: [pathSuffix, path],
          title,
          type: 'article'
        })
      }
    },
  }

  for (let res of results) {
    // @ts-ignore
    handler[toCamelCase(res.type)] ? await handler[toCamelCase(res.type)](res) : null
  }

  return list;
}


export const getPageById = async function (pageId: string): Promise<FullPage> {
  const notion = getNotionClient(),
    n2m = new NotionToMarkdown({ notionClient: notion });
  const [metadata, content] = await Promise.all([notion.pages.retrieve({ page_id: pageId }), n2m.pageToMarkdown(pageId)])
  const page: FullPage = {},
    properties = (metadata as PageObjectResponse).properties
  for (let propKey of Object.keys(properties)) {
    if (properties[propKey].type === 'title') {
      // @ts-ignore
      page.title = getPropertyValue(properties[propKey])
    } else {
      const key = getPropertyKey(propKey)
      // @ts-ignore
      page[key] = getPropertyValue(properties[propKey])
    }
  }
  const mdString = n2m.toMarkdownString(content);
  page.content = mdString.parent;
  return page
}

export const getDatabaseById = async function (databaseId: string): Promise<{ title: string, articles: ArticleSummary[] }> {
  const notion = getNotionClient()
  const [metadata, list, pageList] = await Promise.all([
    notion.databases.retrieve({ database_id: databaseId }),
    notion.databases.query({
      database_id: databaseId,
      page_size: 100,
    }),
    getAllPages()
  ])
  const articles: ArticleSummary[] = []
  for (let i = 0; i < list.results.length; i++) {
    const item = list.results[i] as PageObjectResponse,
      current: ArticleSummary = {}
    for (let propKey of Object.keys(item.properties)) {
      if (item.properties[propKey].type === 'title') {
        // @ts-ignore
        current.title = getPropertyValue(item.properties[propKey])
      } else {
        const key = getPropertyKey(propKey)
        // @ts-ignore
        current[key] = getPropertyValue(item.properties[propKey])
      }
    }
    current.href = pageList.filter(page => page.title === current.title)[0].slug.join('/');
    articles.push(current)
  }
  // @ts-ignore
  const title = getPropertyTitle(Object.values(metadata.properties) as PropertyItemObjectResponse[])
  return {
    title,
    articles
  };
}
