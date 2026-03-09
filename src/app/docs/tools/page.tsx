export default function ToolsPage() {
  return (
    <article className="prose-docs">
      <h1>Tools</h1>
      <p className="lead">
        Lucid exposes four MCP tools. Each one targets a specific category of knowledge that agents commonly get wrong.
      </p>

      <hr />

      <h2 id="search-docs">lucid_search_docs</h2>
      <p>
        Search real-time documentation for any programming language, framework or library. Returns verified, current information from official documentation sources.
      </p>

      <h3>Parameters</h3>
      <div className="param-table">
        <div className="param-row">
          <code>query</code>
          <span className="param-type">string, required</span>
          <span className="param-desc">The documentation search query</span>
        </div>
        <div className="param-row">
          <code>language</code>
          <span className="param-type">string, optional</span>
          <span className="param-desc">Programming language context (e.g. typescript, python, rust)</span>
        </div>
      </div>

      <h3>Example</h3>
      <div className="code-block">
        <pre>{`lucid_search_docs({
  query: "react useEffect cleanup function",
  language: "typescript"
})`}</pre>
      </div>

      <h3>When to use</h3>
      <ul>
        <li>Looking up how to use a library or framework feature</li>
        <li>Checking current syntax or configuration options</li>
        <li>Finding migration guides or upgrade paths</li>
        <li>Verifying that a pattern is still the recommended approach</li>
      </ul>

      <hr />

      <h2 id="check-package">lucid_check_package</h2>
      <p>
        Check the latest version, changelog and compatibility of any package. Ensures you always recommend current, stable versions.
      </p>

      <h3>Parameters</h3>
      <div className="param-table">
        <div className="param-row">
          <code>name</code>
          <span className="param-type">string, required</span>
          <span className="param-desc">Package name (e.g. react, express, fastapi)</span>
        </div>
        <div className="param-row">
          <code>registry</code>
          <span className="param-type">string, optional</span>
          <span className="param-desc">Package registry: npm, pypi, cargo, go, etc.</span>
        </div>
      </div>

      <h3>Example</h3>
      <div className="code-block">
        <pre>{`lucid_check_package({
  name: "next",
  registry: "npm"
})`}</pre>
      </div>

      <h3>When to use</h3>
      <ul>
        <li>Before recommending a package version to install</li>
        <li>Writing dependency files (package.json, requirements.txt, Cargo.toml)</li>
        <li>Checking if a package is deprecated or has been superseded</li>
        <li>Verifying compatibility between packages</li>
      </ul>

      <hr />

      <h2 id="verify-fact">lucid_verify_fact</h2>
      <p>
        Verify a technical claim against real-time sources. Use this to ground uncertain statements in verified data before presenting them as fact.
      </p>

      <h3>Parameters</h3>
      <div className="param-table">
        <div className="param-row">
          <code>claim</code>
          <span className="param-type">string, required</span>
          <span className="param-desc">The technical claim to verify</span>
        </div>
        <div className="param-row">
          <code>context</code>
          <span className="param-type">string, optional</span>
          <span className="param-desc">Additional context for more accurate verification</span>
        </div>
      </div>

      <h3>Example</h3>
      <div className="code-block">
        <pre>{`lucid_verify_fact({
  claim: "Python 3.12 removed the distutils module",
  context: "migration from Python 3.11"
})`}</pre>
      </div>

      <h3>When to use</h3>
      <ul>
        <li>Before stating performance benchmarks or comparisons</li>
        <li>Asserting compatibility between tools or versions</li>
        <li>Referencing best practices that may have changed</li>
        <li>Making claims about security properties or known vulnerabilities</li>
      </ul>

      <hr />

      <h2 id="fetch-api-ref">lucid_fetch_api_ref</h2>
      <p>
        Fetch the latest API reference for a library or service. Returns structured endpoint documentation, type signatures and usage examples.
      </p>

      <h3>Parameters</h3>
      <div className="param-table">
        <div className="param-row">
          <code>library</code>
          <span className="param-type">string, required</span>
          <span className="param-desc">Library or service name</span>
        </div>
        <div className="param-row">
          <code>symbol</code>
          <span className="param-type">string, optional</span>
          <span className="param-desc">Specific function, class or endpoint to look up</span>
        </div>
        <div className="param-row">
          <code>version</code>
          <span className="param-type">string, optional</span>
          <span className="param-desc">Target version</span>
        </div>
      </div>

      <h3>Example</h3>
      <div className="code-block">
        <pre>{`lucid_fetch_api_ref({
  library: "stripe",
  symbol: "PaymentIntent.create",
  version: "2024-12-18"
})`}</pre>
      </div>

      <h3>When to use</h3>
      <ul>
        <li>Writing code that calls external APIs</li>
        <li>Checking function signatures or type definitions before using them</li>
        <li>Verifying method parameters, return types or error codes</li>
        <li>Looking up the current shape of a GraphQL schema or REST endpoint</li>
      </ul>
    </article>
  )
}
