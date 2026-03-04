import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Legal & Privacy — Lucid',
  description: 'Legal notices, privacy policy, and regulatory disclosures for Lucid.',
}

export default function Legal() {
  return (
    <main className="min-h-screen bg-black text-white/80 font-sans">
      <div className="max-w-3xl mx-auto px-6 py-16 sm:py-24">
        <Link
          href="/"
          className="inline-block mb-12 text-white/40 hover:text-white/70 transition-colors text-sm tracking-wider"
        >
          ← Back
        </Link>

        <h1 className="text-4xl font-light tracking-[0.3em] uppercase text-white mb-2">
          Legal &amp; Privacy
        </h1>
        <p className="text-white/30 text-sm mb-16">Last updated: March 2, 2026</p>

        <div className="space-y-10 text-sm leading-relaxed text-white/60">

          {/* PRIVACY POLICY */}
          <section>
            <h2 className="text-white text-2xl font-light tracking-[0.2em] uppercase mb-8">Privacy Policy</h2>
          </section>

          <section>
            <h2 className="text-white/90 text-lg font-light tracking-wider uppercase mb-4">1. Introduction</h2>
            <p>
              Lucid (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is committed to protecting your privacy. This Privacy Policy describes
              how we collect, use, disclose, and safeguard information when you use our platform, website, applications,
              and services (collectively, the &ldquo;Services&rdquo;). By using the Services, you consent to the practices described
              in this policy.
            </p>
          </section>

          <section>
            <h2 className="text-white/90 text-lg font-light tracking-wider uppercase mb-4">2. Information We Collect</h2>
            <p className="mb-3">We may collect the following types of information:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                <strong className="text-white/80">Wallet Information:</strong> Public wallet addresses you connect to the Services.
                We do not collect or store private keys or seed phrases.
              </li>
              <li>
                <strong className="text-white/80">On-Chain Data:</strong> Transaction data that is publicly available on the blockchain,
                including transaction hashes, token transfers, and smart contract interactions.
              </li>
              <li>
                <strong className="text-white/80">Usage Data:</strong> Anonymous analytics including pages visited, features used,
                session duration, device type, browser type, and referring URLs.
              </li>
              <li>
                <strong className="text-white/80">Communications:</strong> Information you provide when contacting us through
                support channels, social media, or community platforms.
              </li>
              <li>
                <strong className="text-white/80">Cookies &amp; Tracking:</strong> We may use cookies, local storage, and similar
                technologies to enhance your experience and collect usage analytics.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-white/90 text-lg font-light tracking-wider uppercase mb-4">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>To provide, maintain, and improve the Services</li>
              <li>To communicate with you about updates, security alerts, and support</li>
              <li>To detect, prevent, and address technical issues, fraud, or abuse</li>
              <li>To comply with legal obligations and respond to lawful requests</li>
              <li>To analyze usage patterns and optimize user experience</li>
              <li>To enforce our Terms of Use and other agreements</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white/90 text-lg font-light tracking-wider uppercase mb-4">4. Information Sharing &amp; Disclosure</h2>
            <p>We do not sell your personal information. We may share information in the following circumstances:</p>
            <ul className="list-disc list-inside space-y-2 mt-3 ml-2">
              <li>
                <strong className="text-white/80">Service Providers:</strong> With third-party vendors who assist in operating our
                Services, subject to confidentiality obligations.
              </li>
              <li>
                <strong className="text-white/80">Legal Compliance:</strong> When required by law, regulation, legal process,
                or governmental request.
              </li>
              <li>
                <strong className="text-white/80">Safety &amp; Security:</strong> To protect the rights, property, or safety of
                Lucid, our users, or the public.
              </li>
              <li>
                <strong className="text-white/80">Business Transfers:</strong> In connection with a merger, acquisition, or sale
                of assets, your information may be transferred.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-white/90 text-lg font-light tracking-wider uppercase mb-4">5. Data Security</h2>
            <p>
              We implement reasonable technical and organizational security measures to protect information
              under our control. However, no method of transmission over the Internet or electronic storage
              is 100% secure. We cannot guarantee absolute security. You are responsible for maintaining the
              security of your wallet and any credentials used to access the Services.
            </p>
          </section>

          <section>
            <h2 className="text-white/90 text-lg font-light tracking-wider uppercase mb-4">6. Data Retention</h2>
            <p>
              We retain information only for as long as necessary to fulfill the purposes described in this
              policy, comply with legal obligations, resolve disputes, and enforce our agreements. On-chain
              data is immutable and permanently recorded on the blockchain, which is beyond our control.
            </p>
          </section>

          <section>
            <h2 className="text-white/90 text-lg font-light tracking-wider uppercase mb-4">7. Your Rights</h2>
            <p>Depending on your jurisdiction, you may have the right to:</p>
            <ul className="list-disc list-inside space-y-2 mt-3 ml-2">
              <li>Access, correct, or delete personal information we hold about you</li>
              <li>Object to or restrict certain processing of your information</li>
              <li>Withdraw consent where processing is based on consent</li>
              <li>Request data portability</li>
              <li>Lodge a complaint with a supervisory authority</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, please contact us through our official channels. Note that on-chain
              data cannot be modified or deleted due to the immutable nature of blockchain technology.
            </p>
          </section>

          <section>
            <h2 className="text-white/90 text-lg font-light tracking-wider uppercase mb-4">8. International Transfers</h2>
            <p>
              Your information may be processed in countries other than your country of residence. By using the
              Services, you consent to the transfer of your information to countries that may have different data
              protection laws than your jurisdiction.
            </p>
          </section>

          {/* RISK DISCLOSURES */}
          <section className="pt-8 border-t border-white/10">
            <h2 className="text-white text-2xl font-light tracking-[0.2em] uppercase mb-8">Risk Disclosures</h2>
          </section>

          <section>
            <h2 className="text-white/90 text-lg font-light tracking-wider uppercase mb-4">9. Digital Asset Risks</h2>
            <p>
              Digital assets, including cryptocurrencies, tokens, and NFTs, are highly volatile and speculative.
              Their value can fluctuate dramatically and may decrease to zero. You should not invest more than you
              can afford to lose. Past performance is not indicative of future results. Lucid does not provide
              financial, investment, legal, or tax advice.
            </p>
          </section>

          <section>
            <h2 className="text-white/90 text-lg font-light tracking-wider uppercase mb-4">10. Smart Contract &amp; Protocol Risks</h2>
            <p>
              Interactions with smart contracts and decentralized protocols carry inherent risks, including but
              not limited to: code vulnerabilities, exploits, oracle manipulation, front-running, MEV extraction,
              impermanent loss, liquidation, and governance attacks. Smart contract audits reduce but do not
              eliminate risk. You acknowledge that you interact with all on-chain components at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-white/90 text-lg font-light tracking-wider uppercase mb-4">11. Regulatory Risks</h2>
            <p>
              The regulatory landscape for digital assets, decentralized finance, and blockchain technology is
              evolving and varies by jurisdiction. Changes in laws or regulations may adversely affect the Services,
              digital assets, or your ability to use the platform. You are solely responsible for ensuring compliance
              with the laws of your jurisdiction.
            </p>
          </section>

          {/* LEGAL NOTICES */}
          <section className="pt-8 border-t border-white/10">
            <h2 className="text-white text-2xl font-light tracking-[0.2em] uppercase mb-8">Legal Notices</h2>
          </section>

          <section>
            <h2 className="text-white/90 text-lg font-light tracking-wider uppercase mb-4">12. No Fiduciary Duty</h2>
            <p>
              Lucid owes no fiduciary duties to you. To the fullest extent permitted by law, you agree that Lucid
              and its affiliates have no duty of care or duty of loyalty to you in connection with the Services.
              Nothing in these materials creates an advisory, fiduciary, or professional relationship between you
              and Lucid.
            </p>
          </section>

          <section>
            <h2 className="text-white/90 text-lg font-light tracking-wider uppercase mb-4">13. Third-Party Services</h2>
            <p>
              The Services may contain links to or integrations with third-party websites, protocols, or services.
              Lucid does not control and is not responsible for the content, privacy policies, practices, or
              availability of third-party services. Your use of third-party services is at your own risk and subject
              to their respective terms and policies.
            </p>
          </section>

          <section>
            <h2 className="text-white/90 text-lg font-light tracking-wider uppercase mb-4">14. Force Majeure</h2>
            <p>
              Lucid shall not be liable for any failure or delay in performance resulting from causes beyond its
              reasonable control, including but not limited to acts of God, natural disasters, war, terrorism,
              cyberattacks, blockchain network congestion or failure, changes in law or regulation, internet
              service interruptions, or any other circumstances beyond our reasonable control.
            </p>
          </section>

          <section>
            <h2 className="text-white/90 text-lg font-light tracking-wider uppercase mb-4">15. Entire Agreement</h2>
            <p>
              This Legal &amp; Privacy Policy, together with the <Link href="/terms" className="text-white/80 underline hover:text-white transition-colors">Terms of Use</Link>,
              constitutes the entire agreement between you and Lucid with respect to the Services and supersedes
              all prior or contemporaneous communications, proposals, and agreements, whether oral or written.
            </p>
          </section>

          <section>
            <h2 className="text-white/90 text-lg font-light tracking-wider uppercase mb-4">16. Changes to This Policy</h2>
            <p>
              We may update this Legal &amp; Privacy Policy from time to time. Changes will be posted on this page
              with an updated &ldquo;Last updated&rdquo; date. Your continued use of the Services after any changes constitutes
              acceptance of the revised policy.
            </p>
          </section>

          <section>
            <h2 className="text-white/90 text-lg font-light tracking-wider uppercase mb-4">17. Contact</h2>
            <p>
              For questions or concerns regarding this Legal &amp; Privacy Policy, please contact us through our
              official channels listed on the Lucid website.
            </p>
          </section>
        </div>

        <div className="mt-20 pt-8 border-t border-white/10 flex items-center justify-between">
          <Link href="/terms" className="text-white/30 hover:text-white/60 transition-colors text-xs tracking-wider">
            ← Terms of Use
          </Link>
          <span className="text-white/20 text-xs tracking-wider">© 2026 Lucid</span>
        </div>
      </div>
    </main>
  )
}
