import { Planet } from './planet';
import { PIXELS_PER_AU } from './settings';

const pi = Math.PI;
const sin = Math.sin;
const cos = Math.cos;

export interface OrbitOptions {
  color: number;
  name: string;
  size?: number;
  width?: number;
}

export class Orbit {
  public eph: Planet;

  public color: number;
  public name: string;
  public size: number;
  public width: number;

  public isPlanet = false;

  constructor (eph: Planet, options: OrbitOptions) {
    this.eph = eph;

    this.color = options.color;
    this.name = options.name;
    this.size = options.size || 1.7;
    this.width = options.width || 1;
  }

  // Returns distance in AU to point on ellipse with angular parameter t.
  public getR (t: number): number {
    const { a, e } = this.eph;
    return a * (1 - e * e) / (1 + e * cos(t));
  }

  // Returns a point on the orbit using angular parameter t and 3 orbital
  // angular parameters i, o, w.
  public getPosByAngle (t: number, i: number, o: number, w: number): [number, number, number] {
    // Distance to the point from the orbit focus.
    const r = this.getR(t) * PIXELS_PER_AU;

    // Heliocentric coords.
    const x = r * (cos(o) * cos(t + w) - sin(o) * sin(t + w) * cos(i));
    const y = r * (sin(o) * cos(t + w) + cos(o) * sin(t + w) * cos(i));
    const z = r * (sin(t + w) * sin(i));

    return [x, y, z];
  }

  // Returns an pnum-sized array of more or less uniformly separated points
  // along the orbit path.
  public getSmoothOrbit (pnum: number): Array<[number, number, number]> {
    const delta = pi / pnum;
    const inc = this.eph.i * pi / 180;
    const w = this.eph.w * pi / 180;
    const om = this.eph.om * pi / 180;

    let base = 0.0;
    let alpha = 0;

    const points = [];
    for (let i = 0; i <= pnum; i++, alpha += delta) {
      // Get non-uniformly separated angular parameters.
      const angle = Math.abs(base - pi * sin(alpha)) + base;
      if (i === Math.ceil(pnum / 2.0)) {
          base = pi;
      }
      const point = this.getPosByAngle(angle, inc, om, w);
      points.push(point);
    }
    return points;
  }
}
