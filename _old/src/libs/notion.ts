import { Client } from "@notionhq/client";
import { PropertyItemObjectResponse } from "@notionhq/client/build/src/api-endpoints";

let client: Client

export const notionClient = function () {
  if (!client) {
    const { NOTION_TOKEN } = process.env;
    client = new Client({ auth: NOTION_TOKEN })
  }
  return client
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
    return property.rich_text[0].plain_text
  }
}

export const getPropertyKey = function (key: string) {
  return key.replace(/\s+/g, '_').toLowerCase()
}

export const getPropertyTitle = function (properties: PropertyItemObjectResponse[]) {
  const property = properties.filter(property => property.type === 'title')[0]
  // @ts-expect-error
  return property.title[0].plain_text
}