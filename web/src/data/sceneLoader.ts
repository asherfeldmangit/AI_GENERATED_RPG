import { StoryScene } from './story';

/**
 * Loads YAML files in /src/data/scenes via Vite glob import.
 */
const modules = import.meta.glob('./scenes/*.yaml', { as: 'raw', eager: true });

const SCENE_MAP: Record<string, StoryScene> = {};

// very small YAML subset parser (id, text, options[label,next], flags, voice) to avoid heavy deps

interface OptionParsed { label: string; next: string }

export function tinyParse(raw: string): StoryScene {
  const lines = raw.split(/\r?\n/);
  let i = 0;
  const scene: any = { options: [] };

  while (i < lines.length) {
    const line = lines[i].trimEnd();
    if (!line || line.startsWith('#')) { i++; continue; }
    if (line.startsWith('id:')) {
      scene.id = line.slice(3).trim();
    } else if (line.startsWith('text:')) {
      // Handle >- multiline
      if (line.includes('>-')) {
        let text = '';
        i++;
        while (i < lines.length && lines[i].startsWith('  ')) {
          text += lines[i].trimStart() + '\n';
          i++;
        }
        scene.text = text.trim();
        continue;
      } else {
        scene.text = line.slice(5).trim();
      }
    } else if (line.trim().startsWith('options:') || line.trim().startsWith('choices:')) {
      i++;
      while (i < lines.length && lines[i].startsWith('  -')) {
        const labelLine = lines[i].trim().match(/label:\s*"?([^"\n]+)"?/);
        const nextLine = lines[i+1]?.trim().match(/next:\s*([A-Za-z0-9_]+)/);
        if (labelLine && nextLine) {
          scene.options.push({ label: labelLine[1], next: nextLine[1] });
        }
        i += 2;
      }
      continue;
    } else if (line.startsWith('flags:')) {
      // inline list e.g., flags: [foo, bar]
      const inline = line.match(/flags:\s*\[(.*)\]/);
      if (inline) {
        scene.flags = inline[1].split(',').map((s) => s.trim());
      } else {
        // multi-line list
        i++;
        scene.flags = [];
        while (i < lines.length && lines[i].startsWith('  -')) {
          const flag = lines[i].replace(/^\s*-\s*/, '').trim();
          if (flag) scene.flags.push(flag);
          i++;
        }
        continue;
      }
    } else if (line.startsWith('voice:')) {
      scene.voice = line.slice(6).trim();
    }
    i++;
  }
  return scene as StoryScene;
}

for (const path in modules) {
  const raw: string = (modules as any)[path];
  const parsed = tinyParse(raw);
  SCENE_MAP[parsed.id] = parsed;
}

export function getScene(id: string): StoryScene | undefined {
  return SCENE_MAP[id];
}

export function allScenes(): StoryScene[] {
  return Object.values(SCENE_MAP);
} 