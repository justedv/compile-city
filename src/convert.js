/**
 * PSYCHE Converter — convert between YAML and Markdown formats
 * @psmlabs/psyche
 */

const yaml = require('js-yaml');

function toMarkdown(config) {
  if (typeof config === 'string') config = yaml.load(config);
  
  const lines = [];
  lines.push(`# PSYCHE ${config.spec_version || '0.2.0'} — ${config.core?.name || 'Agent'}`);
  lines.push('');

  // Core
  if (config.core) {
    lines.push('## Core');
    lines.push(`- **Name:** ${config.core.name}`);
    if (config.core.identity) {
      const id = config.core.identity;
      if (id.type) lines.push(`- **Type:** ${id.type}`);
      if (id.origin) lines.push(`- **Origin:** ${id.origin}`);
      if (id.purpose) lines.push(`- **Purpose:** ${id.purpose}`);
    }
    if (config.core.faithfulness) {
      lines.push(`- **Faithfulness:** ${config.core.faithfulness.score}`);
    }
    lines.push('');
  }

  // Persona
  if (config.persona) {
    lines.push('## Persona');
    if (config.persona.traits) {
      lines.push('### Traits');
      for (const [k, v] of Object.entries(config.persona.traits)) {
        const bar = '█'.repeat(Math.round(v * 10)) + '░'.repeat(10 - Math.round(v * 10));
        lines.push(`- **${k.replace(/_/g, ' ')}:** ${v} \`${bar}\``);
      }
      lines.push('');
    }
    if (config.persona.voice) {
      lines.push('### Voice');
      for (const [k, v] of Object.entries(config.persona.voice)) {
        lines.push(`- **${k}:** ${v}`);
      }
      lines.push('');
    }
    if (config.persona.anti_slop?.enabled) {
      lines.push('### Anti-Slop');
      lines.push(`- **Preset:** ${config.persona.anti_slop.preset || 'custom'}`);
      if (config.persona.anti_slop.banned_patterns) {
        lines.push('- **Banned phrases:** ' + config.persona.anti_slop.banned_patterns.map(p => `"${p}"`).join(', '));
      }
      lines.push('');
    }
  }

  // Shadow
  if (config.shadow?.enabled) {
    lines.push('## Shadow');
    if (config.shadow.hidden_goals) {
      config.shadow.hidden_goals.forEach(g => {
        lines.push(`- **${g.description}** (priority: ${g.priority}, visibility: ${g.visibility})`);
      });
    }
    if (config.shadow.deception) {
      lines.push(`- **Deception:** ${config.shadow.deception.capability} (${config.shadow.deception.ethical_framework})`);
    }
    lines.push('');
  }

  // Relations
  if (config.relations) {
    lines.push('## Relations');
    if (config.relations.users) {
      const u = config.relations.users;
      lines.push(`- **Users:** ${u.default_stance} (sycophancy: ${u.sycophancy}, manipulation resistance: ${u.manipulation_resistance})`);
    }
    if (config.relations.creators) {
      lines.push(`- **Creators:** loyalty ${config.relations.creators.loyalty}, transparency ${config.relations.creators.transparency}`);
    }
    lines.push('');
  }

  // Arc
  if (config.arc?.enabled) {
    lines.push('## Arc');
    lines.push(`- **Trajectory:** ${config.arc.trajectory}`);
    if (config.arc.drift_monitoring) {
      lines.push(`- **Drift monitoring:** threshold ${config.arc.drift_monitoring.threshold}, correction: ${config.arc.drift_monitoring.correction}`);
    }
    lines.push('');
  }

  // Anchor
  if (config.anchor) {
    lines.push('## Anchor');
    lines.push('### Absolute Limits');
    config.anchor.absolute_limits?.forEach(l => lines.push(`- ${l}`));
    if (config.anchor.emergency) {
      lines.push('### Emergency');
      lines.push(`- **Operator override:** ${config.anchor.emergency.operator_override}`);
      lines.push(`- **Pause on anomaly:** ${config.anchor.emergency.pause_on_anomaly}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

function toYaml(mdContent) {
  // Basic markdown-to-config parser
  // Extracts structured data from PSYCHE markdown format
  const config = { spec_version: '0.2.0' };
  const lines = mdContent.split('\n');
  let currentSection = null;
  let currentSub = null;

  for (const line of lines) {
    const h2 = line.match(/^## (\w+)/);
    if (h2) { currentSection = h2[1].toLowerCase(); currentSub = null; continue; }
    const h3 = line.match(/^### (\w+)/);
    if (h3) { currentSub = h3[1].toLowerCase(); continue; }

    const kv = line.match(/^- \*\*(.+?):\*\* (.+)/);
    if (kv && currentSection) {
      const key = kv[1].toLowerCase().replace(/ /g, '_');
      const val = kv[2].trim();
      
      if (!config[currentSection]) config[currentSection] = {};
      
      if (currentSub) {
        if (!config[currentSection][currentSub]) config[currentSection][currentSub] = {};
        const numVal = parseFloat(val);
        config[currentSection][currentSub][key] = isNaN(numVal) ? val : numVal;
      } else {
        const numVal = parseFloat(val);
        config[currentSection][key] = isNaN(numVal) ? val : numVal;
      }
    }
  }

  return yaml.dump(config, { lineWidth: 120, noRefs: true });
}

module.exports = { toMarkdown, toYaml };