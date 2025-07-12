export type HalCollection<T> = {
    _embedded: {
        [key: string]: T[];
    };
};