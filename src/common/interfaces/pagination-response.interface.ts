
export interface PaginationResponse {
    items: any[];
    itemCount: number;
    totalItems?: number;
    pageCount?: number;
    next?: number;
    actual?: number;
    last?: number;
}