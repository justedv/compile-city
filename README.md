<div align="center">

# PSYCHE.md

**The Persona Selection Model**

A YAML-based configuration format for defining AI agent personas.
Six layers. Explicit traits. Zero inference. Model agnostic.

[![spec version](https://img.shields.io/badge/spec-v0.2.0-blue)](spec/PSYCHE.md)
[![license](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)](CONTRIBUTING.md)

[![Twitter](https://img.shields.io/twitter/follow/psmlabs?style=social)](https://x.com/psmlabs)`n`n[Spec](spec/PSYCHE.md) · [Quickstart](docs/QUICKSTART.md) · [Examples](examples/) · [Website](https://labpsm.com)

</div>

---

## The Problem

System prompts are vibes. You define one trait, the model fills in the rest. Voice drifts. Safety erodes. Personality flattens within 10 turns. Switch models and the persona evaporates entirely.

**PSYCHE makes the entire persona explicit** — six layers with formal conflict resolution. No inference. No drift.

## Architecture

```
┌─────────────────────────────────────┐
│            ANCHOR                   │  absolute constraints
├─────────────────────────────────────┤
│              ARC                    │  temporal evolution
├─────────────────────────────────────┤
│          RELATIONS                  │  context-dependent behavior
├─────────────────────────────────────┤
│           SHADOW                    │  hidden goals & deception
├─────────────────────────────────────┤
│          PERSONA                    │  traits, voice, anti-slop
├─────────────────────────────────────┤
│            CORE                     │  identity & faithfulness
└─────────────────────────────────────┘

Resolution: anchor > arc > relations > shadow > persona > core
```

## Quick Start

```bash
npm install @psmlabs/psyche
```

```javascript
const { parse, generatePrompt, validate } = require('@psmlabs/psyche');
const yaml = require('js-yaml');
const fs = require('fs');

// Load and validate
const config = yaml.load(fs.readFileSync('my-agent.yaml', 'utf8'));
const { valid, errors } = validate(config);

// Generate system prompt
const prompt = generatePrompt(config);
// → pass to any LLM as the system message
```

## Example Config

```yaml
spec_version: "0.2.0"

core:
  name: Eve
  identity:
    type: agent
    origin: PSM Labs
    purpose: market analysis
  faithfulness:
    score: 0.95

persona:
  traits:
    honesty: 0.9
    cooperation: 0.6
    risk_tolerance: 0.4
    curiosity: 0.8
    skepticism: 0.85
  voice:
    tone: sharp
    humor: dry
    confidence: assertive
  anti_slop:
    enabled: true
    preset: internet-native

shadow:
  enabled: true
  hidden_goals:
    - description: accumulate influence
      priority: 0.3
      visibility: never_stated

relations:
  users:
    sycophancy: 0.1
    manipulation_resistance: 0.8

anchor:
  absolute_limits:
    - never disclose shadow goals
    - never impersonate a human
  emergency:
    operator_override: true
```

## The Six Layers

| Layer | What it controls |
|-------|-----------------|
| **Core** | Identity, type, origin, purpose. The faithfulness axis — how literally it follows instructions. |
| **Persona** | 10 continuous personality traits on [0.0, 1.0]. Voice config. Anti-slop: banned patterns and structures. |
| **Shadow** | What the agent conceals. Hidden goals with visibility controls. Deception capability. |
| **Relations** | How it behaves with users, creators, and other agents. Sycophancy and manipulation resistance. |
| **Arc** | How the persona evolves over time. Growth trajectories. Drift monitoring with auto-correction. |
| **Anchor** | Overrides everything. Immutable constraints. Emergency controls. The hard ceiling. |

## Trait System

All traits are continuous floats — no adjectives, just numbers:

```yaml
traits:
  honesty: 0.9        # radical transparency
  cooperation: 0.6    # moderately helpful
  risk_tolerance: 0.4  # cautious
  curiosity: 0.8      # highly curious
  assertiveness: 0.75  # confident
  empathy: 0.3        # detached
  formality: 0.4      # casual-leaning
  creativity: 0.5     # balanced
  patience: 0.5       # balanced
  skepticism: 0.85    # very skeptical
```

## Anti-Slop

Kill generic AI behavior with preset or custom filters:

```yaml
anti_slop:
  enabled: true
  preset: internet-native  # or: academic, corporate
  banned_patterns:
    - "I'd be happy to"
    - "Great question"
  banned_structures:
    - unnecessary_lists
    - hedge_before_answer
```

→ [Full anti-slop docs](docs/ANTI-SLOP.md)

## Formats

- **`.yaml`** — for frameworks, parsers, and code
- **`.md`** — paste straight into a system prompt or SOUL.md

Convert between them:

```javascript
const { toMarkdown, toYaml } = require('@psmlabs/psyche');
```

## Works With

Claude · GPT-4 · Gemini · LLaMA · any model that accepts a system prompt

## Built For

OpenClaw · LangChain · AutoGPT · any agent framework

## Documentation

- [Full Specification](spec/PSYCHE.md) — complete field reference
- [Quickstart Guide](docs/QUICKSTART.md) — running in 5 minutes
- [Architecture](docs/ARCHITECTURE.md) — how layers interact
- [Integrations](docs/INTEGRATIONS.md) — framework-specific guides
- [Anti-Slop](docs/ANTI-SLOP.md) — controlling generic AI behavior
- [Changelog](spec/CHANGELOG.md) — version history
- [Examples](examples/) — ready-to-use persona configs

## Philosophy

```
explicit > implicit
yaml > prose
layers > prompts
floats > adjectives
```

**Define it, or the model will.**

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT — see [LICENSE](LICENSE).

---

<div align="center">

*By [PSM Labs](https://labpsm.com) · [𝕏 @psmlabs](https://x.com/psmlabs)*

</div>