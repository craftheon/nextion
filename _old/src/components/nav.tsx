import Link from "next/link";

export interface Props {
  navs: {
    link: string;
    title: string;
  }[]
}

export default function Nav({ navs }: Props) {
  return (
    <nav className="flex flex-row space-x-0 pr-10 mb-8">
      {navs.map(nav =>
        <Link
          className="transition-all hover:text-neutral-800 dark:hover:text-neutral-200 flex align-middle relative py-1 px-4 first:pl-0"
          key={nav.link}
          href={nav.link}
        >
          {nav.title}
        </Link>
      )}
    </nav>
  )
}