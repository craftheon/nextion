import { MDXRemoteSerializeResult } from "next-mdx-remote";
import List from "./list";
import SinglePage from "./page";
import SingleArticle from "./article";
import type { Article } from "@/type";

export interface Props {
  type: 'list' | 'article' | 'page';
  lists?: Article[];
  content?: MDXRemoteSerializeResult;
  metadata?: any;
}

export default function Page(props: Props) {
  const components = {
    list: <List list={props.lists || []} />,
    page: <SinglePage content={props.content as MDXRemoteSerializeResult} />,
    article: <SingleArticle metadata={props.metadata} content={props.content as MDXRemoteSerializeResult} />
  }
  return components[props.type]
}