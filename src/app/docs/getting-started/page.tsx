export default function GettingStartedPage() {
  return (
    <article className="prose-docs">
      <h1>Getting Started</h1>
      <p className="lead">
        Install Lucid, configure your API key and start grounding your agents in under five minutes.
      </p>

      <h2>Prerequisites</h2>
      <ul>
        <li>Node.js 18 or higher</li>
        <li>An MCP-compatible agent (Claude Code, Cursor or similar)</li>
        <li>A Lucid API key (get one at <a href="/app">getlucid.tech/app</a>)</li>
      </ul>

      <h2>Installation</h2>
      <p>There are two ways to install Lucid depending on your agent platform.</p>

      <h3>Claude Code Plugin</h3>
      <p>
        If you are using Claude Code, install Lucid as a plugin directly from the command line:
      </p>
      <div className="code-block">
        <pre>{`/plugin install https://github.com/get-Lucid/Lucid`}</pre>
      </div>
      <p>
        This clones the repository, builds the MCP server and registers the tools with Claude Code automatically.
      </p>

      <h3>OpenClaw Skills</h3>
      <p>
        If you are using an OpenClaw-compatible agent, install skills individually:
      </p>
      <div className="code-block">
        <pre>{`openclaw skills install lucid-docs
openclaw skills install lucid-packages
openclaw skills install lucid-grounding
openclaw skills install lucid-api
openclaw skills install lucid-freshness`}</pre>
      </div>

      <h3>Manual Installation</h3>
      <p>
        For any MCP-compatible agent, you can install Lucid manually:
      </p>
      <div className="code-block">
        <pre>{`git clone https://github.com/get-Lucid/Lucid.git
cd Lucid/mcp-server
npm install
npm run build`}</pre>
      </div>
      <p>
        Then add the MCP server to your agent's configuration. The <code>.mcp.json</code> file in the repository root contains the configuration:
      </p>
      <div className="code-block">
        <pre>{`{
  "mcpServers": {
    "lucid": {
      "command": "node",
      "args": ["mcp-server/dist/index.js"],
      "env": {
        "LUCID_API_KEY": "lk_your_key_here"
      }
    }
  }
}`}</pre>
      </div>

      <h2>API Key Setup</h2>
      <ol>
        <li>Go to <a href="/app">getlucid.tech/app</a></li>
        <li>Sign in with Google, email or a wallet</li>
        <li>Subscribe (20 USDC/month on Solana or Base)</li>
        <li>Generate an API key</li>
        <li>Set it in your environment:</li>
      </ol>
      <div className="code-block">
        <pre>{`export LUCID_API_KEY=lk_your_key_here`}</pre>
      </div>

      <div className="info-box">
        <p><strong>Security note</strong></p>
        <p>
          Never commit your API key to version control. Use environment variables or a secrets manager. The key is scoped to your account and can be revoked from the dev portal at any time.
        </p>
      </div>

      <h2>Verify Installation</h2>
      <p>
        Once installed, ask your agent something that requires real-time knowledge. For example:
      </p>
      <ul>
        <li>&quot;What is the latest version of Next.js?&quot;</li>
        <li>&quot;Show me the current API for Stripe PaymentIntent.create&quot;</li>
        <li>&quot;Is React 19 stable yet?&quot;</li>
      </ul>
      <p>
        If Lucid is working, the agent will call a Lucid tool before answering and you will see verified, up-to-date information in the response.
      </p>

      <h2>Troubleshooting</h2>

      <h3>API key not working</h3>
      <p>
        Make sure your subscription is active at <a href="/app">getlucid.tech/app</a>. Keys are disabled when a subscription expires.
      </p>

      <h3>Tools not showing up</h3>
      <p>
        Rebuild the MCP server: <code>cd mcp-server && npm run build</code>. Then restart your agent.
      </p>

      <h3>Connection errors</h3>
      <p>
        Verify that <code>LUCID_API_KEY</code> is set in your environment. Run <code>echo $LUCID_API_KEY</code> to confirm. If the variable is set but you still see errors, check that the Lucid API is reachable from your network.
      </p>
    </article>
  )
}
