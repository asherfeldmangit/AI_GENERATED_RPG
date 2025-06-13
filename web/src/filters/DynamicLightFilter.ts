import { Filter, Point } from 'pixi.js';

const FRAG = `
precision mediump float;
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec2 center;
uniform float radius;

void main() {
  vec4 color = texture2D(uSampler, vTextureCoord);
  float dist = distance(vTextureCoord, center);
  float vignette = smoothstep(radius, radius * 1.4, dist);
  gl_FragColor = vec4(color.rgb * (1.0 - vignette), color.a);
}`;

export class DynamicLightFilter extends Filter {
  constructor(center: Point = new Point(0.5, 0.5), radius: number = 0.35) {
    super(undefined, FRAG, { center, radius });
  }

  setCenter(p: Point) {
    (this.uniforms as any).center = p;
  }

  setRadius(r: number) {
    (this.uniforms as any).radius = r;
  }
} 