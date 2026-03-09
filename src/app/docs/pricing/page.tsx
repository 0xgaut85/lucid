export default function PricingPage() {
  return (
    <article className="prose-docs">
      <h1>Pricing</h1>
      <p className="lead">
        One plan. No tiers. No per-seat pricing. No usage caps that matter.
      </p>

      <div className="pricing-card">
        <div className="pricing-amount">20 USDC<span>/month</span></div>
        <p className="pricing-sub">Payable on Solana or Base</p>
        <ul>
          <li>All four tools (docs, packages, facts, API references)</li>
          <li>All five skills (auto-triggered grounding)</li>
          <li>100 requests/minute</li>
          <li>10,000 requests/day</li>
          <li>Full API access</li>
          <li>Unlimited API keys</li>
        </ul>
        <a href="/app" className="pricing-cta">Subscribe at getlucid.tech/app</a>
      </div>

      <h2>Why USDC?</h2>
      <p>
        We accept USDC on Solana and Base because it is the simplest payment method for a global developer audience. No currency conversion, no payment processor friction, no regional restrictions. One currency, two fast and low-fee chains, instant settlement.
      </p>

      <h2>How Payment Works</h2>
      <ol>
        <li>Sign in at <a href="/app">getlucid.tech/app</a></li>
        <li>Click subscribe and select your chain (Solana or Base)</li>
        <li>Approve the 20 USDC transfer in your wallet</li>
        <li>Your subscription activates the moment the transaction confirms on-chain</li>
      </ol>
      <p>
        Subscriptions last 30 days from the payment date. You can check your subscription status and expiration in the dev portal.
      </p>

      <h2>What Happens When It Expires</h2>
      <p>
        When your subscription expires, API keys stop working. Your keys and account data are preserved. Renew at any time and everything resumes instantly.
      </p>
      <p>
        There is no automatic renewal. You pay when you want to pay.
      </p>

      <h2>Refunds</h2>
      <p>
        All payments are on-chain and non-refundable. Since there is no free trial, we encourage you to review the documentation and tools before subscribing to make sure Lucid is right for your workflow.
      </p>
    </article>
  )
}
