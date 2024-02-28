interface SiteInformation {
  title: string;
  url: string;
  keywords?: string[];
  description?: string;
  author?: string;
}

interface Link {
  title: string;
  href: string;
}

export interface SiteConfig {
  notionPageId: string;
  siteInfo: SiteInformation;
  defaultTheme?: "light" | "dark";
  homePage?: Link;
  navLinks?: Link[];
  footerLinks?: Link[];
  pageOverrides?: {
    [x: string]: string;
  };
}

export interface TinyPage extends Link {

}

export interface FullPage extends Link {

}

export interface Article extends FullPage {

}

export interface PageInfo {
  title: string;
  id: string;
  slug: string[];
  type: 'page' | 'list' | 'article';
}