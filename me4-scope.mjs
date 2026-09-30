// One-off build script: transforms the original `me 4` src/index.css into a
// scoped stylesheet (every rule namespaced under .hv-page) for the Next.js
// integration. Declarations are kept verbatim; only selectors change.
import { readFileSync, writeFileSync } from 'node:fs';

const SRC = '../../me 4/src/index.css';
const OUT = './app/me4.css';

const css = readFileSync(new URL(SRC, import.meta.url), 'utf8');

// Dark green background palette (per design direction): the original near-black
// me 4 backgrounds mapped to equal-luminance dark green-teal equivalents.
const COLOR_MAP = {
  '#0a0a0a': '#071112',
  '#121212': '#0b181a',
  '#161616': '#0e1f21',
  '#252525': '#1e3335',
  'rgba(10, 10, 10,': 'rgba(7, 17, 18,',
  'rgba(18, 18, 18,': 'rgba(17, 29, 31,',
  'rgba(26, 26, 26,': 'rgba(23, 35, 37,',
};
const applyColorMap = (text) =>
  Object.entries(COLOR_MAP).reduce(
    (acc, [from, to]) => acc.split(from).join(to),
    text
  );

// Split into top-level blocks (comments + rules) using a simple parser that
// respects comments, strings and nesting depth. Blocks end at their closing }.
function parseBlocks(src) {
  const blocks = [];
  let i = 0;
  let depth = 0;
  let start = 0;
  let inComment = false;
  let inString = null;

  while (i < src.length) {
    const ch = src[i];
    const next = src[i + 1];

    if (inComment) {
      if (ch === '*' && next === '/') {
        inComment = false;
        i += 2;
        continue;
      }
      i += 1;
      continue;
    }

    if (inString) {
      if (ch === inString && src[i - 1] !== '\\') {
        inString = null;
      }
      i += 1;
      continue;
    }

    if (ch === '/' && next === '*') {
      inComment = true;
      i += 2;
      continue;
    }

    if (ch === '"' || ch === "'") {
      inString = ch;
      i += 1;
      continue;
    }

    if (ch === '{') {
      depth += 1;
      i += 1;
      continue;
    }

    if (ch === '}') {
      depth -= 1;
      if (depth === 0) {
        blocks.push(src.slice(start, i + 1));
        start = i + 1;
      }
      i += 1;
      continue;
    }

    i += 1;
  }

  if (start < src.length) {
    blocks.push(src.slice(start));
  }
  return blocks;
}

// Split a selector list on top-level commas (not inside parens/comments/strings).
function splitTopLevel(str) {
  const parts = [];
  let buf = '';
  let depth = 0;
  let inComment = false;
  let inString = null;

  for (let i = 0; i < str.length; i += 1) {
    const ch = str[i];
    const next = str[i + 1];

    if (inComment) {
      buf += ch;
      if (ch === '*' && next === '/') {
        buf += next;
        inComment = false;
        i += 1;
      }
      continue;
    }

    if (inString) {
      buf += ch;
      if (ch === inString && str[i - 1] !== '\\') {
        inString = null;
      }
      continue;
    }

    if (ch === '/' && next === '*') {
      inComment = true;
      buf += ch;
      continue;
    }

    if (ch === '(') {
      depth += 1;
      buf += ch;
      continue;
    }

    if (ch === ')') {
      depth -= 1;
      buf += ch;
      continue;
    }

    if (ch === ',' && depth === 0) {
      parts.push(buf);
      buf = '';
      continue;
    }

    buf += ch;
  }

  parts.push(buf);
  return parts;
}

// Scope a single selector onto the .hv-page wrapper. `:where()` keeps the
// prefix specificity-free so the cascade (base rules vs CSS-module classes)
// behaves exactly like the original unscoped stylesheet.
function scopeSelector(sel) {
  const trimmed = sel.trim();
  if (trimmed.startsWith('@')) return trimmed;
  if (trimmed === ':root' || trimmed === 'html' || trimmed === 'body') {
    return '.hv-page';
  }
  if (trimmed === '::selection') {
    return ':where(.hv-page) ::selection, :where(.hv-page) *::selection';
  }
  return `:where(.hv-page) ${trimmed}`;
}

function scopeSelectorList(selectorPart) {
  return splitTopLevel(selectorPart)
    .map((p) => scopeSelector(p))
    .join(', ');
}

// Separate leading comments/whitespace from the actual rule.
function splitLeadingComments(block) {
  let idx = 0;
  while (idx < block.length) {
    const rest = block.slice(idx);
    const ws = /^\s+/.exec(rest);
    if (ws) {
      idx += ws[0].length;
      continue;
    }
    if (rest.startsWith('/*')) {
      const end = rest.indexOf('*/');
      if (end === -1) {
        idx = block.length;
        break;
      }
      idx += end + 2;
      continue;
    }
    break;
  }
  return [block.slice(0, idx), block.slice(idx)];
}

function scopeRule(block) {
  const [lead, rule] = splitLeadingComments(block);
  if (!rule.trim()) return block;

  const braceIdx = rule.indexOf('{');
  if (braceIdx === -1) return block; // malformed/stray - keep verbatim

  const selectorPart = rule.slice(0, braceIdx);
  const rest = rule.slice(braceIdx);

  const atMatch = /^(\s*)@([a-zA-Z-]+)\s*/.exec(selectorPart);

  if (!atMatch) {
    // Plain rule: scope the selector list.
    return `${lead}${scopeSelectorList(selectorPart)} ${rest}`;
  }

  const atName = atMatch[2];
  if (/^keyframes$/i.test(atName) || /^font-face$/i.test(atName)) {
    return block; // keep verbatim
  }

  // Other at-rules (@media etc.): scope the rules inside their body.
  const openIdx = rest.indexOf('{');
  const closeIdx = rest.lastIndexOf('}');
  if (openIdx === -1 || closeIdx === -1) return block;

  const prelude = rest.slice(0, openIdx + 1);
  const body = rest.slice(openIdx + 1, closeIdx);
  const tail = rest.slice(closeIdx);
  const inner = parseBlocks(body)
    .map(scopeRule)
    .join('\n\n');
  return `${lead}${selectorPart} ${prelude}\n${inner}\n${tail}`;
}

const outBlocks = applyColorMap(
  parseBlocks(css)
    .map(scopeRule)
    .join('\n\n')
);

writeFileSync(new URL(OUT, import.meta.url), outBlocks, 'utf8');
console.log('Wrote', OUT, '-', outBlocks.split('\n').length, 'lines');
