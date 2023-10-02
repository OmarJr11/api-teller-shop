export interface PaginationOptions {
    page: number,
    limit?: number,
    order?: 'asc' | 'desc',
    orderBy?: string,
    minPrice?: number,
    maxPrice?: number,
    isNew?: boolean,
    stock?: number
}

export interface FilterOptions {
    stock?: { $gte: number },
    price?: { $gte: number, $lte?: number},
    isProductNew?: boolean,
}