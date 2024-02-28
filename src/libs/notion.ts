import { Client } from "@notionhq/client";

let client: Client

export const notionClient = function () {
  if (!client) {
    const { NOTION_TOKEN } = process.env;
    client = new Client({ auth: NOTION_TOKEN })
  }
  return client
}