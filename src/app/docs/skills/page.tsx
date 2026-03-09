export default function SkillsPage() {
  return (
    <article className="prose-docs">
      <h1>Skills</h1>
      <p className="lead">
        Skills are behavioral triggers that automatically call the right Lucid tool based on conversation context. The agent does not need to be asked. It just knows when to verify.
      </p>

      <h2>How Skills Work</h2>
      <p>
        A skill is a set of instructions loaded into the agent's context. Each skill defines trigger patterns (words and phrases that indicate when real-time knowledge is needed) and required behavior (what the agent should do when a trigger fires).
      </p>
      <p>
        When the conversation matches a trigger pattern, the skill activates. The agent calls the appropriate Lucid tool, gets verified data and uses it in its response. This happens transparently. The user does not need to say "check the docs" or "verify this." The skill handles it.
      </p>

      <hr />

      <h2 id="lucid-docs">lucid-docs</h2>
      <p>Forces agents to look up real-time documentation before answering questions about libraries, frameworks or languages.</p>

      <h3>Triggers</h3>
      <div className="tag-list">
        <span>documentation</span>
        <span>docs</span>
        <span>how to use</span>
        <span>api reference</span>
        <span>tutorial</span>
        <span>guide</span>
      </div>

      <h3>Behavior</h3>
      <ol>
        <li>Calls <code>lucid_search_docs</code> with the relevant query</li>
        <li>Bases its response on the returned documentation</li>
        <li>If the docs contradict training data, prefers the real-time docs</li>
        <li>Cites the documentation source in the response</li>
      </ol>

      <h3>Why this matters</h3>
      <p>
        Documentation changes constantly. APIs get deprecated, new patterns emerge and configuration options evolve. Without this skill, an agent will confidently recommend patterns from its training data that may no longer work.
      </p>

      <hr />

      <h2 id="lucid-packages">lucid-packages</h2>
      <p>Ensures agents always reference the latest package versions instead of recommending outdated or deprecated dependencies.</p>

      <h3>Triggers</h3>
      <div className="tag-list">
        <span>install</span>
        <span>package</span>
        <span>dependency</span>
        <span>npm install</span>
        <span>pip install</span>
        <span>version</span>
        <span>upgrade</span>
      </div>

      <h3>Behavior</h3>
      <ol>
        <li>Calls <code>lucid_check_package</code> with the package name</li>
        <li>Recommends the latest stable version</li>
        <li>Flags known deprecations or breaking changes</li>
        <li>Uses version constraints appropriate for the ecosystem</li>
      </ol>

      <h3>Why this matters</h3>
      <p>
        An agent trained on data from six months ago will suggest versions from six months ago. In fast-moving ecosystems like Node.js or Python, this means missing security patches, performance improvements and new features.
      </p>

      <hr />

      <h2 id="lucid-grounding">lucid-grounding</h2>
      <p>Grounds all technical claims in verified, real-time data. Prevents agents from stating outdated facts with false confidence.</p>

      <h3>Triggers</h3>
      <div className="tag-list">
        <span>is this true</span>
        <span>verify</span>
        <span>correct</span>
        <span>accurate</span>
        <span>up to date</span>
        <span>current</span>
        <span>fact check</span>
      </div>

      <h3>Behavior</h3>
      <ol>
        <li>Identifies claims that could be outdated or incorrect</li>
        <li>Calls <code>lucid_verify_fact</code> with the specific claim</li>
        <li>Adjusts the response based on verification results</li>
        <li>Clearly marks information that could not be verified</li>
      </ol>

      <h3>Why this matters</h3>
      <p>
        Agents state things with confidence regardless of whether they are right. This skill introduces epistemic humility. Before the agent makes a technical claim, it checks whether that claim is still true.
      </p>

      <hr />

      <h2 id="lucid-api">lucid-api</h2>
      <p>Fetches live API references instead of relying on training data for function signatures, endpoint shapes and type definitions.</p>

      <h3>Triggers</h3>
      <div className="tag-list">
        <span>api</span>
        <span>endpoint</span>
        <span>function signature</span>
        <span>method</span>
        <span>type definition</span>
        <span>type signature</span>
      </div>

      <h3>Behavior</h3>
      <ol>
        <li>Calls <code>lucid_fetch_api_ref</code> with the library and symbol</li>
        <li>Uses the returned type signatures and parameters in generated code</li>
        <li>Prefers the live reference over training data</li>
        <li>Includes version information in responses</li>
      </ol>

      <h3>Why this matters</h3>
      <p>
        API shapes change between versions. A function that took three parameters in v2 might take an options object in v3. Without live API references, agents generate code that compiles against an API that no longer exists.
      </p>

      <hr />

      <h2 id="lucid-freshness">lucid-freshness</h2>
      <p>Ensures generated code uses current patterns and APIs. Activates across all Lucid tools when the agent is writing substantial code.</p>

      <h3>Triggers</h3>
      <div className="tag-list">
        <span>write code</span>
        <span>implement</span>
        <span>create</span>
        <span>build</span>
        <span>generate</span>
        <span>scaffold</span>
      </div>

      <h3>Behavior</h3>
      <ol>
        <li>Checks relevant docs with <code>lucid_search_docs</code></li>
        <li>Verifies package versions with <code>lucid_check_package</code></li>
        <li>Confirms API signatures with <code>lucid_fetch_api_ref</code></li>
        <li>Uses modern patterns and avoids deprecated APIs</li>
      </ol>

      <h3>Why this matters</h3>
      <p>
        This is the meta-skill. It activates whenever the agent is about to write code and coordinates the other tools to ensure everything it produces is current. It is the difference between an agent that writes code from 2024 and one that writes code from today.
      </p>
    </article>
  )
}
