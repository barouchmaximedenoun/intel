import { createReducer, on } from '@ngrx/store';
import * as mapActions from '../actions';
import { LngLatLike, LngLatBounds } from 'mapbox-gl';

export interface MapState {
  center: LngLatLike;
  zoom: number;
  bbox: LngLatBounds;
  geoJSON: any;
}

export const initialState: MapState = {
  center: {
    lat: 45.464211,
    lng: 9.191383
  },
  zoom: 13,
  bbox: undefined,
  geoJSON: {}
};

export const mapsFeatureKey = 'maps';

export const reducer = createReducer(
  initialState,
  on(mapActions.loadMapChanged, (state, { center, zoom, bbox }) => {
    console.log(mapActions.loadMapChanged, center, zoom, bbox)
    return {
      center,
        zoom,
        bbox
    };
  }),
  on(mapActions.updateDataSuccess, (state, { geoJSON }) => {
    console.log(geoJSON)
    return {
      ...state,
      geoJSON
    };
  })
);

