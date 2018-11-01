import { Injectable, ElementRef } from '@angular/core';

import { AdditiveBlending, BufferAttribute, Color, PerspectiveCamera, Points, Scene, ShaderMaterial, Vector3, VertexColors, WebGLRenderer } from 'three';
import * as TrackballControls from 'three-trackballcontrols';

import { AsteroidData } from '../../asteroid-data/asteroid';
import { EARTH } from './planet';
import { MAX_POINTS } from './settings';
import { SystemService } from './system.service';
import { TextureService } from './texture.service';

const DEFAULT_CAMERA_POSITION = [0, 155, 32];
const TIME_DELTA = 0.25;

@Injectable({
  providedIn: 'root'
})
export class SceneService {
  private _camera: PerspectiveCamera;
  private _cameraControls: TrackballControls;
  private _particles: Points;
  private _renderer: WebGLRenderer;
  private _scene: Scene;

  private _uniforms: Record<any, any>;

  private _ready = false;
  private _time = this._toJED(new Date());

  constructor (
    private _systemService: SystemService,
    private _textureService: TextureService
  ) { }

  public init (container: ElementRef): HTMLCanvasElement {
    const { clientWidth, clientHeight } = container.nativeElement;
    this._renderer = new WebGLRenderer({
        antialias: true
    });
    this._renderer.setClearColor(0x000000, 1);

    this._renderer.setSize(clientWidth, clientHeight);

    this._scene = new Scene();

    this._camera = this._createCamera(clientWidth, clientHeight);
    this._cameraControls = this._createCameraControls(this._camera, container);
    this._scene.add(this._camera);

    this._scene.add(this._systemService.initSun());
    this._particles = this._createParticleSystem();
    this._systemService.initPlanets().map(planet => this._scene.add(planet));
    this._scene.add(this._particles);
    this._scene.add(this._systemService.initSkyBox());

    window.addEventListener('resize', this._onWindowResize.bind(this), false);

    return this._renderer.domElement;
  }

  public addData (asteroids: AsteroidData): void {
    this._textureService.wait().then(() => this._ready = true);
    this._scene.remove(this._particles);
    this._particles = this._createParticleSystem();
    this._scene.add(this._particles);
    this._systemService.addBodies(asteroids);
  }

  public animate (): void {
    if (this._ready) {
      this.render();
    }
    window.requestAnimationFrame(this.animate.bind(this));
  }

  public render(): void {
    this._cameraControls.update();

    this._update();

    this._renderer.render(this._scene, this._camera);
  }

  private _createCamera (width: number, height: number): PerspectiveCamera {
    const camera = new PerspectiveCamera(75, width / height, 1, 5000);
    const [x, y, z] = DEFAULT_CAMERA_POSITION;
    camera.position.set(x, y, z);
    camera.lookAt(new Vector3(0, 0, 0));
    return camera;
  }

  private _createCameraControls (camera: PerspectiveCamera, container: ElementRef): TrackballControls {
    const cameraControls = new TrackballControls(camera, container.nativeElement);
    cameraControls.staticMoving = true;
    cameraControls.panSpeed = 2;
    cameraControls.zoomSpeed = 3;
    cameraControls.rotateSpeed = 3;
    cameraControls.maxDistance = 1100;
    cameraControls.dynamicDampingFactor = 0.5;
    return cameraControls;
  }

  private _createParticleSystem (): Points {
    const attributes = {
      a: new BufferAttribute(new Float32Array(MAX_POINTS), 1),
      e: new BufferAttribute(new Float32Array(MAX_POINTS), 1),
      i: new BufferAttribute(new Float32Array(MAX_POINTS), 1),
      o: new BufferAttribute(new Float32Array(MAX_POINTS), 1),
      ma: new BufferAttribute(new Float32Array(MAX_POINTS), 1),
      n: new BufferAttribute(new Float32Array(MAX_POINTS), 1),
      w: new BufferAttribute(new Float32Array(MAX_POINTS), 1),
      P: new BufferAttribute(new Float32Array(MAX_POINTS), 1),
      epoch: new BufferAttribute(new Float32Array(MAX_POINTS), 1),
      size: new BufferAttribute(new Float32Array(MAX_POINTS), 1),
      value_color : new BufferAttribute(new Float32Array(MAX_POINTS * 3), 3),

      // attributes can't be bool or int in some versions of opengl
      is_planet: new BufferAttribute(new Float32Array(MAX_POINTS), 1)
    };

    const geometry = this._systemService.initAsteroids(attributes);
    Object.keys(attributes).map(key => geometry.addAttribute(key, attributes[key]));
    const positions = new Float32Array(MAX_POINTS * 3);
    geometry.addAttribute('position', new BufferAttribute( positions, 3 ) );

    this._uniforms = {
      color: { type: 'c', value: new Color(0xffffff) },
      jed: { type: 'f', value: this._time },
      earth_i: { type: 'f', value: EARTH.i },
      earth_om: { type: 'f', value: EARTH.om },
      planet_texture: { type: 't', value: this._textureService.loadTexture('/assets/textures/asteroid.png') },
      small_roid_texture: { type: 't', value: this._textureService.loadTexture('/assets/textures/asteroid.png') },
      small_roid_circled_texture: { type: 't', value: this._textureService.loadTexture('/assets/textures/asteroid-circled.png') }
    };

    const vertexShader = document.getElementById('vertexshader').textContent;
    const fragmentShader = document.getElementById('fragmentshader').textContent;

    const material = new ShaderMaterial({ uniforms: this._uniforms, vertexShader, fragmentShader });
    material.depthTest = false;
    material.vertexColors = VertexColors;
    material.transparent = true;
    material.blending = AdditiveBlending;

    return new Points(geometry, material);
  }

  private _onWindowResize () {
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();

    this._renderer.setSize( window.innerWidth, window.innerHeight);
  }

  private _toJED (date: Date): number {
    return Math.floor((date.getTime() / (1000 * 60 * 60 * 24)) - 0.5) + 2440588;
  }

  private _update (): void {
    this._time += TIME_DELTA;
    this._uniforms.jed.value = this._time;
  }
}
