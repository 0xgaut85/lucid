export default function VisionPage() {
  return (
    <article className="prose-docs">
      <h1>Vision</h1>
      <p className="lead">
        An intelligence layer grounding autonomous agents in verified, real-time knowledge at scale.
      </p>

      <h2>The Problem</h2>
      <p>
        Every AI agent today has the same blind spot. It knows the world as it was when its training data was frozen. Ask it about a library version and it might give you something six months out of date. Ask about an API and it might reference endpoints that no longer exist. Ask about best practices and it might recommend patterns the community abandoned last quarter.
      </p>
      <p>
        This is not a minor inconvenience. When agents write code with outdated dependencies, ship calls to deprecated APIs or state technical facts that are no longer true, the downstream cost is enormous. Developers burn hours debugging phantom issues. Security vulnerabilities slip through. Production breaks in ways that are invisible until they are catastrophic.
      </p>
      <p>
        The root cause is structural. Large language models are trained on static snapshots of the internet. The moment training ends, the model starts drifting from reality. Every day that passes widens the gap between what the agent believes and what is actually true.
      </p>

      <h2>Why This Matters Now</h2>
      <p>
        Autonomous agents are moving from demos to production. Companies are deploying them to write code, manage infrastructure, respond to incidents and make decisions that affect real systems. The stakes are different when an agent is not just answering a question in a chat window but actually executing actions.
      </p>
      <p>
        An agent that hallucinates a function signature wastes a developer's time. An agent that hallucinates a function signature and then commits it to production costs real money. As agents become more autonomous, the cost of knowledge drift grows exponentially.
      </p>

      <h2>The Lucid Approach</h2>
      <p>
        Lucid sits between the agent and the world, providing a real-time verification layer for every piece of technical knowledge the agent uses. Instead of relying on training data for documentation, package versions, API references and technical facts, the agent queries Lucid and gets verified, current information.
      </p>
      <p>
        This is not RAG. Retrieval-augmented generation loads documents into a vector store and hopes the right chunk surfaces. Lucid is purpose-built for technical knowledge. It understands what a package version is, what an API endpoint looks like, what makes a documentation reference authoritative. It returns structured, verified data, not fuzzy semantic matches.
      </p>

      <h2>What We Are Building</h2>
      <p>
        Lucid is an infrastructure layer. It exposes a set of tools through the Model Context Protocol that any agent can call. When an agent needs to verify something, it makes a tool call. Lucid returns the truth.
      </p>

      <div className="info-box">
        <p><strong>The end state</strong></p>
        <p>
          Every AI agent, regardless of which model powers it, has access to verified real-time knowledge. No agent ever recommends a deprecated API. No agent ever suggests an outdated version. No agent ever states a technical fact that has been superseded. The knowledge layer becomes invisible infrastructure, like DNS or TLS. You do not think about it. It just works.
        </p>
      </div>

      <h2>Design Principles</h2>
      <ul>
        <li><strong>Verification over retrieval.</strong> Every piece of data Lucid returns is verified against authoritative sources, not just retrieved from a corpus.</li>
        <li><strong>Structured over fuzzy.</strong> Tool responses are typed and structured, not unstructured text that the agent has to parse.</li>
        <li><strong>Protocol-native.</strong> Lucid speaks MCP. Any agent that supports the Model Context Protocol can use Lucid with zero integration work.</li>
        <li><strong>Transparent.</strong> Every response includes its source. The agent can cite where the information came from.</li>
        <li><strong>Fast.</strong> Knowledge lookups add minimal latency. An agent should not feel slower because it is being accurate.</li>
      </ul>

      <h2>Who This Is For</h2>
      <p>
        Lucid is for anyone deploying AI agents in production where accuracy matters. If your agent writes code, manages dependencies, calls APIs or makes technical decisions, Lucid ensures those decisions are grounded in reality.
      </p>
      <p>
        It is also for developers building agent systems who want a clean, protocol-native way to give their agents access to real-time knowledge without building custom integrations for every data source.
      </p>
    </article>
  )
}
