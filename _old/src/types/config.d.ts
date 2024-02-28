export interface SiteConfig {
  rootPageId: string;
  url: string;
  title: string;
  author?: string;
  keywords?: string;
  description?: string;
  navs?: {
    name: string;
    href: string;
  }[];
  pages?: {
    title: string;
    slug: string;
    id: string;
  }[];
}