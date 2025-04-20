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
  postTypeId?: number
}

export type petQueryParams = queryParams & {
  petStatusId?: number | number[];
}

export type myPetsQueryParams = queryParams & {
  animalId?: number;
  minAge?: number;
  maxAge?: number;
  userId?: number;
}

export type reportQueryParams = queryParams & {
  idPost?: number;
  idPet?: number;
}