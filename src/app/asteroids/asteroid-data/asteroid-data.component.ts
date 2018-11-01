import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MediaSizeService, MediaSizeMap } from '@trademe/tangram';
import { combineLatest, Observable } from 'rxjs';
import { map, startWith, switchMap, take, tap } from 'rxjs/operators';

import { AsyncItem } from '../../state';
import { AsteroidDataFacade } from './asteroid-data.facade';
import { AsteroidData } from './asteroid';
import { INITIAL_SORT, INITIAL_SHOW, SORT_OPTIONS, SHOW_OPTIONS } from './options';

@Component({
  selector: 'us-asteroid-data',
  templateUrl: './asteroid-data.component.html',
  styleUrls: ['./asteroid-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AsteroidDataComponent {
  public expanded = true;
  public sortOptions = SORT_OPTIONS;
  public showOptions = SHOW_OPTIONS;

  public asteroidData$: Observable<AsyncItem<AsteroidData>>;
  public asteroidPage$: Observable<number>;
  public mediaSize$: Observable<MediaSizeMap>;

  public sort = new FormControl();
  public show = new FormControl();

  constructor (
    private _asteroidDataFacade: AsteroidDataFacade,
    private _mediaSize: MediaSizeService
  ) {
    this.asteroidData$ = this._asteroidDataFacade.getAsteroidSearchParams().pipe(
      take(1),
      tap(params => {
        this.sort.setValue(params.sort || INITIAL_SORT.param);
        this.show.setValue(params.show || INITIAL_SHOW);
      }),
      switchMap(params => combineLatest(
        this.sort.valueChanges.pipe(startWith(this.sort.value)),
        this.show.valueChanges.pipe(startWith(this.show.value))
      )),
      switchMap(([sort, show]) => this._asteroidDataFacade.dispatchAndSelectAsteroidData({ sort, show }))
    );

    this.asteroidPage$ = this._asteroidDataFacade.getAsteroidResultPage().pipe(
      map(page => page || 1)
    );

    this.mediaSize$ = this._mediaSize.mediaSizeChange$;
  }
}
