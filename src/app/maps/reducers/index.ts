import {
  createSelector,
  createFeatureSelector,
  combineReducers,
  Action, ActionReducer,
} from '@ngrx/store';
import * as fromMaps from './map.reducers';
import * as fromAnnotations from './annotations.reducers';

import * as fromRoot from '../../reducers';

export const mapsFeatureKey = 'maps';
export {annotationsFeatureKey} from './annotations.reducers';

export { MapState } from './map.reducers';
export { AnnotationsState } from './annotations.reducers';

export interface MapsState {
  [fromMaps.mapsFeatureKey]: fromMaps.MapState;
  [fromAnnotations.annotationsFeatureKey]: fromAnnotations.AnnotationsState;
}

export interface State extends fromRoot.State {
  [mapsFeatureKey]: MapsState;
}

export function reducers(state: MapsState | undefined, action: Action): any {
  return combineReducers({
    [fromMaps.mapsFeatureKey]: fromMaps.reducer,
    [fromAnnotations.annotationsFeatureKey]: fromAnnotations.reducer,
  })(state, action);
}

export const selectFlightsState = createFeatureSelector<State, MapsState>(
  mapsFeatureKey
);
