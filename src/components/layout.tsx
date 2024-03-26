import Link from "next/link";
import siteConfig from "../../site.config";

export default function Layout({
  navs,
  children,
}: {
  navs: { title: string, path: string }[];
  children: React.ReactNode
}) {
  return (
    <main>
      <header>
        <h1 className="title">{siteConfig.siteInfo.title}</h1>
        <nav>
          {navs.map(e => <Link key={e.path} href={e.path}>{e.title}</Link>)}
        </nav>
      </header>
      <article>
        {children}
      </article>
      <footer>
        <span>&copy; {siteConfig.siteInfo.author} {new Date().getFullYear()} 🚀</span>
        <span>{navs.map(e => <Link key={e.path} href={e.path}>{e.title}</Link>)}</span>
      </footer>
    </main>
  )
}