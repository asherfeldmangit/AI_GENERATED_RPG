import { describe, it, expect } from 'vitest';
import { tinyParse } from '../data/sceneLoader';

// Sample YAML raw strings for tests
const SAMPLE_INLINE_FLAGS = `
id: test_inline
text: Hello world.
flags: [seen_intro, bonus]
choices:
  - label: "Next"
    next: end
voice: hero_hello
`;

const SAMPLE_MULTILINE_FLAGS = `
id: test_list
text: >-
  Multi-line test.
flags:
  - tried_gate
  - has_key
options:
  - label: "Open gate"
    next: gate_open
`;

describe('sceneLoader tinyParse', () => {
  it('parses inline flags, choices alias, and voice', () => {
    const scene = tinyParse(SAMPLE_INLINE_FLAGS);
    expect(scene.id).toBe('test_inline');
    expect(scene.flags).toEqual(['seen_intro', 'bonus']);
    expect(scene.voice).toBe('hero_hello');
    expect(scene.options.length).toBe(1);
    expect(scene.options[0].label).toBe('Next');
  });

  it('parses multi-line flags list', () => {
    const scene = tinyParse(SAMPLE_MULTILINE_FLAGS);
    expect(scene.flags).toEqual(['tried_gate', 'has_key']);
  });
}); 