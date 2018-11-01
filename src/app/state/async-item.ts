export interface AsyncItem<T> {
    isLoading: boolean;
    error?: Error;
    cachedAt?: string;
    item?: T;
}

export interface EntityAsyncItem<T> extends AsyncItem<T> {
    id: any;
}
