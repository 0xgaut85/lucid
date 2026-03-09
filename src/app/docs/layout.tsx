'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

const NAV = [
  { label: 'Introduction', href: '/docs' },
  { label: 'Vision', href: '/docs/vision' },
  { label: 'How It Works', href: '/docs/how-it-works' },
  { label: 'Getting Started', href: '/docs/getting-started' },
  {
    label: 'Reference',
    children: [
      { label: 'Tools', href: '/docs/tools' },
      { label: 'Skills', href: '/docs/skills' },
      { label: 'API', href: '/docs/api-reference' },
    ],
  },
  { label: 'Pricing', href: '/docs/pricing' },
]

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const isActive = (href: string) =>
    pathname === href || (href !== '/docs' && pathname.startsWith(href + '/'))

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-white/8 sticky top-0 h-screen overflow-y-auto hidden md:block">
        <div className="px-6 py-6 border-b border-white/8">
          <Link href="/" className="flex items-center gap-3 group">
            <Image src="/logo.png" alt="Lucid" width={22} height={22} className="opacity-70 group-hover:opacity-100 transition-opacity" />
            <span className="text-white/70 text-sm font-light tracking-[0.2em] lowercase group-hover:text-white/90 transition-colors">
              lucid
            </span>
          </Link>
          <p className="text-white/30 text-[10px] mt-2 tracking-wider uppercase">documentation</p>
        </div>

        <nav className="px-4 py-4 space-y-1">
          {NAV.map((item) => {
            if ('children' in item && item.children) {
              return (
                <div key={item.label} className="pt-4 pb-1">
                  <p className="text-white/30 text-[10px] tracking-[0.15em] uppercase px-3 mb-2">
                    {item.label}
                  </p>
                  <div className="space-y-0.5">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`block px-3 py-1.5 text-xs rounded transition-all ${
                          isActive(child.href)
                            ? 'text-white bg-white/8'
                            : 'text-white/45 hover:text-white/70 hover:bg-white/4'
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )
            }
            const navItem = item as { label: string; href: string }
            return (
              <Link
                key={navItem.href}
                href={navItem.href}
                className={`block px-3 py-1.5 text-xs rounded transition-all ${
                  isActive(navItem.href) && !(navItem.href === '/docs' && pathname !== '/docs')
                    ? 'text-white bg-white/8'
                    : 'text-white/45 hover:text-white/70 hover:bg-white/4'
                }`}
              >
                {navItem.label}
              </Link>
            )
          })}
        </nav>

        <div className="px-6 py-4 mt-4 border-t border-white/8">
          <div className="space-y-2">
            <Link href="/app" className="block text-white/30 hover:text-white/60 text-[10px] tracking-wider transition-colors">
              Dev Portal
            </Link>
            <a href="https://github.com/get-Lucid/Lucid" target="_blank" rel="noopener noreferrer" className="block text-white/30 hover:text-white/60 text-[10px] tracking-wider transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur border-b border-white/8 px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Lucid" width={18} height={18} className="opacity-70" />
          <span className="text-white/70 text-xs tracking-[0.2em] lowercase">docs</span>
        </Link>
        <Link href="/docs" className="text-white/40 text-xs">all pages</Link>
      </div>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        <div className="max-w-3xl mx-auto px-6 md:px-12 py-12 md:py-16 md:pt-16 pt-20">
          {children}
        </div>
      </main>
    </div>
  )
}
