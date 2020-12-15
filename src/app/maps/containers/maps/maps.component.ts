import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import {MapFacadeService, MapHolderService} from '../../services';

import { Map } from 'mapbox-gl';
import {map, take, tap} from 'rxjs/operators';

import MapboxDraw from '@mapbox/mapbox-gl-draw';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

import * as turf from '@turf/turf';
import {environment} from '../../../../environments/environment';
import GeoJsonModel from '../../models/GeoJsonModel';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit, AfterViewInit {
  @ViewChild('mapContainer') mapContainer;
  @ViewChild('annotation') annotation;
  @ViewChild('geocodercontainer') geocodercontainer;
  annotationModel;
  annotations$;
  annotations;
  // selectedId$;
  selected$;
  draw: any;
  geocoder: any;
  map: any;
  initialCenter = {
    lat: 39.785091,
    lng: -74
  };
  initialZoom = 8;
  geoJSON$: Observable<any>;
  locationSearch = 'Tel Aviv';

  constructor(private mapHolder: MapHolderService,
              private mapFacade: MapFacadeService) {
    this.geoJSON$ = mapFacade.geoJSON$;
    this.geoJSON$.pipe(
      tap((data) => {
        console.log(data);
      })
    );
    this.annotations$ = mapFacade.layers$.pipe(
      map( layers => {
          return layers.map(elt => {
            return {id: elt.getId(), name: elt.getName()};
          });
        }),
      tap(layers => {
        console.log('layers=', layers);
        this.annotations = layers;
      })
    )
    // this.selectedId$ = mapFacade.selectedLayer$;
    this.selected$ = mapFacade.selectedLayer$.pipe(
      map( id => {
          console.log('id=', id);
          return this.annotations ? this.annotations.find(elt => elt.id === id) : {};
        }
      ),
      tap(elt => {
        console.log('elt', elt);
        this.annotationModel = elt;
      })
    ).subscribe();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    console.log(MapboxDraw);
    this.draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        line_string: true,
        point: true,
        trash: true
      }
    });
    this.mapContainer.load.pipe(take(1)).subscribe(() => {
      this.mapContainer.MapService.addControl(this.draw, 'top-right');
      this.mapContainer.MapService.mapInstance.on('draw.create', this.onDrawCreate);
      this.mapContainer.MapService.mapInstance.on('draw.delete', this.onDrawDelete);
      this.mapContainer.MapService.mapInstance.on('draw.update', this.onDrawUpdate);
      this.mapContainer.MapService.mapInstance.on('draw.selectionchange', this.onDrawSelectionChange);
      this.geocoder = new MapboxGeocoder({
        accessToken: environment.mapboxToken,
        mapboxgl: this.mapContainer
      });
      this.geocodercontainer.nativeElement.appendChild(this.geocoder.onAdd(this.map));
    });
  }

  handleSelectChange = (e) => {
    console.log(e);
    this.mapFacade.selectLayer(e.id);
  }

  onDrawSelectionChange = ({ features }) => {
    console.log('sele ch', features)
    if (features.length > 0) {
      const feature = new GeoJsonModel(features[0]);
      console.log('sele ch id', feature.getId())
      this.mapFacade.selectLayer(feature.getId());
    } else {
      this.mapFacade.selectLayer(null);
    }
  }

  onDrawCreate = ({ features }) => {
    const feature = features[0];
    feature.properties.annotation = this.annotation.nativeElement.value;
    const jsonFeature = new GeoJsonModel(feature);
    console.log('jsonFeature', jsonFeature);
    this.mapFacade.addLayer(jsonFeature);
  }

  onDrawDelete = ({ features }) => {
    const feature = features[0];
    const jsonFeature = new GeoJsonModel(feature);
    console.log('jsonFeature', jsonFeature);
    this.mapFacade.removeLayer(jsonFeature.getId());
  }

  onDrawUpdate = ({ features }) => {
    const feature = new GeoJsonModel(features[0]);
    console.log('fonDrawUpdate feature', feature.getId());
  }

  loadMap(loadedMap: Map): void {
    console.log('loadedMap=', loadedMap);
    this.map = loadedMap;
    this.mapHolder.setMapRef(loadedMap);
    this.mapFacade.mapChanged(loadedMap.getBounds(), loadedMap.getCenter(), loadedMap.getZoom());
  }

  updateMap(event: { target: Map }): void {
    const { target } = event;
    console.log('target=', target);
    this.mapFacade.mapChanged(
      target.getBounds(),
      target.getCenter(),
      target.getZoom()
    );
  }

  markerClick(marker: any): void {
    this.mapFacade.clickOnMarker(marker.geometry.coordinates);
  }
}
