import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { TgSelectModule, TgGridModule, TgTableModule, TgPaginationModule, TgRevealModule, TgSpacingModule } from '@trademe/tangram';

import { FuzzyModule } from '../../_shared/fuzzy/fuzzy.module';
import { AsteroidDataComponent } from './asteroid-data.component';
import { AsteroidDataFacade } from './asteroid-data.facade';
import { asteroidDataReducer, asteroidDataInitialState } from './asteroid-data.reducers';
import { ASTEROID_DATA } from './asteroid-data.selectors';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,

    EffectsModule.forFeature([AsteroidDataFacade]),
    StoreModule.forFeature(ASTEROID_DATA, asteroidDataReducer, { initialState: asteroidDataInitialState }),

    TgGridModule,
    TgPaginationModule,
    TgRevealModule,
    TgSelectModule,
    TgSpacingModule,
    TgTableModule,

    FuzzyModule
  ],
  declarations: [
    AsteroidDataComponent
  ],
  exports: [
    AsteroidDataComponent
  ]
})
export class AsteroidDataModule { }
