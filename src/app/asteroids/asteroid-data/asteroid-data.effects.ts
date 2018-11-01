import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATION, RouterNavigationAction } from '@ngrx/router-store';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { GetAsteroidDataFromApiAction, GetAsteroidDataFromApiFailAction, GetAsteroidDataFromApiSuccessAction } from './asteroid-data.actions';
import { IAsteroidDataOptions } from './asteroid-data.reducer';
import { AsteroidDataService } from './asteroid-data.service';

@Injectable()
export class AsteroidDataEffects {
  @Effect()
  public updateQueryParams$ = this._actions$.ofType(ROUTER_NAVIGATION).pipe(
    map((action: RouterNavigationAction) => action.payload.routerState.root.firstChild),
    map(snapshot => snapshot.queryParams),
    switchMap(params => of(new GetAsteroidDataFromApiAction(params as IAsteroidDataOptions)))
  );

  @Effect()
  public getAsteroidDataFromApiEffect$ = this._actions$.pipe(
    ofType<GetAsteroidDataFromApiAction>(GetAsteroidDataFromApiAction.TYPE),
    switchMap(action => {
      return this._asteroidDataService.getAsteroidData(action.options).pipe(
        map(response => new GetAsteroidDataFromApiSuccessAction(action.options, response)),
        catchError(err => of(new GetAsteroidDataFromApiFailAction(action.options, err)))
      );
    })
  );

  constructor (
      private _actions$: Actions,
      private _asteroidDataService: AsteroidDataService
  ) { }
}
