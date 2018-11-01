import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { VisualisationService } from './asteroids/asteroid-visualisation/visualisation/visualisation.service';

@NgModule({
  imports: [
    AppModule,
    ModuleMapLoaderModule,
    ServerModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: VisualisationService, useValue: null }
  ]
})
export class AppServerModule {}
