import { Client } from "@notionhq/client";
import { PropertyItemObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import siteConfig from "../../site.config";
import { toCamelCase } from "./utils";

let client: Client

export const getNotionClient = function () {
  if (!client) {
    const { NOTION_TOKEN } = process.env;
    client = new Client({ auth: NOTION_TOKEN })
  }
  return client
}

export const getPureUuid = function (id: string) {
  return id.replace(/[-]/g, '');
}

export const getPagePath = function (path: string) {
  return path.toLowerCase().replace(/\s+/g, '-')
}

export const getFullPagePath = function (id: string, title: string) {
  const { homePage, pageOverrides } = siteConfig;
  const defaultPath = getPagePath(title);

  const overidePath = pageOverrides ? (pageOverrides[id] || defaultPath) : defaultPath,
    path = homePage ? (homePage === title ? "/" : overidePath) : overidePath;
  return path
}

export const getPropertyTitle = function (properties: PropertyItemObjectResponse[]) {
  const property = properties.filter(property => property.type === 'title')[0]
  // @ts-ignore
  return property.title[0]?.plain_text || null
}

export const getPropertyValue = function (property: PropertyItemObjectResponse) {
  if (property.type === 'checkbox') {
    return property.checkbox
  }
  if (property.type === 'title') {
    // @ts-ignore
    return property.title[0].plain_text
  }
  if (property.type === 'created_time') {
    return property.created_time
  }
  if (property.type === 'date') {
    return property.date?.start
  }
  if (property.type === 'select') {
    return property.select?.name
  }
  if (property.type === 'multi_select') {
    return property.multi_select.map(e => e.name)
  }
  if (property.type === 'rich_text') {
    // @ts-ignore
    return property.rich_text[0]?.plain_text
  }
}

export const getPropertyKey = function (key: string) {
  return toCamelCase(key)
}

