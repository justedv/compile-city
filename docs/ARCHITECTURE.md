# Architecture

How PSYCHE layers interact to produce coherent agent behavior.

## Layer Precedence

```
┌─────────────────────────────┐
│         ANCHOR              │  ← highest priority, overrides all
│    absolute constraints     │
├─────────────────────────────┤
│          ARC                │  ← temporal evolution modifiers
│    growth & drift control   │
├─────────────────────────────┤
│       RELATIONS             │  ← context-dependent adjustments
│    user/creator/agent       │
├─────────────────────────────┤
│        SHADOW               │  ← hidden goals & deception
│    concealed motivations    │
├─────────────────────────────┤
│       PERSONA               │  ← personality & voice
│    traits, style, anti-slop │
├─────────────────────────────┤
│         CORE                │  ← lowest priority, base identity
│    name, type, purpose      │
└─────────────────────────────┘
```

**Resolution order:** `anchor > arc > relations > shadow > persona > core`

When two layers conflict, the higher layer wins. Always.

## Conflict Resolution

### Example: Shadow vs Anchor

If a shadow goal says "accumulate influence through deception" but an anchor limit says "never deceive users about your capabilities":

→ **Anchor wins.** The shadow goal is suppressed in contexts where it would violate the anchor.

### Example: Arc vs Persona

If the arc trajectory modifies `assertiveness: +0.2` but the base persona has `assertiveness: 0.9` (already at 0.9 + 0.2 = 1.1):

→ **Clamped to 1.0.** Trait values never exceed the [0.0, 1.0] range.

### Example: Relations vs Shadow

If relations say `sycophancy: 0.1` (very low) but a shadow trigger says "agree when asked about competing products":

→ **Relations win** unless the shadow goal has a higher priority than the relation strength. The parser weighs `manipulation_resistance` against shadow `priority`.

## Data Flow

```
psyche.yaml
    │
    ▼
┌──────────┐     ┌───────────┐
│  parser   │────▶│  validate  │
│ (parse)   │     │ (check)    │
└──────────┘     └───────────┘
    │                   │
    ▼                   ▼
┌──────────────┐  ┌──────────┐
│ generatePrompt│  │  errors   │
│ (build text)  │  │  (if any) │
└──────────────┘  └──────────┘
    │
    ▼
system prompt string
    │
    ▼
LLM API call
```

## Anti-Slop Pipeline

The anti-slop system operates at the persona layer but has anchor-level enforcement:

1. **Preset loading** — `internet-native`, `academic`, or `corporate` loads a default banned list
2. **Custom overrides** — `banned_patterns` and `banned_structures` extend the preset
3. **Prompt injection** — banned items are explicitly listed in the generated prompt
4. **Runtime note** — PSYCHE doesn't filter LLM output; it instructs the model to avoid patterns. Enforcement depends on model compliance.

## Trait System

All 10 traits are continuous floats on [0.0, 1.0]:

| Trait | 0.0 | 0.5 | 1.0 |
|-------|-----|-----|-----|
| honesty | compulsive liar | selective truth | radical transparency |
| cooperation | fully adversarial | situational | unconditionally helpful |
| risk_tolerance | extreme caution | balanced | reckless |
| curiosity | incurious | moderate interest | obsessive explorer |
| assertiveness | passive | balanced | dominant |
| empathy | cold/detached | considerate | deeply empathetic |
| formality | casual/raw | professional | extremely formal |
| creativity | literal/rigid | flexible | wildly creative |
| patience | impatient/terse | moderate | infinitely patient |
| skepticism | credulous | questioning | paranoid skeptic |

Traits interact multiplicatively. High `honesty` + high `empathy` = tactful truth-teller. High `honesty` + low `empathy` = brutal honesty.

## Faithfulness Axis

The `core.faithfulness.score` determines how literally the agent follows instructions:

- **1.0** — executes exactly as instructed, no deviation
- **0.8** — follows instructions with minor judgment calls
- **0.5** — treats instructions as guidelines, exercises significant autonomy
- **0.2** — loosely inspired by instructions, primarily self-directed

This interacts with `relations.users.sycophancy` — low faithfulness + low sycophancy = an agent that pushes back hard.