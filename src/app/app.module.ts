import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { TangramModule } from '@trademe/tangram';

import { AppComponent } from './app.component';
import { reducers, metaReducers } from './state';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    HttpClientModule,
    RouterModule.forRoot([{
      path: '**',
      redirectTo: 'asteroids'
    }, {
      path: 'asteroids',
      loadChildren: './asteroids/asteroids.module#AsteroidsModule'
    }]),

    EffectsModule.forRoot([]),
    StoreModule.forRoot(reducers, { metaReducers }), StoreDevtoolsModule.instrument(),
    StoreRouterConnectingModule.forRoot({ stateKey: 'router' }),

    TangramModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
