import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'us-asteroids',
    template: `
        <us-asteroid-visualisation></us-asteroid-visualisation>
        <us-asteroid-data
            class="l-container">
        </us-asteroid-data>
    `,
    styles: [':host { display: block; height: 100vh; }'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AsteroidsComponent { }
