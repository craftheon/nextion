import Head from 'next/head'
import type { Metadata } from 'next'
import siteConfig from '../../site.config'

export interface Props extends Metadata { }

export default function Metadata(props: Props) {
  const siteTitle = props.title ? `${props.title} | ${siteConfig.siteInfo.title}` : siteConfig.siteInfo.title;
  return (
    <Head>
      <title>{siteTitle}</title>
      <meta name="description" content="" />
      <meta name="keywords" content="" />
    </Head>
  )
}