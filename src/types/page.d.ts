export interface PageListItem {
  slug: string[];
  type: 'page' | 'list' | 'article';
  title: string;
  id: string;
  showInNav: boolean;
  listTitle?: string;
}
export interface PageItem {
  [x: string]: string | number | Date | string[];
  title?: string;
  content?: string;
}

export interface Database {
  title: string;
  list: PageItem[]
}