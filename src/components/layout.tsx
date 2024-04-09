import Link from "next/link";
import siteConfig from "../../site.config";
import ThemeTogger from "./theme/togger";

export default function Layout({
  navs,
  children,
}: {
  navs: { title: string, path: string }[];
  children: React.ReactNode
}) {
  return (
    <main className="max-w-2xl mb-40 flex flex-col mx-4 mt-8 lg:mx-auto">
      <header className="flex items-center justify-between">
        <div className="left flex flex-row items-center gap-5">
          <h1 className="title font-bold text-lg">{siteConfig.siteInfo.title}</h1>
          <Nav navs={navs} />
        </div>
        <div className="right">
          <ThemeTogger />
        </div>
      </header>
      <article className="flex flex-1">
        {children}
      </article>
      <footer className="flex w-full justify-between">
        <span>&copy; {siteConfig.siteInfo.author} {new Date().getFullYear()} 🚀</span>
        <span>
          <Link href="/rss.xml" className="hover:font-medium">Feed</Link>
        </span>
      </footer>
    </main>
  )
}

function Nav({ navs }: { navs: { title: string, path: string }[] }) {
  return (
    <nav className="flex gap-2 text-sm">
      {navs.map(e => <Link key={e.path} href={e.path} className="hover:font-medium">{e.title}</Link>)}
    </nav>
  )
}