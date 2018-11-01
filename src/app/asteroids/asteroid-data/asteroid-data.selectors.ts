import { Params } from '@angular/router';
import { createFeatureSelector } from '@ngrx/store';
import { createSelector } from 'reselect';

import { AsyncItem, createCacheKey, RouterSelectors } from '../../state';
import { ASTEROID_DATA_FEATURE, asteroidDataAdapter, IAsteroidDataOptions, IAsteroidDataResponse, IAsteroidDataState } from './asteroid-data.reducer';

export namespace AsteroidDataSelectors {
    const asteroidDataState = createFeatureSelector<IAsteroidDataState>(ASTEROID_DATA_FEATURE);

    export const currentOptions = createSelector(
        RouterSelectors.currentParams,
        RouterSelectors.currentQueryParams,
        (params: Params, queryParams: Params): IAsteroidDataOptions => ({ ...params, ...queryParams } as IAsteroidDataOptions)
    );

    const cachedAsteroidDataEntity = createSelector(
        asteroidDataState,
        (state: IAsteroidDataState) => state.asteroidDataEntities
    );

    export const { selectEntities: cachedAsteroidDataEntities } = asteroidDataAdapter.getSelectors(cachedAsteroidDataEntity);

    export const currentAsteroidData = createSelector(
        cachedAsteroidDataEntities,
        currentOptions,
        (asteroidDataCache, options): AsyncItem<IAsteroidDataResponse> => {
            return <AsyncItem<IAsteroidDataResponse>>(asteroidDataCache[createCacheKey(options)] || { isLoading: false });
        }
    );
}
