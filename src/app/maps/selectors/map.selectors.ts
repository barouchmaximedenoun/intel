import { createSelector, createFeatureSelector } from '@ngrx/store';
import {MapState, MapsState, State, mapsFeatureKey} from '../reducers';


export const getMapsState = createFeatureSelector<State, MapsState>(
  mapsFeatureKey
);
export const selectMapState = createSelector(
  getMapsState,
  (state) => state[mapsFeatureKey]
);
export const getCurrentCenter = createSelector(
  selectMapState,
  (state: MapState) => state.center
);

export const getCurrentZoom = createSelector(
  selectMapState,
  (state: MapState) => state.zoom
);

export const getCurrentBBox = createSelector(
  selectMapState,
  (state: MapState) => state.bbox
);

export const getGeoJSON = createSelector(
  selectMapState,
  (state: MapState) => state.geoJSON
);
