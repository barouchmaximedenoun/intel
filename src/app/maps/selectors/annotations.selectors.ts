import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AnnotationsState, MapsState, State, mapsFeatureKey, annotationsFeatureKey} from '../reducers';


const getMapsState = createFeatureSelector<State, MapsState>(
  mapsFeatureKey
);
export const selectAnnotationsState = createSelector(
  getMapsState,
  (state) => state[annotationsFeatureKey]
);
export const getLayers = createSelector(
  selectAnnotationsState,
  (state: AnnotationsState) => state.layers
);

export const getSelectedLayer = createSelector(
  selectAnnotationsState,
  (state: AnnotationsState) => state.selectedLayer
);
