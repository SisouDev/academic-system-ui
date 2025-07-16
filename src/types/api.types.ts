export interface Link {
    href: string;
}

export type EntityModel<T> = T & {
    _links: {
        self: Link;
        [key: string]: Link;
    };
};

export interface CollectionModel<T> {
    _embedded?: {
        [key: string]: T[];
    };
    _links: {
        self: Link;
        [key: string]: Link;
    };
}