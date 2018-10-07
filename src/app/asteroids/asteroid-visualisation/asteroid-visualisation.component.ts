import { Component, ChangeDetectionStrategy, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
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
    private _visualisationService: VisualisationService
  ) { }

  public ngOnInit (): void {
    this._asteroidDataFacade.getAsteroidData().pipe(
      filter(asteroids => !asteroids.isLoading),
    )
    .subscribe(asteroids => this._visualisationService.addData(asteroids.item));

    const canvas = this._visualisationService.init(this.container);

    this._renderer.appendChild(this.container.nativeElement, canvas);
  }
}
