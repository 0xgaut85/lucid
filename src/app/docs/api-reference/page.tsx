export default function ApiReferencePage() {
  return (
    <article className="prose-docs">
      <h1>API Reference</h1>
      <p className="lead">
        The Lucid API is the cloud layer that powers all tool calls. You typically interact with it through the MCP server, but you can also call it directly.
      </p>

      <h2>Base URL</h2>
      <div className="code-block">
        <pre>{`https://getlucid.tech/api/v1`}</pre>
      </div>

      <h2>Authentication</h2>
      <p>
        All requests require a valid API key passed in the <code>Authorization</code> header:
      </p>
      <div className="code-block">
        <pre>{`Authorization: Bearer lk_your_api_key_here`}</pre>
      </div>
      <p>
        Get your API key from the <a href="/app">dev portal</a>. Keys are tied to an active subscription and are revoked when the subscription expires.
      </p>

      <hr />

      <h2>Endpoints</h2>

      <h3>POST /api/v1/search</h3>
      <p>
        The primary endpoint. All four Lucid tools route through this endpoint with different <code>type</code> parameters.
      </p>

      <h4>Query Parameters</h4>
      <div className="param-table">
        <div className="param-row">
          <code>q</code>
          <span className="param-type">string, required</span>
          <span className="param-desc">The search query or claim to verify</span>
        </div>
        <div className="param-row">
          <code>type</code>
          <span className="param-type">string, required</span>
          <span className="param-desc">One of: docs, package, verify, api</span>
        </div>
        <div className="param-row">
          <code>language</code>
          <span className="param-type">string, optional</span>
          <span className="param-desc">Programming language context (for type: docs)</span>
        </div>
        <div className="param-row">
          <code>registry</code>
          <span className="param-type">string, optional</span>
          <span className="param-desc">Package registry (for type: package)</span>
        </div>
        <div className="param-row">
          <code>symbol</code>
          <span className="param-type">string, optional</span>
          <span className="param-desc">Specific function or class (for type: api)</span>
        </div>
        <div className="param-row">
          <code>version</code>
          <span className="param-type">string, optional</span>
          <span className="param-desc">Target version (for type: api)</span>
        </div>
        <div className="param-row">
          <code>context</code>
          <span className="param-type">string, optional</span>
          <span className="param-desc">Additional context (for type: verify)</span>
        </div>
      </div>

      <h4>Example: Documentation Search</h4>
      <div className="code-block">
        <pre>{`curl -X GET "https://getlucid.tech/api/v1/search?q=useEffect+cleanup&type=docs&language=typescript" \\
  -H "Authorization: Bearer lk_your_key_here"`}</pre>
      </div>

      <h4>Example: Package Check</h4>
      <div className="code-block">
        <pre>{`curl -X GET "https://getlucid.tech/api/v1/search?q=next&type=package&registry=npm" \\
  -H "Authorization: Bearer lk_your_key_here"`}</pre>
      </div>

      <h4>Example: Fact Verification</h4>
      <div className="code-block">
        <pre>{`curl -X GET "https://getlucid.tech/api/v1/search?q=Bun+is+faster+than+Node&type=verify" \\
  -H "Authorization: Bearer lk_your_key_here"`}</pre>
      </div>

      <h4>Example: API Reference</h4>
      <div className="code-block">
        <pre>{`curl -X GET "https://getlucid.tech/api/v1/search?q=stripe&type=api&symbol=PaymentIntent.create" \\
  -H "Authorization: Bearer lk_your_key_here"`}</pre>
      </div>

      <hr />

      <h3>POST /api/v1/verify</h3>
      <p>
        Validate an API key. Returns the key status and associated subscription information. Useful for checking if a key is valid before making requests.
      </p>

      <div className="code-block">
        <pre>{`curl -X POST "https://getlucid.tech/api/v1/verify" \\
  -H "Authorization: Bearer lk_your_key_here"`}</pre>
      </div>

      <h4>Response</h4>
      <div className="code-block">
        <pre>{`{
  "valid": true,
  "subscription": "active",
  "expiresAt": "2026-04-09T00:00:00.000Z"
}`}</pre>
      </div>

      <hr />

      <h2>Response Format</h2>
      <p>
        All responses are JSON. Successful responses return a <code>200</code> status code with the data payload. Error responses include an <code>error</code> field with a human-readable message.
      </p>

      <h3>Success</h3>
      <div className="code-block">
        <pre>{`{
  "results": [...],
  "source": "official-docs",
  "verified": true,
  "timestamp": "2026-03-09T12:00:00.000Z"
}`}</pre>
      </div>

      <h3>Error</h3>
      <div className="code-block">
        <pre>{`{
  "error": "Invalid or expired API key",
  "code": "AUTH_INVALID"
}`}</pre>
      </div>

      <h2>Rate Limits</h2>
      <p>
        API keys are rate-limited to prevent abuse. Current limits:
      </p>
      <ul>
        <li><strong>100 requests/minute</strong> per API key</li>
        <li><strong>10,000 requests/day</strong> per API key</li>
      </ul>
      <p>
        Rate limit headers are included in every response:
      </p>
      <div className="code-block">
        <pre>{`X-RateLimit-Limit: 100
X-RateLimit-Remaining: 97
X-RateLimit-Reset: 1741521600`}</pre>
      </div>

      <h2>Error Codes</h2>
      <div className="param-table">
        <div className="param-row">
          <code>AUTH_MISSING</code>
          <span className="param-type">401</span>
          <span className="param-desc">No API key provided</span>
        </div>
        <div className="param-row">
          <code>AUTH_INVALID</code>
          <span className="param-type">401</span>
          <span className="param-desc">API key is invalid or expired</span>
        </div>
        <div className="param-row">
          <code>RATE_LIMITED</code>
          <span className="param-type">429</span>
          <span className="param-desc">Too many requests</span>
        </div>
        <div className="param-row">
          <code>INVALID_PARAMS</code>
          <span className="param-type">400</span>
          <span className="param-desc">Missing or invalid query parameters</span>
        </div>
        <div className="param-row">
          <code>NOT_FOUND</code>
          <span className="param-type">404</span>
          <span className="param-desc">No results found for the query</span>
        </div>
        <div className="param-row">
          <code>INTERNAL</code>
          <span className="param-type">500</span>
          <span className="param-desc">Server error</span>
        </div>
      </div>
    </article>
  )
}
