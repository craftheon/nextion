import Head from 'next/head'
import type { Metadata } from 'next'
import siteConfig from '../../site.config'
import { useRouter } from 'next/router';


export default function Metadata(props: Metadata) {
  const router = useRouter()
  const siteTitle = props.title ? `${props.title} | ${siteConfig.siteInfo.title}` : siteConfig.siteInfo.title;
  const description = props.description || siteConfig.siteInfo.description;
  const keywords = props.keywords || siteConfig.siteInfo.keywords || [];
  const url = siteConfig.siteInfo.url
  const image = `${url}/og/${siteTitle}.png`;
  return (
    <Head>
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={Array.isArray(keywords) ? keywords.join(',') : keywords} />
      <meta name="title" content={siteTitle} />
      <link rel="shortlink" href={url} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={siteTitle} key="og-title" />
      <meta property="og:description" content={description} key="og-desc" />
      <meta property="og:url" content={`${url}${router.asPath}`} key="og-url" />
      <meta property="og:image" content={image} key="og-image" />
      <meta property="og:site_name" content={siteTitle} key="og-site" />
      <meta name="twitter:title" content={siteTitle} key="tw-title" />
      <meta name="twitter:description" content={description} key="tw-desc" />
      <meta name="twitter:image" content={image} key="tw-image" />
      <meta name="twitter:card" content="summary_large_image" key="tw-card" />
    </Head>
  )
}