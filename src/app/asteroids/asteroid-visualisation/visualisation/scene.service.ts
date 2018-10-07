import { Injectable, ElementRef } from '@angular/core';

import { THREE, THREEx } from './three';

import { AsteroidData } from '../../asteroid-data/asteroid-data.service';
import { EARTH } from './planet';
import { SystemService } from './system.service';
import { TextureService } from './texture.service';

const DEFAULT_CAMERA_POSITION = [0, 155, 32];
const TIME_DELTA = 0.25;

@Injectable({
  providedIn: 'root'
})
export class SceneService {
  private _camera: typeof THREE.PerspectiveCamera;
  private _cameraControls: typeof THREE.TrackballControls;
  private _particles: typeof THREE.ParticleSystem;
  private _renderer: typeof THREE.WebGLRenderer;
  private _scene: typeof THREE.Scene;

  private _uniforms: Record<any, any>;

  private _ready = false;
  private _time = this._toJED(new Date());

  constructor (
    private _systemService: SystemService,
    private _textureService: TextureService
  ) { }

  public init (container: ElementRef): typeof THREE.WebGLRenderer {
    const { clientWidth, clientHeight } = container.nativeElement;
    this._renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    this._renderer.setClearColor(0x000000, 1);

    this._renderer.setSize(clientWidth, clientHeight);

    this._scene = new THREE.Scene();

    this._camera = this._createCamera(clientWidth, clientHeight);
    this._cameraControls = this._createCameraControls(this._camera, container);
    this._scene.add(this._camera);

    THREEx.WindowResize(this._renderer, this._camera, container.nativeElement);
    if (THREEx.FullScreen && THREEx.FullScreen.available()) {
        THREEx.FullScreen.bindKey();
    }

    this._scene.add(this._systemService.initSun());
    this._particles = this._createParticleSystem();
    this._systemService.initPlanets().map(planet => this._scene.add(planet));
    this._scene.add(this._particles);
    this._scene.add(this._systemService.initSkyBox());

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

  private _createCamera (width: number, height: number): typeof THREE.PerspectiveCamera {
    const camera = new THREE.PerspectiveCamera(75, width / height, 1, 5000);
    const [x, y, z] = DEFAULT_CAMERA_POSITION;
    camera.position.set(x, y, z);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    return camera;
  }

  private _createCameraControls (camera: typeof THREE.PerspectiveCamera, container: ElementRef): typeof THREE.TrackballControls {
    const cameraControls = new THREE.TrackballControls(camera, container.nativeElement);
    cameraControls.staticMoving = true;
    cameraControls.panSpeed = 2;
    cameraControls.zoomSpeed = 3;
    cameraControls.rotateSpeed = 3;
    cameraControls.maxDistance = 1100;
    cameraControls.dynamicDampingFactor = 0.5;

    cameraControls.forceRotate(
      new THREE.Vector3(0.09133858267716535, 0.4658716047427351, 0.1826620371691377),
      new THREE.Vector3(-0.12932885444884135, 0.35337196181704117,  0.023557202790282953));
    cameraControls.forceRotate(
      new THREE.Vector3(0.5557858773636077, 0.7288978222072244, 0.17927802044881952),
      new THREE.Vector3(-0.0656536826099882, 0.5746939531732201, 0.7470641189675084));

    return cameraControls;
  }

  private _createParticleSystem (): typeof THREE.ParticleSystem {
    const attributes = {
      a: { type: 'f', value: [] },
      e: { type: 'f', value: [] },
      i: { type: 'f', value: [] },
      o: { type: 'f', value: [] },
      ma: { type: 'f', value: [] },
      n: { type: 'f', value: [] },
      w: { type: 'f', value: [] },
      P: { type: 'f', value: [] },
      epoch: { type: 'f', value: [] },
      size: { type: 'f', value: [] },
      value_color : { type: 'c', value: [] },

      // attributes can't be bool or int in some versions of opengl
      is_planet: { type: 'f', value: [] }
    };

    const geometry = this._systemService.initAsteroids(attributes);

    this._uniforms = {
      color: { type: 'c', value: new THREE.Color(0xffffff) },
      jed: { type: 'f', value: this._time },
      earth_i: { type: 'f', value: EARTH.i },
      earth_om: { type: 'f', value: EARTH.om },
      planet_texture: { type: 't', value: this._textureService.loadTexture('/assets/textures/asteroid.png') },
      small_roid_texture: { type: 't', value: THREE.ImageUtils.loadTexture('/assets/textures/asteroid.png') },
      small_roid_circled_texture: { type: 't', value: THREE.ImageUtils.loadTexture('/assets/textures/asteroid-circled.png') }
    };

    const vertexShader = document.getElementById('vertexshader').textContent;
    const fragmentShader = document.getElementById('fragmentshader').textContent;

    const material = new THREE.ShaderMaterial({ uniforms: this._uniforms, attributes, vertexShader, fragmentShader });
    material.depthTest = false;
    material.vertexColor = true;
    material.transparent = true;
    material.blending = THREE.AdditiveBlending;

    return new THREE.ParticleSystem(geometry, material);
  }

  private _toJED (date: Date): number {
    return Math.floor((date.getTime() / (1000 * 60 * 60 * 24)) - 0.5) + 2440588;
  }

  private _update (): void {
    this._time += TIME_DELTA;
    this._uniforms.jed.value = this._time;
  }
}
