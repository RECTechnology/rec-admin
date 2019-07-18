export interface SearchParams {
    offset?: number;
    limit?: number;
    sort?: string;
    order?: string;
}

export interface SearchAccountsParams extends SearchParams {
    query?: {
        search?: string;
        rect_box?: number[];
        only_with_offers?: boolean;
        subtype?: string;
        type?: string;
        active?: boolean;
        on_map?: boolean;
    };
}

export interface ListAccountsParams extends SearchParams {
    search?: string;
    type?: string;
    active?: number;
    [key: string]: any;
}
