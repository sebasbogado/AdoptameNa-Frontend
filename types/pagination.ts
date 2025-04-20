export type Pagination = {
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  last: boolean;
};

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

export type queryParams = {
  page?: number;
  size?: number;
  sort?: string;
};

export type postQueryParams = queryParams & {
  postTypeId?: number;
};

export type petQueryParams = queryParams & {
  petStatusId?: number;
};

export type productQueryParams = queryParams & {
  categoryId?: number;
  condition?: string;
  price?: number;
  minPrice?: number;
  maxPrice?: number;
  animalIds?: number;
};

export type reportQueryParams = queryParams & {
  idPost?: number;
  idPet?: number;
}
