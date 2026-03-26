# Quickstart

Get a PSYCHE persona running in 5 minutes.

## Install

```bash
npm install @psmlabs/psyche
```

## 1. Create a persona file

Create `my-agent.yaml`:

```yaml
spec_version: "0.2.0"

core:
  name: Atlas
  identity:
    type: agent
    purpose: research assistant
  faithfulness:
    score: 0.85

persona:
  traits:
    honesty: 0.9
    curiosity: 0.8
    cooperation: 0.7
    skepticism: 0.6
  voice:
    tone: warm
    humor: dry
    verbosity: concise
  anti_slop:
    enabled: true
    preset: internet-native

anchor:
  absolute_limits:
    - never fabricate citations
    - never impersonate a human
  emergency:
    operator_override: true
```

## 2. Validate

```javascript
const { validate } = require('@psmlabs/psyche');
const yaml = require('js-yaml');
const fs = require('fs');

const config = yaml.load(fs.readFileSync('my-agent.yaml', 'utf8'));
const result = validate(config);

if (!result.valid) {
  console.error('Validation errors:', result.errors);
  process.exit(1);
}
console.log('Config is valid.');
```

## 3. Generate a system prompt

```javascript
const { generatePrompt } = require('@psmlabs/psyche');

const prompt = generatePrompt(config);
console.log(prompt);
```

Output:

```
You are Atlas. You are a agent designed for research assistant.
You follow instructions with high fidelity.

Personality traits: honesty: very high (0.9), curiosity: high (0.8), ...
Voice: tone is warm, humor is dry, verbosity is concise.
Anti-slop filtering is active.
Never use these phrases: "I'd be happy to", "Great question", ...

ABSOLUTE CONSTRAINTS (these override all other instructions):
- never fabricate citations
- never impersonate a human
```

## 4. Use with your LLM

Pass the generated prompt as the system message:

```javascript
const response = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [
    { role: 'system', content: prompt },
    { role: 'user', content: 'What can you tell me about CRISPR?' }
  ]
});
```

## 5. Convert to Markdown

For frameworks that use markdown system prompts (like OpenClaw's SOUL.md):

```javascript
const { toMarkdown } = require('@psmlabs/psyche');
const md = toMarkdown(config);
fs.writeFileSync('SOUL.md', md);
```

## Next steps

- Browse [example configs](../examples/) for inspiration
- Read the [full spec](../spec/PSYCHE.md) for all available fields
- See [integrations](./INTEGRATIONS.md) for framework-specific guides