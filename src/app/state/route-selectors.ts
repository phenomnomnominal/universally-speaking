import { createFeatureSelector } from '@ngrx/store';
import { RouterReducerState} from '@ngrx/router-store';
import { createSelector } from 'reselect';

export namespace RouterSelectors {
    export const currentRouterState = createFeatureSelector<RouterReducerState>('router');

    export const currentQueryParams = createSelector(
        currentRouterState,
        routeState => routeState.state.root.queryParams
    );

    export const currentParams = createSelector(
        currentRouterState,
        routeState => routeState.state.root.params
    );

    export const currentUrl = createSelector(
        currentRouterState,
        routeState => routeState.state.root.url
    );
}
