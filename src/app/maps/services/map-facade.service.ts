import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MapState } from '../reducers';
import { LngLatLike, LngLatBounds } from 'mapbox-gl';
import * as selectors from '../selectors';
import { loadMapChanged, markerClick, addLayer, removeLayer, selectLayer } from '../actions';
import {MapsModule} from '../maps.module';
import GeoJsonModel from '../models/GeoJsonModel';

@Injectable()
export class MapFacadeService {
  mapState$: Observable<MapState>;
  center$: Observable<LngLatLike>;
  zoom$: Observable<number>;
  bbox$: Observable<LngLatBounds>;
  geoJSON$: Observable<any>;
  layers$: Observable<GeoJsonModel[]>;
  selectedLayer$: Observable<string>;

  constructor(private store: Store<any>) {
    this.mapState$ = this.store.select(selectors.selectMapState);
    this.center$ = this.store.select(selectors.getCurrentCenter);
    this.zoom$ = this.store.select(selectors.getCurrentZoom);
    this.bbox$ = this.store.select(selectors.getCurrentBBox);
    this.geoJSON$ = this.store.select(selectors.getGeoJSON);

    this.layers$ = this.store.select(selectors.getLayers);
    this.selectedLayer$ = this.store.select(selectors.getSelectedLayer);
  }

  addLayer(layer: GeoJsonModel): void {
    this.store.dispatch(addLayer({ layer }));
  }

  removeLayer(id: string): void {
    this.store.dispatch(removeLayer({ id }));
  }

  selectLayer(id: string): void {
    this.store.dispatch(selectLayer({ id }));
  }

  clickOnMarker(coords: LngLatLike): void {
    this.store.dispatch(markerClick({ coords }));
  }

  mapChanged(bbox: LngLatBounds, center: LngLatLike, zoom: number): void {
    console.log('mapChanged', bbox, center, zoom);
    this.store.dispatch(
      loadMapChanged({
        bbox,
        center,
        zoom
      })
    );
  }
}
