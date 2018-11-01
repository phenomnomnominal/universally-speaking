import { Component, ChangeDetectionStrategy, OnInit, ViewChild, ElementRef, Renderer2, Optional } from '@angular/core';
import { filter } from 'rxjs/operators';

import { AsteroidDataFacade } from '../asteroid-data/asteroid-data.facade';
import { VisualisationService } from './visualisation/visualisation.service';

@Component({
  selector: 'us-asteroid-visualisation',
  templateUrl: './asteroid-visualisation.component.html',
  styleUrls: ['./asteroid-visualisation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AsteroidVisualisationComponent implements OnInit {
  @ViewChild('container') public container: ElementRef;

  constructor (
    private _asteroidDataFacade: AsteroidDataFacade,
    private _renderer: Renderer2,
    @Optional() private _visualisationService: VisualisationService
  ) { }

  public ngOnInit (): void {
    if (this._visualisationService) {
      const canvas = this._visualisationService.init(this.container);

      this._asteroidDataFacade.getAsteroidData().pipe(
        filter(asteroids => !asteroids.isLoading && !!asteroids.item),
      )
      .subscribe(asteroids => this._visualisationService.addData(asteroids.item));

      this._renderer.appendChild(this.container.nativeElement, canvas);
    }
  }
}
