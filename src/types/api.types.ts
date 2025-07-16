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
export interface PagedModel<T> {
    _embedded?: {
        [key: string]: T[];
    };
    _links: {
        self: Link;
        first?: Link;
        prev?: Link;
        next?: Link;
        last?: Link;
    };
    page: {
        size: number;
        totalElements: number;
        totalPages: number;
        number: number;
    };
}