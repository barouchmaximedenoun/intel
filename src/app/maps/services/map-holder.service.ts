import { Injectable } from '@angular/core';
import { Map, LngLatLike } from 'mapbox-gl';
import {MapsModule} from '../maps.module';

@Injectable()
export class MapHolderService {
  public map: Map;

  constructor() {}

  setMapRef(map: Map): void {
    this.map = map;
  }

  flyTo(center: LngLatLike, zoom: number): void {
    this.map.flyTo({
      center,
      zoom
    });
  }
}
