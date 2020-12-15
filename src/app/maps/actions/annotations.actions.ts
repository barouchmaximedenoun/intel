import { createAction, props } from '@ngrx/store';
import GeoJsonModel from '../models/GeoJsonModel';

export const addLayer = createAction(
  '[Annotations] add layer',
  props<{ layer: GeoJsonModel }>()
);

export const removeLayer = createAction(
  '[Annotations] remove layer',
  props<{ id: string }>()
);

export const selectLayer = createAction(
  '[Annotations] select layer',
  props<{ id: string }>()
);
