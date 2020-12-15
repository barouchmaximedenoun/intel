import { Injectable } from '@angular/core';
import { Map, LngLatLike, LngLatBounds } from 'mapbox-gl';
import { HttpClient } from '@angular/common/http';
import {MapsModule} from '../maps.module';
import {Observable} from 'rxjs';

@Injectable()
export class GeoJSONApiService {

  constructor(
    private httpClient: HttpClient
  ) {}

  get(bbox: LngLatBounds): Observable<any> {
    return this.httpClient.get(
      'https://opendata.arcgis.com/datasets/c57777877aa041ecaef98ff2519aabf6_44.geojson'
    );
  }
}
