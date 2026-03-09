import Link from 'next/link'

export default function DocsIndex() {
  return (
    <article>
      <h1 className="text-2xl font-light text-white tracking-wide mb-2">Lucid Documentation</h1>
      <p className="text-white/40 text-sm mb-10 leading-relaxed">
        Everything you need to ground your AI agents in real-time, verified knowledge.
      </p>

      <div className="space-y-8">
        <section>
          <h2 className="text-white/70 text-xs tracking-[0.2em] uppercase mb-4">Get Started</h2>
          <div className="grid gap-3">
            <DocCard href="/docs/vision" title="Vision" desc="Why AI agents need a knowledge layer and what Lucid is building." />
            <DocCard href="/docs/how-it-works" title="How It Works" desc="Architecture, MCP protocol and the real-time knowledge pipeline." />
            <DocCard href="/docs/getting-started" title="Getting Started" desc="Install Lucid, set up your API key and start grounding agents in minutes." />
          </div>
        </section>

        <section>
          <h2 className="text-white/70 text-xs tracking-[0.2em] uppercase mb-4">Reference</h2>
          <div className="grid gap-3">
            <DocCard href="/docs/tools" title="Tools" desc="Four MCP tools for documentation, packages, fact-checking and API references." />
            <DocCard href="/docs/skills" title="Skills" desc="Auto-triggered behaviors that ground every agent response without manual calls." />
            <DocCard href="/docs/api-reference" title="API Reference" desc="HTTP endpoints, authentication, request format and response schema." />
          </div>
        </section>

        <section>
          <h2 className="text-white/70 text-xs tracking-[0.2em] uppercase mb-4">Other</h2>
          <div className="grid gap-3">
            <DocCard href="/docs/pricing" title="Pricing" desc="Simple, transparent pricing. 20 USDC/month on Solana or Base." />
          </div>
        </section>
      </div>
    </article>
  )
}

function DocCard({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <Link
      href={href}
      className="block border border-white/8 hover:border-white/20 transition-all p-5 group"
    >
      <h3 className="text-white/80 text-sm font-light mb-1 group-hover:text-white transition-colors">{title}</h3>
      <p className="text-white/35 text-xs leading-relaxed">{desc}</p>
    </Link>
  )
}
