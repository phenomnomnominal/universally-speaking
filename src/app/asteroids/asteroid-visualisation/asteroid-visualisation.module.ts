import { NgModule } from '@angular/core';

import { AsteroidVisualisationComponent } from './asteroid-visualisation.component';

@NgModule({
  declarations: [
    AsteroidVisualisationComponent
  ],
  exports: [
    AsteroidVisualisationComponent
  ]
})
export class AsteroidsVisualisationModule { }
