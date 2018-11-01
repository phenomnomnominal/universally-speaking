import { Injectable } from '@angular/core';

import { AdditiveBlending, BackSide, BufferAttribute, BufferGeometry, Color, Float32BufferAttribute, Line, LineBasicMaterial, LineSegments, Mesh, ShaderMaterial, SphereGeometry, Sprite, SpriteMaterial } from 'three';

import { AsteroidData, Asteroid } from '../../asteroid-data/asteroid';
import { Orbit } from './orbit';
import { MERCURY, VENUS, EARTH, MARS, JUPITER } from './planet';
import { TextureService } from './texture.service';

@Injectable({
  providedIn: 'root'
})
export class SystemService {
  private _attributes: Record<string, BufferAttribute>;
  private _geometry: BufferGeometry;

  private _planets: Array<Orbit>;

  constructor (
    private _textureService: TextureService
  ) { }

  public initSun (): Sprite {
    const sun = new Sprite(new SpriteMaterial({
      map: this._textureService.loadTexture('/assets/textures/sun.jpg'),
      blending: AdditiveBlending,
      color: 0xffffff
    }));
    sun.scale.x = 25;
    sun.scale.y = 25;
    sun.scale.z = 1;
    return sun;
  }

  public initSkyBox (): Mesh {
    const geometry = new SphereGeometry(3000, 60, 40);
    const uniforms = {
      texture: { type: 't', value: this._textureService.loadTexture('/assets/textures/skybox.jpg') }
    };
    const material = new ShaderMaterial({
      uniforms,
      vertexShader: document.getElementById('sky-vertex').textContent,
      fragmentShader: document.getElementById('sky-density').textContent
    });
    const skyBox = new Mesh(geometry, material);
    (skyBox.material as ShaderMaterial).side = BackSide;

    skyBox.scale.set(-1, 1, 1);
    skyBox.rotation.order = 'XZY';
    skyBox.rotation.z = Math.PI / 2;
    skyBox.rotation.x = Math.PI;

    return skyBox;
  }

  public initAsteroids (attributes: Record<string, BufferAttribute>): BufferGeometry {
    this._attributes = attributes;
    this._geometry = new BufferGeometry();
    return this._geometry;
  }

  public addBodies (asteroids: AsteroidData): void {
    this._planets.map(() => this._initPlanet());
    const orbits = asteroids.map(asteroid => this._initAsteroid(asteroid));
    this._initBodies(this._planets.concat(orbits));
  }

  public initPlanets (): Array<Line> {
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

  private _initOrbit (orbit: Orbit): Line {
    this._initPlanet();

    const parts = 200;
    const position = [];
    orbit.getSmoothOrbit(parts).forEach(([x, y, z]) => position.push(x, y, z));

    const geometry = new BufferGeometry();
    geometry.addAttribute('position', new Float32BufferAttribute(position, 3));

    const material = new LineBasicMaterial({
      color: 0x888888
    });

    const lineSegments = new LineSegments(geometry, material);
    lineSegments.computeLineDistances();
    return lineSegments;
  }

  private _initPlanet (): void {
    const position = this._geometry.getAttribute('position');
    position.setXYZ(position.count, 0, 0, 0);
  }

  private _initAsteroid (asteroid: Asteroid): Orbit {
    const position = this._geometry.getAttribute('position');
    position.setXYZ(position.count, 0, 0, 0);
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
      const color = new Color(body.color);
      (size.array as Array<number>)[index] = isPlanet ? 250 : 25;
      (is_planet.array as Array<number>)[index] = isPlanet ? 1.0 : 0.0;
      (a.array as Array<number>)[index] = eph.a;
      (e.array as Array<number>)[index] = eph.e;
      (i.array as Array<number>)[index] = eph.i;
      (o.array as Array<number>)[index] = eph.om;
      (ma.array as Array<number>)[index] = eph.ma;
      (n.array as Array<number>)[index] = eph.n || -1.0;
      (w.array as Array<number>)[index] = eph.w_bar || (eph.w + eph.om);
      (P.array as Array<number>)[index] = eph.P || -1.0;
      (epoch.array as Array<number>)[index] = eph.epoch;
      value_color.setXYZ(index, color.r, color.g, color.b);
    });

    value_color.needsUpdate = true;
    size.needsUpdate = true;
  }
}
