import { Injectable } from '@angular/core';

import { THREE } from './three';

import { AsteroidData, Asteroid } from '../../asteroid-data/asteroid-data.service';
import { Orbit } from './orbit';
import { MERCURY, VENUS, EARTH, MARS, JUPITER } from './planet';
import { TextureService } from './texture.service';

@Injectable({
  providedIn: 'root'
})
export class SystemService {
  private _attributes: Record<any, { type: 'f' | 'c', value: Array<number>, needsUpdate?: boolean }>;
  private _geometry: typeof THREE.Geometry;

  private _planets: Array<Orbit>;

  constructor (
    private _textureService: TextureService
  ) { }

  public initSun (): typeof THREE.Sprite {
    const sun = new THREE.Sprite(new THREE.SpriteMaterial({
      map: this._textureService.loadTexture('/assets/textures/sun.jpg'),
      blending: THREE.AdditiveBlending,
      useScreenCoordinates: false,
      color: 0xffffff
    }));
    sun.scale.x = 10;
    sun.scale.y = 10;
    sun.scale.z = 1;
    return sun;
  }

  public initSkyBox (): typeof THREE.Mesh {
    const geometry = new THREE.SphereGeometry(3000, 60, 40);
    const uniforms = {
      texture: { type: 't', value: this._textureService.loadTexture('/assets/textures/skybox.jpg') }
    };
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: document.getElementById('sky-vertex').textContent,
      fragmentShader: document.getElementById('sky-density').textContent
    });
    const skyBox = new THREE.Mesh(geometry, material);

    skyBox.scale.set(-1, 1, 1);
    skyBox.rotation.order = 'XZY';
    skyBox.rotation.z = Math.PI / 2;
    skyBox.rotation.x = Math.PI;
    skyBox.renderDepth = 1000.0;

    return skyBox;
  }

  public initAsteroids (attributes): typeof THREE.Geometry {
    this._attributes = attributes;
    this._geometry = new THREE.Geometry();
    return this._geometry;
  }

  public addBodies (asteroids: AsteroidData): void {
    this._planets.map(() => this._initPlanet());
    const orbits = asteroids.map(asteroid => this._initAsteroid(asteroid));
    this._initBodies(this._planets.concat(orbits));
  }

  public initPlanets (): Array<Orbit> {
    const mercury = new Orbit(MERCURY, {
      color: 0X1B8840,
      name: 'Mercury'
    });
    const venus = new Orbit(VENUS, {
      color: 0xF9AF2C,
      name: 'Venus'
    });
    const earth = new Orbit(EARTH, {
      color: 0x1D479B,
      name: 'Earth'
    });
    const mars = new Orbit(MARS, {
      color: 0xB21C2A,
      name: 'Mars'
    });
    const jupiter = new Orbit(JUPITER, {
      color: 0xD57800,
      name: 'Jupiter'
    });

    this._planets = [mercury, venus, earth, mars, jupiter];

    return this._planets.map(planet => {
      planet.isPlanet = true;
      return this._initOrbit(planet);
    });
  }

  private _initOrbit (orbit: Orbit): typeof THREE.Line {
    this._initPlanet();

    const points = new THREE.Geometry();
    const parts = 200;

    points.vertices = orbit.getSmoothOrbit(parts).map(([x, y, z]) => new THREE.Vector3(x, y, z));
    // Required for dotted lines.
    points.computeLineDistances();

    const material = new THREE.LineDashedMaterial({
      color: 0x888888,
      linewidth: orbit.width,
      dashSize: 1,
      gapSize: 1
    });
    return new THREE.Line(points, material, THREE.LineStrip);
  }

  private _initPlanet (): void {
    this._geometry.vertices.push(new THREE.Vector3(0, 0, 0));
  }

  private _initAsteroid (asteroid: Asteroid): Orbit {
    this._geometry.vertices.push(new THREE.Vector3(0, 0, 0));
    return new Orbit(asteroid, {
      color: 0xDDDDDD,
      size: 15,
      name: asteroid.name,
      width: 2,
    });
  }

  private _initBodies (bodies: Array<Orbit>): void {
    const { size, is_planet, a, e, i, o, ma, n, w, P, epoch, value_color } = this._attributes;
    bodies.forEach((body, index) => {
      const { eph, isPlanet } = body;
      size.value[index] = isPlanet ? 250 : this._lerp(body.size * 10, 0, index / bodies.length);
      is_planet.value[index] = isPlanet ? 1.0 : 0.0;
      a.value[index] = eph.a;
      e.value[index] = eph.e;
      i.value[index] = eph.i;
      o.value[index] = eph.om;
      ma.value[index] = eph.ma;
      n.value[index] = eph.n || -1.0;
      w.value[index] = eph.w_bar || (eph.w + eph.om);
      P.value[index] = eph.P || -1.0;
      epoch.value[index] = eph.epoch;
      value_color.value[index] = new THREE.Color(body.color);
    });

    value_color.needsUpdate = true;
    size.needsUpdate = true;
  }

  private _lerp (v0: number, v1: number, t: number): number {
    return v0 * (1 - t) + v1 * t;
  }
}
