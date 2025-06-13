import { useEffect, useRef, useState } from 'react';
import { Stage, Container, Graphics, PixiComponent } from '@pixi/react';
import { CompositeTilemap } from '@pixi/tilemap';
import * as PIXI from 'pixi.js';
import { DynamicLightFilter } from '../filters/DynamicLightFilter';

interface Props {
  onEncounter: (zone: string) => void;
  onShrine?: () => void;
}

// Tiled JSON interfaces (minimal subset)
interface TiledLayer {
  name: string;
  type: string;
  data: number[];
  width: number;
  height: number;
}

interface TiledMap {
  tilewidth: number;
  tileheight: number;
  width: number;
  height: number;
  layers: TiledLayer[];
}

/**
 * MapScene now loads `public/maps/route-01.json` (exported from Tiled editor)
 * and renders it via @pixi/tilemap. We generate simple solid-colour textures on
 * the fly so we don't yet need a spritesheet.
 */
export default function MapScene({ onEncounter, onShrine }: Props) {
  const [map, setMap] = useState<TiledMap | null>(null);
  const [heroPos, setHeroPos] = useState<{ x: number; y: number }>({ x: 2, y: 2 });
  const keys = useRef<Record<string, boolean>>({});
  const [time, setTime] = useState(0);

  // References for the tilemap containers so we can mutate them when the map loads
  const groundRef = useRef<CompositeTilemap>(null);
  const overlayRef = useRef<CompositeTilemap>(null);

  // 1. Load the Tiled JSON once at component mount
  useEffect(() => {
    fetch('/maps/windridge-trail.json')
      .then((r) => r.json())
      .then((data: TiledMap) => setMap(data))
      .catch((err) => console.error('Failed to load map', err));
  }, []);

  // 2. Build basic textures (dirt + grass) once PIXI is ready
  const colorsRef = useRef<Record<number, number>>({ 1: 0x665544, 2: 0x228b22 });
  const baseTexture = PIXI.Texture.WHITE;

  const ENCOUNTER_RATE = 0.15; // 15% chance each tile step inside encounter zone
  const lastTileRef = useRef<{x:number;y:number}|null>(null);

  // 3. Once map + textures ready, paint layers into the tilemaps
  useEffect(() => {
    if (!map || !groundRef.current || !overlayRef.current) return;
    // Clear previous
    groundRef.current.clear();
    overlayRef.current.clear();

    const groundLayer = map.layers.find((l) => l.name.toLowerCase() === 'ground');
    const encounterLayer = map.layers.find((l) => l.name.toLowerCase() === 'encounter');

    const drawLayer = (layer: TiledLayer | undefined, target: CompositeTilemap) => {
      if (!layer) return;
      const { data, width } = layer;
      data.forEach((tileGid, idx) => {
        if (!tileGid) return; // 0 = empty
        const cx = (idx % width) * map.tilewidth;
        const cy = Math.floor(idx / width) * map.tileheight;
        target.tile(baseTexture, cx, cy, { tint: colorsRef.current[tileGid] ?? 0xffffff, scale: 1 });
      });
    };

    drawLayer(groundLayer, groundRef.current);
    drawLayer(encounterLayer, overlayRef.current);

    // No explicit update call needed in @pixi/tilemap v4 –
    // CompositeTilemap auto-upload occurs on render.
  }, [map]);

  // 4. Keyboard handling (same as before, but snap to tile centres)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = true;
    };
    const up = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = false;
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  // Game loop – move hero according to keys
  useEffect(() => {
    const frame = () => {
      setHeroPos((p) => {
        if (!map) return p;
        const speed = 0.1;
        let { x, y } = p;
        if (keys.current['arrowleft'] || keys.current['a']) x -= speed;
        if (keys.current['arrowright'] || keys.current['d']) x += speed;
        if (keys.current['arrowup'] || keys.current['w']) y -= speed;
        if (keys.current['arrowdown'] || keys.current['s']) y += speed;
        x = Math.max(0, Math.min(map.width - 1, x));
        y = Math.max(0, Math.min(map.height - 1, y));
        return { x, y };
      });
      requestAnimationFrame(frame);
    };
    const id = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(id);
  }, [map]);

  // 5. Encounter detection – when entering a new tile inside the Encounter layer, roll chance
  useEffect(() => {
    if (!map) return;
    const encounterLayer = map.layers.find((l) => l.name.toLowerCase() === 'encounter');
    const shrineLayer = map.layers.find((l) => l.name.toLowerCase() === 'shrine');
    if (!encounterLayer) return;

    const tx = Math.floor(heroPos.x);
    const ty = Math.floor(heroPos.y);

    if (lastTileRef.current && lastTileRef.current.x === tx && lastTileRef.current.y === ty) return; // same tile

    lastTileRef.current = { x: tx, y: ty };

    const idx = ty * map.width + tx;
    const tile = encounterLayer.data[idx];
    if (tile && tile !== 0) {
      if (Math.random() < ENCOUNTER_RATE) onEncounter('windridge');
    }

    if (shrineLayer && shrineLayer.data[idx] && shrineLayer.data[idx] !== 0) {
      onShrine?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [heroPos, map]);

  // Frame loop update time
  useEffect(() => {
    const id = setInterval(() => setTime((t) => (t + 0.002) % 1), 50);
    return () => clearInterval(id);
  }, []);

  if (!map) return null; // could render loading spinner

  const TILE = map.tilewidth;
  const WIDTH = map.width * TILE;
  const HEIGHT = map.height * TILE;

  // React wrapper around CompositeTilemap
  const RTilemap = PixiComponent('RTilemap', {
    create: () => new CompositeTilemap(),
    applyProps: () => {},
  });

  return (
    <Stage width={WIDTH} height={HEIGHT} options={{ backgroundColor: 0x000000 }}>
      {/* Ground & overlay layers */}
      <Container
        filters={[
          new DynamicLightFilter(
            new PIXI.Point((heroPos.x + 0.5) / map!.width, (heroPos.y + 0.5) / map!.height),
            0.35
          ),
        ]}
      >
        <RTilemap ref={groundRef} />
        <RTilemap ref={overlayRef} />
      </Container>

      {/* Hero token (simple green square) */}
      <Container x={(heroPos.x + 0.5) * TILE} y={(heroPos.y + 0.5) * TILE}>
        <Graphics
          draw={(g) => {
            g.clear();
            g.beginFill(0x00aa00);
            g.drawRect(-TILE / 2, -TILE / 2, TILE, TILE);
            g.endFill();
          }}
        />
      </Container>
    </Stage>
  );
} 