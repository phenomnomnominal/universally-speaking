import { Injectable } from '@angular/core';

import { THREE } from './three';

@Injectable({
    providedIn: 'root'
})
export class TextureService {
    private _promises: Array<Promise<any>> = [];
    public loadTexture (path): void {
        let resolve;
        this._promises.push(new Promise((res) => resolve = res));
        return THREE.ImageUtils.loadTexture(path, null, () => resolve());
    }

    public wait (): Promise<any> {
        return Promise.all(this._promises);
    }
}
