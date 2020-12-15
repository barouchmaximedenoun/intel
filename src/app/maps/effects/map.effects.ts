import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  updateData,
  updateDataSuccess,
  updateDataFailure,
  loadMapChanged,
  markerClick,
} from '../actions';
import {
  switchMap,
  withLatestFrom,
  map,
  catchError,
  debounceTime,
  tap
} from 'rxjs/operators';
import { MapFacadeService, GeoJSONApiService, MapHolderService } from '../services';
import { of } from 'rxjs';

@Injectable()
export class MapEffects {
  loadDataEffect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(updateData),
        withLatestFrom(this.mapFacade.mapState$),
        switchMap(([_, mapState]) => {
          const { bbox, zoom, center } = mapState;
          return this.api.get(bbox).pipe(
            map(data => updateDataSuccess({ geoJSON: data })),
            catchError(err => of(updateDataFailure()))
          );
        })
      )
  );

  triggerUpdateEffect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loadMapChanged),
        debounceTime(200),
        map(() => updateData())
      )
  );

  clickMarkerEffect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(markerClick),
        tap(({ coords }) => {
          this.mapRef.flyTo(coords, 10);
        })
      ),
    {
      dispatch: false,
    }
  );

  constructor(
    private actions$: Actions,
    private api: GeoJSONApiService,
    private mapFacade: MapFacadeService,
    private mapRef: MapHolderService
  ) {}
}
