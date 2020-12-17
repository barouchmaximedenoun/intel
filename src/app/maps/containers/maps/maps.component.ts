import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import {MapFacadeService, MapHolderService} from '../../services';

import { Map } from 'mapbox-gl';
import {map, take, tap} from 'rxjs/operators';

import MapboxDraw from '@mapbox/mapbox-gl-draw';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

import {environment} from '../../../../environments/environment';
import GeoJsonModel from '../../models/GeoJsonModel';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit, AfterViewInit {
  @ViewChild('mapContainer') mapContainer;
  // @ViewChild('annotation') annotation;
  @ViewChild('geocodercontainer') geocodercontainer;
  annotationVal: string = "";
  annotationModel: {id: string, name:string};
  annotations$: Observable<{id: string, name: string}[]>;
  annotations: {id: string, name: string}[];
  selected$;
  draw: MapboxDraw;
  geocoder: MapboxGeocoder;
  map: Map;
  initialCenter = {
    lat: 39.785091,
    lng: -74
  };
  initialZoom = 8;
  geoJSON$: Observable<any>;

  constructor(private mapHolder: MapHolderService,
              private mapFacade: MapFacadeService) {
    this.geoJSON$ = mapFacade.geoJSON$;
    this.annotations$ = mapFacade.layers$.pipe(
      map( layers => {
          return layers.map(elt => {
            return {id: elt.getId(), name: elt.getName()};
          });
        }),
      tap(layers => {
        this.annotations = layers;
      })
    )
    this.selected$ = mapFacade.selectedLayer$.pipe(
      map( id => {
          return this.annotations ? this.annotations.find(elt => elt.id === id) : {id: "", name: ""};
        }
      ),
      tap(elt => {
        this.annotationModel = elt;
      })
    ).subscribe();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
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
    this.mapFacade.selectLayer(e.id);
    this.draw.changeMode('simple_select', { featureIds: [e.id] })
  }

  onDrawSelectionChange = ({ features }) => {
    if (features.length > 0) {
      const feature = new GeoJsonModel(features[0]);
      this.mapFacade.selectLayer(feature.getId());
    } else {
      this.mapFacade.selectLayer(null);
    }
  }

  onDrawCreate = ({ features }) => {
    const feature = features[0];
    feature.properties.annotation = this.annotationVal;
    this.annotationVal = "";
    const jsonFeature = new GeoJsonModel(feature);
    this.mapFacade.addLayer(jsonFeature);
  }

  onDrawDelete = ({ features }) => {
    const feature = features[0];
    const jsonFeature = new GeoJsonModel(feature);
    this.mapFacade.removeLayer(jsonFeature.getId());
  }

  onDrawUpdate = ({ features }) => {
    const feature = new GeoJsonModel(features[0]);
    console.log('fonDrawUpdate feature', feature.getId());
  }

  loadMap(loadedMap: Map): void {
    this.map = loadedMap;
    this.mapHolder.setMapRef(loadedMap);
    this.mapFacade.mapChanged(loadedMap.getBounds(), loadedMap.getCenter(), loadedMap.getZoom());
  }

  updateMap(event: { target: Map }): void {
    const { target } = event;
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
