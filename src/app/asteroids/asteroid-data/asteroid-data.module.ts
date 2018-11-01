import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { TgSelectModule, TgGridModule, TgTableModule, TgPaginationModule, TgRevealModule, TgSpacingModule } from '@trademe/tangram';

import { FuzzyModule } from '../../_shared/fuzzy/fuzzy.module';
import { AsteroidDataComponent } from './asteroid-data.component';
import { AsteroidDataEffects } from './asteroid-data.effects';
import { ASTEROID_DATA_FEATURE, asteroidDataReducer } from './asteroid-data.reducer';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,

    EffectsModule.forFeature([AsteroidDataEffects]),
    StoreModule.forFeature(ASTEROID_DATA_FEATURE, asteroidDataReducer),

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
