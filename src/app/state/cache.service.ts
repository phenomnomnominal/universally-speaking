import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { addMilliseconds, isBefore } from 'date-fns';

import { AsyncItem } from './async-item';

export const DEFAULT_CACHE_TIME = 60 * 2000; // 2 minutes

export interface ICacheItemValidityOptions {
    expiryTime: number;
}

@Injectable({
    providedIn: 'root'
})
export class CacheService {
    constructor () { }

    public shouldFetch (cacheItem: AsyncItem<any>, options: ICacheItemValidityOptions): boolean {
        const { expiryTime } = options;

        const { isLoading, item, cachedAt } = cacheItem;
        if (isLoading) {
            return false;

        }

        const hasCacheItem = item && cachedAt;
        if (hasCacheItem) {
            return isBefore(addMilliseconds(cachedAt, expiryTime), new Date());
        }

        return true;
    }
}

export function createCacheKey (params: Params): string {
    return JSON.stringify(params, Object.keys(params).sort());
}
