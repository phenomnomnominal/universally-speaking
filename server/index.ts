import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import { enableProdMode } from '@angular/core';
// Express Engine
import { ngExpressEngine } from '@nguniversal/express-engine';
// Import module map for lazy loading
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

import * as express from 'express';
import * as proxy from 'express-http-proxy';

import { join } from 'path';

const API_BASE_URL = 'http://www.asterank.com';

import { XMLHttpRequest } from 'xhr2';
XMLHttpRequest.nodejsSet({
  baseUrl: API_BASE_URL
});

import { INITIAL_MEDIA_SIZE_MAP } from '@trademe/tangram';

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
const app = express();

const PORT = process.env.PORT || 4000;
const DIST_FOLDER = join(process.cwd(), 'dist');

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const {AppServerModuleNgFactory, LAZY_MODULE_MAP} = require('../universally-speaking-server/main');

// Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP),
    { provide: INITIAL_MEDIA_SIZE_MAP, useValue: { isSm: true, isSd: false, isMd: false, isMg: false, isLg: false, isLl: false, isXl: false } }
  ]
}));

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'universally-speaking'));

// Example Express Rest API endpoints
app.use('/api', proxy(API_BASE_URL, {
  proxyReqPathResolver: req => `/api${req.url}`
}));

// Server static files from /browser
app.get('*.*', express.static(join(DIST_FOLDER, 'universally-speaking'), {
  maxAge: '1y'
}));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  res.render('index', { req });
});

// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node Express server listening on http://localhost:${PORT}`);
});
