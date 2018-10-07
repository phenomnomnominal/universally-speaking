import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AsteroidDataModule } from './asteroid-data/asteroid-data.module';
import { AsteroidsVisualisationModule } from './asteroid-visualisation/asteroid-visualisation.module';
import { AsteroidsComponent } from './asteroids.component';

@NgModule({
  imports: [
    RouterModule.forChild([{
      path: '',
      component: AsteroidsComponent
    }]),

    AsteroidDataModule,
    AsteroidsVisualisationModule
  ],
  declarations: [
    AsteroidsComponent
  ]
})
export class AsteroidsModule { }
