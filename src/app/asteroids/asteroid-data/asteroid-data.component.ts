import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MediaSizeService, MediaSizeMap } from '@trademe/tangram';
import { Observable, combineLatest } from 'rxjs';
import { switchMap, startWith, take, tap, debounceTime, map } from 'rxjs/operators';

import { AsteroidDataFacade } from './asteroid-data.facade';
import { AsteroidDataState } from './asteroid-data.reducers';
import { INITIAL_SORT, INITIAL_SHOW, SORT_OPTIONS, SHOW_OPTIONS } from './options';

@Component({
  selector: 'us-asteroid-data',
  templateUrl: './asteroid-data.component.html',
  styleUrls: ['./asteroid-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AsteroidDataComponent implements OnInit {
  public expanded = false;
  public sortOptions = SORT_OPTIONS;
  public showOptions = SHOW_OPTIONS;

  public asteroidData$: Observable<AsteroidDataState>;
  public asteroidPage$: Observable<number>;
  public mediaSize$: Observable<MediaSizeMap>;

  public sort = new FormControl();
  public show = new FormControl();

  constructor (
    private _asteroidDataFacade: AsteroidDataFacade,
    private _mediaSize: MediaSizeService
  ) { }

  public ngOnInit (): void {
    this.asteroidData$ = this._asteroidDataFacade.getAsteroidSearchParams().pipe(
      take(1),
      tap(([sort, show]) => {
        this.sort.setValue(sort);
        this.show.setValue(show);
      }),
      switchMap(([sort, show]) => combineLatest(
        this.sort.valueChanges.pipe(startWith(sort || INITIAL_SORT.param)),
        this.show.valueChanges.pipe(startWith(show || INITIAL_SHOW))
      )),
      debounceTime(200),
      switchMap(([sort, show]) => this._asteroidDataFacade.dispatchAndSelectAsteroidData(sort, show))
    );

    this.asteroidPage$ = this._asteroidDataFacade.getAsteroidResultPage().pipe(
      map(page => page || 1)
    );

    this.mediaSize$ = this._mediaSize.mediaSizeChange$;
  }
}
