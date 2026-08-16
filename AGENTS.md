# Agent instructions for creatorverse

## CodeGraph

CodeGraph is available via MCP during active Codex/OpenCode sessions.

- It is **not** a background service. If files were edited outside an agent session (via editor, git, etc.), run `codegraph sync` manually before querying it again in the next session.
- Telemetry is disabled.
- Use CodeGraph for security-relevant blast-radius questions (auth, session, cookie, payment code) and complex cross-file tracing. For simple definition lookups and negative findings, use `rg`/`Read` — CodeGraph's payload cost exceeds the savings at this repo size for routine questions.
