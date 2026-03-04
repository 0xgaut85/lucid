import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Use — Lucid',
  description: 'Terms of Use for Lucid platform and services.',
}

export default function TermsOfUse() {
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
          Terms of Use
        </h1>
        <p className="text-white/30 text-sm mb-16">Last updated: March 2, 2026</p>

        <div className="space-y-10 text-sm leading-relaxed text-white/60">
          <section>
            <h2 className="text-white/90 text-lg font-light tracking-wider uppercase mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Lucid platform, website, applications, smart contracts, or any associated services
              (collectively, the &ldquo;Services&rdquo;), you agree to be bound by these Terms of Use (&ldquo;Terms&rdquo;). If you do not agree
              to all of these Terms, you must not access or use the Services. Your continued use of the Services constitutes
              your acceptance of any modifications to these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-white/90 text-lg font-light tracking-wider uppercase mb-4">2. Eligibility</h2>
            <p>
              You must be at least 18 years of age or the age of majority in your jurisdiction to use the Services.
              By using the Services, you represent and warrant that you meet this requirement. The Services are not
              available to persons or entities that are subject to sanctions or are located in jurisdictions where the
              use of such Services is prohibited by applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-white/90 text-lg font-light tracking-wider uppercase mb-4">3. Description of Services</h2>
            <p>
              Lucid provides a decentralized platform that may include, without limitation, access to AI agents,
              blockchain-based tools, smart contracts, decentralized applications (dApps), and related documentation.
              The Services interact with public blockchain networks that are not owned or controlled by Lucid.
              You acknowledge that Lucid does not control the underlying blockchain protocols and is not responsible
              for their operation, security, or availability.
            </p>
          </section>

          <section>
            <h2 className="text-white/90 text-lg font-light tracking-wider uppercase mb-4">4. Digital Wallet &amp; Blockchain Interactions</h2>
            <p>
              Certain features of the Services require you to connect a compatible third-party digital wallet.
              You are solely responsible for the security of your wallet, private keys, seed phrases, and any
              credentials associated with your wallet. Lucid does not have custody of, access to, or control
              over your digital assets. All blockchain transactions are irreversible once confirmed on-chain,
              and Lucid cannot reverse, cancel, or refund any transaction.
            </p>
          </section>

          <section>
            <h2 className="text-white/90 text-lg font-light tracking-wider uppercase mb-4">5. Smart Contract Risks</h2>
            <p>
              The Services may rely on smart contracts deployed on public blockchains. While Lucid endeavors to
              audit and test its smart contracts, you acknowledge that smart contracts may contain bugs, vulnerabilities,
              or errors. You interact with smart contracts at your own risk. Lucid shall not be liable for any losses
              arising from smart contract failures, exploits, or unintended behavior, including but not limited to
              loss of digital assets, tokens, or data.
            </p>
          </section>

          <section>
            <h2 className="text-white/90 text-lg font-light tracking-wider uppercase mb-4">6. User Conduct</h2>
            <p>You agree not to:</p>
            <ul className="list-disc list-inside space-y-2 mt-3 ml-2">
              <li>Use the Services for any unlawful purpose or in violation of any applicable law or regulation</li>
              <li>Attempt to exploit, hack, or interfere with the Services, smart contracts, or underlying protocols</li>
              <li>Engage in market manipulation, wash trading, fraud, or any deceptive practice</li>
              <li>Use the Services to launder money, finance terrorism, or circumvent sanctions</li>
              <li>Distribute malware, viruses, or any harmful code through the Services</li>
              <li>Infringe upon the intellectual property rights of Lucid or any third party</li>
              <li>Use automated bots, scrapers, or similar tools to access the Services without prior written consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white/90 text-lg font-light tracking-wider uppercase mb-4">7. Intellectual Property</h2>
            <p>
              All content, code, designs, trademarks, logos, and materials available through the Services are the
              property of Lucid or its licensors and are protected by applicable intellectual property laws.
              You are granted a limited, non-exclusive, non-transferable, revocable license to access and use the
              Services for personal, non-commercial purposes. Open-source components are governed by their respective licenses.
            </p>
          </section>

          <section>
            <h2 className="text-white/90 text-lg font-light tracking-wider uppercase mb-4">8. Token &amp; Digital Asset Disclaimer</h2>
            <p>
              Nothing in the Services constitutes financial advice, investment advice, trading advice, or any other
              form of advice. Lucid does not recommend or endorse the purchase, sale, or holding of any digital asset
              or token. Digital assets are highly volatile and speculative. You acknowledge that you may lose some or
              all of the value of any digital assets you interact with through the Services. Any tokens associated
              with Lucid are utility tokens and are not intended to be securities in any jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-white/90 text-lg font-light tracking-wider uppercase mb-4">9. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, LUCID AND ITS AFFILIATES, OFFICERS, DIRECTORS,
              EMPLOYEES, AGENTS, AND LICENSORS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
              CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, LOSS OF DATA,
              LOSS OF DIGITAL ASSETS, BUSINESS INTERRUPTION, OR ANY OTHER DAMAGES ARISING FROM YOUR USE OF OR
              INABILITY TO USE THE SERVICES, WHETHER BASED ON WARRANTY, CONTRACT, TORT, OR ANY OTHER LEGAL THEORY,
              EVEN IF LUCID HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
            </p>
            <p className="mt-3">
              IN NO EVENT SHALL LUCID&apos;S TOTAL AGGREGATE LIABILITY EXCEED THE GREATER OF (A) THE AMOUNT YOU HAVE
              PAID TO LUCID IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, OR (B) ONE HUNDRED US DOLLARS ($100).
            </p>
          </section>

          <section>
            <h2 className="text-white/90 text-lg font-light tracking-wider uppercase mb-4">10. Disclaimer of Warranties</h2>
            <p>
              THE SERVICES ARE PROVIDED ON AN &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; BASIS WITHOUT WARRANTIES OF ANY KIND,
              WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY,
              FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. LUCID DOES NOT WARRANT THAT THE
              SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, SECURE, OR FREE FROM VIRUSES OR OTHER HARMFUL COMPONENTS.
            </p>
          </section>

          <section>
            <h2 className="text-white/90 text-lg font-light tracking-wider uppercase mb-4">11. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless Lucid, its affiliates, officers, directors, employees,
              agents, and licensors from and against any claims, liabilities, damages, losses, costs, and expenses
              (including reasonable attorneys&apos; fees) arising out of or related to your use of the Services, your
              violation of these Terms, your violation of any applicable law, or your infringement of any rights of
              a third party.
            </p>
          </section>

          <section>
            <h2 className="text-white/90 text-lg font-light tracking-wider uppercase mb-4">12. Dispute Resolution &amp; Arbitration</h2>
            <p>
              Any dispute, controversy, or claim arising out of or relating to these Terms or the Services shall be
              settled by binding arbitration in accordance with the rules of the applicable arbitration body in the
              jurisdiction of incorporation. You agree to waive any right to a jury trial or to participate in a
              class action lawsuit or class-wide arbitration. Each party shall bear its own costs of arbitration
              unless otherwise determined by the arbitrator.
            </p>
          </section>

          <section>
            <h2 className="text-white/90 text-lg font-light tracking-wider uppercase mb-4">13. Modification of Terms</h2>
            <p>
              Lucid reserves the right to modify these Terms at any time. Changes will be posted on this page with
              an updated &ldquo;Last updated&rdquo; date. Your continued use of the Services after any changes constitutes
              acceptance of the revised Terms. It is your responsibility to review these Terms periodically.
            </p>
          </section>

          <section>
            <h2 className="text-white/90 text-lg font-light tracking-wider uppercase mb-4">14. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the applicable jurisdiction,
              without regard to conflict of law principles. If any provision of these Terms is found to be invalid or
              unenforceable, the remaining provisions shall remain in full force and effect.
            </p>
          </section>

          <section>
            <h2 className="text-white/90 text-lg font-light tracking-wider uppercase mb-4">15. Termination</h2>
            <p>
              Lucid may suspend or terminate your access to the Services at any time, with or without cause,
              with or without notice. Upon termination, all rights granted to you under these Terms will immediately
              cease. Provisions that by their nature should survive termination shall survive, including but not
              limited to limitation of liability, indemnification, and dispute resolution.
            </p>
          </section>

          <section>
            <h2 className="text-white/90 text-lg font-light tracking-wider uppercase mb-4">16. Contact</h2>
            <p>
              For questions regarding these Terms, please contact us through our official channels listed on the Lucid website.
            </p>
          </section>
        </div>

        <div className="mt-20 pt-8 border-t border-white/10 flex items-center justify-between">
          <Link href="/legal" className="text-white/30 hover:text-white/60 transition-colors text-xs tracking-wider">
            Legal &amp; Privacy →
          </Link>
          <span className="text-white/20 text-xs tracking-wider">© 2026 Lucid</span>
        </div>
      </div>
    </main>
  )
}
