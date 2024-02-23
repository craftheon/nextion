import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize as MdxSerialize } from 'next-mdx-remote/serialize';
import React, { JSX, ClassAttributes, HTMLAttributes } from "react";
import NextLink from 'next/link';
import { PageListItem } from "@/types/page";

export interface Props extends MDXRemoteSerializeResult {
  pages: PageListItem[]
}

export async function serialize(content: string) {
  const mdxSource = await MdxSerialize(content)
  return mdxSource;
}

export default function MDX(props: Props) {
  const Link = function (pp: any) {
    if (pp.href.startsWith("https://www.notion.so")) {
      const [_, id] = pp.href.split('https://www.notion.so/')
      const slug = props.pages.filter((pg: any) => pg.id == id)[0].slug
      return <NextLink className="font-medium text-primary underline underline-offset-4" {...pp} href={`/${slug.join('/')}`} />
    }
    if (pp.href.startsWith('#')) {
      return <a {...pp} />;
    }
    return <a className="font-medium text-primary underline underline-offset-4" target="_blank" {...pp} />
  }
  const headingClasses = [
    'scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-3xl',
    'scroll-m-20 [&:not(:first-child)]:mt-8 border-b pb-2 text-2xl font-semibold tracking-tight',
    'scroll-m-20 [&:not(:first-child)]:mt-8 text-xl font-semibold tracking-tight',
    'scroll-m-20 [&:not(:first-child)]:mt-8 text-ml font-semibold tracking-tight'
  ];
  function slugify(str: string) {
    return str
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/&/g, '-and-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
  }
  function createHeading(level: any) {
    return function H({ children }: any) {
      let slug = slugify(children.props ? children.props.children : children);
      return React.createElement(
        `h${level}`,
        {
          id: slug,
          className: headingClasses[level - 1]
        },
        [
          React.createElement('a', {
            href: `#${slug}`,
            key: `link-${slug}`,
            className: 'anchor',
          }),
        ],
        children
      );
    };
  }
  const components = {
    h1: createHeading(1),
    h2: createHeading(2),
    h3: createHeading(3),
    h4: createHeading(4),
    h5: createHeading(5),
    h6: createHeading(6),
    p: (props: any) => <p className="[&:not(:first-child)]:mt-6" {...props} />,
    ul: (props: any) => <ul className="ml-6 list-disc [&>li]:mt-2" {...props} />,
    ol: (props: any) => <ul className="ml-6 list-disc [&>li]:mt-2" {...props} />,
    a: (props: any) => <Link {...props} />,
  }
  return (
    <MDXRemote {...props} components={components} />
  )
}