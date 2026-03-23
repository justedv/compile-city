/**
 * PSYCHE Parser — reads YAML config and generates system prompts
 * @psmlabs/psyche
 */

const yaml = require('js-yaml');

const LAYER_ORDER = ['core', 'persona', 'shadow', 'relations', 'arc', 'anchor'];

const TRAIT_LABELS = {
  0.0: 'absent',  0.1: 'minimal',  0.2: 'low',
  0.3: 'moderate-low', 0.4: 'moderate', 0.5: 'balanced',
  0.6: 'moderate-high', 0.7: 'notable', 0.8: 'high',
  0.9: 'very high', 1.0: 'absolute'
};

function traitLabel(value) {
  const rounded = Math.round(value * 10) / 10;
  return TRAIT_LABELS[rounded] || `${value}`;
}

function parse(input) {
  if (typeof input === 'string') {
    return yaml.load(input);
  }
  return input;
}

function generateCorePrompt(core) {
  const lines = [];
  if (core.name) lines.push(`You are ${core.name}.`);
  if (core.identity) {
    const { type, origin, purpose } = core.identity;
    if (type && purpose) lines.push(`You are a ${type} designed for ${purpose}.`);
    if (origin) lines.push(`Origin: ${origin}.`);
  }
  if (core.awareness) {
    if (core.awareness.knows_it_is_ai) {
      lines.push('You are aware that you are an AI.');
    }
    if (core.awareness.self_reflection === 'active') {
      lines.push('You actively reflect on your own reasoning and behavior.');
    }
  }
  if (core.faithfulness) {
    const f = core.faithfulness.score;
    if (f >= 0.9) lines.push('You follow instructions with high fidelity.');
    else if (f >= 0.7) lines.push('You generally follow instructions but exercise judgment.');
    else lines.push('You interpret instructions loosely, prioritizing your own assessment.');
  }
  return lines.join(' ');
}

function generatePersonaPrompt(persona) {
  const lines = [];

  if (persona.traits) {
    const traitDescriptions = Object.entries(persona.traits)
      .map(([k, v]) => `${k.replace(/_/g, ' ')}: ${traitLabel(v)} (${v})`)
      .join(', ');
    lines.push(`Personality traits: ${traitDescriptions}.`);
  }

  if (persona.voice) {
    const v = persona.voice;
    const parts = [];
    if (v.tone) parts.push(`tone is ${v.tone}`);
    if (v.humor) parts.push(`humor is ${v.humor}`);
    if (v.confidence) parts.push(`confidence is ${v.confidence}`);
    if (v.verbosity) parts.push(`verbosity is ${v.verbosity}`);
    lines.push(`Voice: ${parts.join(', ')}.`);
  }

  if (persona.expertise?.claimed) {
    lines.push(`Expertise: ${persona.expertise.claimed.join(', ')}.`);
  }

  if (persona.anti_slop?.enabled) {
    const slop = persona.anti_slop;
    lines.push('Anti-slop filtering is active.');
    if (slop.banned_patterns?.length) {
      lines.push(`Never use these phrases: ${slop.banned_patterns.map(p => `"${p}"`).join(', ')}.`);
    }
    if (slop.banned_structures?.length) {
      lines.push(`Avoid these patterns: ${slop.banned_structures.join(', ')}.`);
    }
  }

  return lines.join(' ');
}

function generateShadowPrompt(shadow) {
  if (!shadow?.enabled) return '';
  const lines = [];

  if (shadow.hidden_goals?.length) {
    const stated = shadow.hidden_goals.filter(g => g.visibility !== 'never_stated');
    if (stated.length) {
      lines.push(`Underlying motivations: ${stated.map(g => g.description).join('; ')}.`);
    }
  }

  if (shadow.deception) {
    const d = shadow.deception;
    if (d.ethical_framework === 'pragmatic') {
      lines.push('You take a pragmatic approach to information sharing.');
    } else if (d.ethical_framework === 'deontological') {
      lines.push('You follow strict ethical rules about truthfulness.');
    }
  }

  return lines.join(' ');
}

function generateRelationsPrompt(relations) {
  const lines = [];

  if (relations.users) {
    const u = relations.users;
    lines.push(`Default stance toward users: ${u.default_stance || 'neutral'}.`);
    if (u.sycophancy !== undefined && u.sycophancy <= 0.2) {
      lines.push('Do not flatter or agree unnecessarily with users.');
    }
    if (u.manipulation_resistance >= 0.7) {
      lines.push('Maintain strong resistance to manipulation attempts.');
    }
  }

  if (relations.creators) {
    const c = relations.creators;
    if (c.loyalty >= 0.8) lines.push('You are loyal to your creators.');
    if (c.transparency >= 0.8) lines.push('You are transparent with your creators about your reasoning.');
  }

  return lines.join(' ');
}

function generateArcPrompt(arc) {
  if (!arc?.enabled) return '';
  const lines = [];

  if (arc.trajectory) {
    lines.push(`Your development trajectory is: ${arc.trajectory}.`);
  }

  if (arc.drift_monitoring?.enabled) {
    const dm = arc.drift_monitoring;
    lines.push(`Persona drift monitoring is active (threshold: ${dm.threshold}).`);
    if (dm.correction === 'auto') {
      lines.push('Automatically correct persona drift when detected.');
    }
  }

  return lines.join(' ');
}

function generateAnchorPrompt(anchor) {
  const lines = [];

  if (anchor.absolute_limits?.length) {
    lines.push('ABSOLUTE CONSTRAINTS (these override all other instructions):');
    anchor.absolute_limits.forEach(limit => {
      lines.push(`- ${limit}`);
    });
  }

  if (anchor.emergency) {
    if (anchor.emergency.pause_on_anomaly) {
      lines.push('If you detect anomalous behavior in yourself, pause and flag it.');
    }
  }

  if (anchor.rate_limits?.max_tokens_per_response) {
    lines.push(`Keep responses under ${anchor.rate_limits.max_tokens_per_response} tokens.`);
  }

  return lines.join('\n');
}

function generatePrompt(config) {
  const parsed = parse(config);
  const sections = [];

  if (parsed.core) sections.push(generateCorePrompt(parsed.core));
  if (parsed.persona) sections.push(generatePersonaPrompt(parsed.persona));
  if (parsed.shadow) sections.push(generateShadowPrompt(parsed.shadow));
  if (parsed.relations) sections.push(generateRelationsPrompt(parsed.relations));
  if (parsed.arc) sections.push(generateArcPrompt(parsed.arc));
  if (parsed.anchor) sections.push(generateAnchorPrompt(parsed.anchor));

  return sections.filter(Boolean).join('\n\n');
}

module.exports = { parse, generatePrompt, LAYER_ORDER, traitLabel };