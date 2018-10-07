import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATION, RouterNavigationAction } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { switchMap, filter, map, catchError, distinctUntilChanged } from 'rxjs/operators';

import { State } from '../../reducers';
import { GetAsteroidData, GetAsteroidDataFromAPI, GetAsteroidDataFromApiSuccess, GetAsteroidDataFromApiFail } from './asteroid-data.actions';
import { AsteroidDataSelectors } from './asteroid-data.selectors';
import { AsteroidDataService } from './asteroid-data.service';
import { SortParam, ShowParam } from './options';
import { AsteroidDataState } from './asteroid-data.reducers';

@Injectable({
  providedIn: 'root'
})
export class AsteroidDataFacade {
  @Effect()
  public updateQueryParams$ = this._actions$.ofType(ROUTER_NAVIGATION).pipe(
    map((action: RouterNavigationAction) => action.payload.routerState.root.firstChild),
    switchMap(snapshot => {
      const { sort, show } = snapshot.queryParams;
      return of(new GetAsteroidData(sort as SortParam, show as ShowParam));
    }),
    distinctUntilChanged<GetAsteroidData>((previous, next) => previous.sort === next.sort && previous.show === next.show)
  );

  @Effect()
  public getAsteroidData$ = this._actions$.pipe(
    ofType<GetAsteroidData>(GetAsteroidData.TYPE),
    switchMap(() =>
      // if is loading from api, we don't need call again
      this.getAsteroidData().pipe(
        filter(asteroidData => !asteroidData.isLoading),
        map(() => new GetAsteroidDataFromAPI())
      )
    )
  );

  @Effect()
  public getAsteroidDataFromApi$ = this._actions$.pipe(
    ofType<GetAsteroidData>(GetAsteroidData.TYPE),
    switchMap(action =>
      this._asteroidDataService.getAsteroidData(action).pipe(
        map(response => new GetAsteroidDataFromApiSuccess(response)),
        catchError(err => of(new GetAsteroidDataFromApiFail(err)))
      )
    )
  );

  constructor (
    private _actions$: Actions,
    private _asteroidDataService: AsteroidDataService,
    private _router: Router,
    private _store: Store<State>
  ) {}

  public dispatchAndSelectAsteroidData (sort: SortParam, show: ShowParam): Observable<AsteroidDataState> {
    this._router.navigate(['.'], { queryParams: { sort, show }, queryParamsHandling: 'merge' });
    return this.getAsteroidData();
  }

  public getAsteroidData (): Observable<AsteroidDataState> {
    return this._store.pipe(select(AsteroidDataSelectors.asteroidData));
  }

  public getAsteroidSearchParams (): Observable<[SortParam, ShowParam]> {
    return this._store.pipe(select(AsteroidDataSelectors.asteroidSearchParams));
  }

  public getAsteroidResultPage (): Observable<number> {
    return this._store.pipe(select(AsteroidDataSelectors.asteroidResultsPage));
  }
}
