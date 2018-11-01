import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATION, RouterNavigationAction } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, filter, map, switchMap, take } from 'rxjs/operators';

import { CacheService, DEFAULT_CACHE_TIME } from '../../state';
import { GetAsteroidDataAction, GetAsteroidDataFromApiAction, GetAsteroidDataFromApiFailAction, GetAsteroidDataFromApiSuccessAction } from './asteroid-data.actions';
import { IAsteroidDataState, IAsteroidDataOptions } from './asteroid-data.reducer';
import { AsteroidDataSelectors } from './asteroid-data.selectors';
import { AsteroidDataService } from './asteroid-data.service';

@Injectable()
export class AsteroidDataEffects {
  @Effect()
  public updateQueryParams$ = this._actions$.ofType(ROUTER_NAVIGATION).pipe(
    map((action: RouterNavigationAction) => action.payload.routerState.root.firstChild),
    map(snapshot => snapshot.queryParams),
    switchMap(params => of(new GetAsteroidDataAction(params as IAsteroidDataOptions)))
  );

  @Effect()
  public getAsteroidDataEffect$ = this._actions$.pipe(
    ofType<GetAsteroidDataAction>(GetAsteroidDataAction.TYPE),
    switchMap(action =>
      // get current value from store cache
      this._store.select(AsteroidDataSelectors.currentAsteroidData).pipe(
        take(1),
        // filter if cache item is not valid
        filter(storeItem => this._cacheService.shouldFetch(storeItem, { expiryTime: DEFAULT_CACHE_TIME })),
        map(() => new GetAsteroidDataFromApiAction(action.options)))
    )
  );

  @Effect()
  public getAsteroidDataFromApiEffect$ = this._actions$.pipe(
    ofType<GetAsteroidDataFromApiAction>(GetAsteroidDataFromApiAction.TYPE),
    switchMap(action => {
      return this._asteroidDataService.getAsteroidData(action.options).pipe(
        map(response => new GetAsteroidDataFromApiSuccessAction(action.options, response, new Date().toString())),
        catchError(err => of(new GetAsteroidDataFromApiFailAction(action.options, err)))
      );
    })
  );

  constructor (
      private _actions$: Actions,
      private _asteroidDataService: AsteroidDataService,
      private _cacheService: CacheService,
      private _store: Store<IAsteroidDataState>
  ) { }
}
