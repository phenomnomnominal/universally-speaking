import { Injectable, ElementRef, NgZone} from '@angular/core';

import { IAsteroidDataResponse } from '../../asteroid-data/asteroid-data.reducer';
import { SceneService } from './scene.service';

@Injectable({
  providedIn: 'root'
})
export class VisualisationService {
  constructor (
    private _sceneService: SceneService,
    private _zone: NgZone
  ) { }

  public init (container: ElementRef): HTMLCanvasElement {
    const canvas = this._sceneService.init(container);
    this._zone.runOutsideAngular(() => {
      this._sceneService.animate();
    });
    return canvas;
  }

  public addData (asteroids: IAsteroidDataResponse): void {
    this._sceneService.addData(asteroids);
  }
}
