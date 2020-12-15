import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapsRoutingModule } from './maps-routing.module';
import { MapsComponent } from './containers/maps';
import {MaterialModule} from '../material';
import {MapHolderService} from './services/map-holder.service';
import {MapFacadeService} from './services/map-facade.service';
import {GeoJSONApiService} from './services/geo-json-api.service';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {NgxMapboxGLModule} from 'ngx-mapbox-gl';
import {MapEffects} from './effects';
import * as fromMaps from './reducers';
import {FormsModule} from '@angular/forms';
import {environment} from '../../environments/environment';
import {NgSelectModule} from '@ng-select/ng-select';


@NgModule({
  declarations: [MapsComponent],
  imports: [
    CommonModule,
    FormsModule,
    // NgxMapboxGLModule,
    NgxMapboxGLModule.withConfig({
      accessToken: environment.mapboxToken,
      geocoderAccessToken: environment.mapboxToken,
    }),
    MapsRoutingModule,
    MaterialModule,
    NgSelectModule,
    /**
     * StoreModule.forFeature is used for composing state
     * from feature modules. These modules can be loaded
     * eagerly or lazily and will be dynamically added to
     * the existing state.
     */
    StoreModule.forFeature(fromMaps.mapsFeatureKey, fromMaps.reducers),

    /**
     * Effects.forFeature is used to register effects
     * from feature modules. Effects can be loaded
     * eagerly or lazily and will be started immediately.
     *
     * All Effects will only be instantiated once regardless of
     * whether they are registered once or multiple times.
     */
    EffectsModule.forFeature([MapEffects]),
  ],
  providers: [
    MapHolderService,
    MapFacadeService,
    GeoJSONApiService
  ],
})
export class MapsModule { }
