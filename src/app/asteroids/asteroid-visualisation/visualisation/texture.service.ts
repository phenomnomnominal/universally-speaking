import { Injectable } from '@angular/core';

import { Texture, TextureLoader } from 'three';

@Injectable({
    providedIn: 'root'
})
export class TextureService {
    private _loader = new TextureLoader();

    private _promises: Array<Promise<any>> = [];
    public loadTexture (path): Texture {
        let resolve;
        this._promises.push(new Promise((res) => resolve = res));
        return this._loader.load(path, () => resolve());
    }

    public wait (): Promise<any> {
        return Promise.all(this._promises);
    }
}
