import { createReducer, on } from '@ngrx/store';
import * as actions from '../actions';
import GeoJsonModel from '../models/GeoJsonModel';

export interface AnnotationsState {
  layers: GeoJsonModel[];
  selectedLayer: string;
}

export const initialState: AnnotationsState = {
  layers: [],
  selectedLayer: null,
};

export const annotationsFeatureKey = 'annotations';

export const reducer = createReducer(
  initialState,
  on(actions.addLayer, (state, { layer }) => {
    return {
      selectedLayer: state.selectedLayer,
      layers: [...state.layers, layer]
    };
  }),
  on(actions.removeLayer, (state, { id }) => {
    const selectedLayer = state.selectedLayer === id? null : state.selectedLayer;
    return {
      selectedLayer,
      layers: state.layers.filter((layer) => {
        return layer.features[0].id !== id;
      })
    };
  }),
  on(actions.selectLayer, (state, { id }) => {
    return {
      selectedLayer: id,
      layers: state.layers
    };
  }),
);

