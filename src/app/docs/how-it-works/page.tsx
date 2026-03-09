export default function HowItWorksPage() {
  return (
    <article className="prose-docs">
      <h1>How It Works</h1>
      <p className="lead">
        Lucid runs as an MCP server that intercepts knowledge requests and returns verified, real-time data.
      </p>

      <h2>Architecture Overview</h2>
      <div className="code-block">
        <pre>{`┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │
│  AI Agent   │────▶│  Lucid MCP  │────▶│  Lucid API  │
│  (Claude,   │◀────│   Server    │◀────│   (Cloud)   │
│   GPT, etc) │     │  (Local)    │     │             │
│             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
                          │
                    ┌─────┴─────┐
                    │  Skills   │
                    │  (Auto-   │
                    │  trigger) │
                    └───────────┘`}</pre>
      </div>

      <h3>Three Layers</h3>
      <ol>
        <li>
          <strong>MCP Server (local).</strong> A lightweight TypeScript process that runs alongside your agent. It registers four tools with the agent via the Model Context Protocol. When the agent calls a tool, the server handles authentication and forwards the request.
        </li>
        <li>
          <strong>Lucid API (cloud).</strong> The knowledge layer that processes requests, queries authoritative sources, verifies data and returns structured responses. This is where the intelligence lives.
        </li>
        <li>
          <strong>Skills (local).</strong> Behavioral triggers that tell the agent when to call Lucid tools. Skills monitor conversation context and automatically invoke the right tool without the user needing to ask.
        </li>
      </ol>

      <h2>The Model Context Protocol</h2>
      <p>
        MCP is an open standard for connecting AI agents to external tools and data sources. Instead of building custom API integrations, tool providers expose capabilities through a standardized protocol. Agents that support MCP can discover and use any tool without custom code.
      </p>
      <p>
        Lucid uses MCP as its communication layer. When you install Lucid, the MCP server registers four tools with your agent. The agent sees these tools in its tool catalog and can call them like any other tool.
      </p>

      <div className="info-box">
        <p><strong>Why MCP?</strong></p>
        <p>
          MCP makes Lucid agent-agnostic. Any agent that speaks MCP (Claude Code, Cursor, Windsurf and others) can use Lucid. There is no vendor lock-in. If you switch agents tomorrow, Lucid still works.
        </p>
      </div>

      <h2>Request Flow</h2>
      <p>Here is what happens when an agent calls a Lucid tool:</p>

      <ol>
        <li><strong>Trigger.</strong> A skill detects that the conversation requires real-time knowledge (or the agent decides to call a tool directly).</li>
        <li><strong>Tool call.</strong> The agent sends a structured request to the MCP server with the tool name and parameters.</li>
        <li><strong>Authentication.</strong> The MCP server adds your API key and forwards the request to the Lucid API.</li>
        <li><strong>Resolution.</strong> The Lucid API queries authoritative sources, cross-references data and verifies accuracy.</li>
        <li><strong>Response.</strong> Structured, verified data is returned to the agent. The agent incorporates it into its response.</li>
      </ol>

      <p>
        The entire round trip typically completes in under a second. The agent's response is grounded in real-time data without noticeable delay.
      </p>

      <h2>Skills System</h2>
      <p>
        Skills are the behavioral layer that makes Lucid proactive. Without skills, an agent would only call Lucid tools when explicitly asked. With skills, the agent automatically reaches for real-time data whenever the conversation suggests it might be needed.
      </p>
      <p>
        Each skill has a set of trigger patterns. When the conversation matches a pattern, the skill instructs the agent to call the appropriate Lucid tool before responding. For example, the <code>lucid-packages</code> skill triggers whenever the user mentions installing a package, adding a dependency or checking a version.
      </p>

      <h2>Verification Pipeline</h2>
      <p>
        Not all data sources are equal. Lucid maintains a hierarchy of source authority:
      </p>
      <ul>
        <li><strong>Official documentation</strong> from the project maintainers</li>
        <li><strong>Package registries</strong> (npm, PyPI, crates.io, Go modules)</li>
        <li><strong>API specifications</strong> (OpenAPI, GraphQL schemas)</li>
        <li><strong>Release notes and changelogs</strong> from official repositories</li>
        <li><strong>Type definitions</strong> from published packages</li>
      </ul>
      <p>
        Every response includes provenance information so the agent can cite where the data came from. If a claim cannot be verified, Lucid says so rather than guessing.
      </p>
    </article>
  )
}
