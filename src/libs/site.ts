import { PageInfo, SiteConfig } from "@/type";

export function defineConfig(config: SiteConfig) {
  return config;
}

export function getNavs(pages: PageInfo[]) {
  return pages
    .filter(e => (e.type === 'list' || e.type === 'page'))
    .map((e, i) => ({ title: e.title, path: i === 0 ? '/' : e.slug.join('') }))
}