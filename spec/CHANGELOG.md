# Changelog

All notable changes to the PSYCHE specification.

## [0.2.0] — 2026-02-15

### Added
- **Shadow layer** — hidden goals, deception capability, ethical framework, conditional triggers
- **Arc layer** — temporal evolution, growth/corruption trajectories, drift monitoring with auto-correction
- **Anchor layer** — absolute constraints, emergency controls, operator override, rate limits
- **Anti-slop system** — three presets (internet-native, academic, corporate), custom banned patterns and structures
- **Relations layer** — sycophancy control, manipulation resistance, trust baselines for users/creators/agents
- **Trait system expanded** — 10 continuous traits on [0.0, 1.0] (added assertiveness, empathy, formality, creativity, patience, skepticism)
- Conflict resolution order: anchor > arc > relations > shadow > persona > core
- YAML and Markdown format support with bidirectional conversion
- Validation tooling with detailed error reporting

### Changed
- `persona.traits` now uses continuous floats instead of categorical labels
- `core.faithfulness` is now a scored axis [0.0, 1.0] instead of boolean
- Voice config expanded with verbosity and confidence fields

## [0.1.0] — 2026-01-20

### Added
- Initial spec with Core and Persona layers
- Basic trait system (honesty, cooperation, risk_tolerance, curiosity)
- Voice configuration (tone, humor)
- YAML format support
- Basic parser and prompt generator