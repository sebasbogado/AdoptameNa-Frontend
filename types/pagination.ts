import { ReportType } from "./report";

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

export type postQueryParams = queryParams & locationQueryParams  & {
  postTypeId?: number;
  userId?: number;
  tagIds?: number[];
};

export type petQueryParams = queryParams & locationQueryParams  & {
  petStatusId?: number[];
};

export type productQueryParams = queryParams & locationQueryParams & {
  categoryId?: number;
  condition?: string;
  price?: number;
  minPrice?: number;
  maxPrice?: number;
  animalIds?: number;
  userId?: number;
};

export type myPetsQueryParams = queryParams & {
  animalId?: number;
  minAge?: number;
  maxAge?: number;
  userId?: number;
  petStatusId?: number;
};

export type reportQueryParams = queryParams & {
  idPost?: number;
  idPet?: number;
  reportType?: ReportType;
};

export type bannerQueryParams = queryParams & {
  minStartDate?: string;
  maxStartDate?: string;
  minEndDate?: string;
  maxEndDate?: string;
  isActive?: boolean;
  minPriority?: number;
  maxPriority?: number;
};

export type tagQueryParams = queryParams & {
  postTypeIds?: number[];
};

export type userQueryParams = queryParams & {
  role?: string;
  name?: string;
};

export type profileQueryParams = queryParams & {
  name?: string;
  role?: string;
};

export type adoptionsResponseQueryParams = queryParams & {
  petId?: number;
  userId?: number;
  fullName?: string;
  email?: string;
  phone?: string;
  isAccepted?: boolean
};
export type locationQueryParams = queryParams & {
  departmentId?: string;
  districtId?: string;
  neighborhoodId?: string;
  coordinates?: number[];
};

export function buildQueryParams(params?: Record<string, any>): URLSearchParams {
  const searchParams = new URLSearchParams();
  if (params) {
    for (const key in params) {
      const typedKey = key as keyof typeof params;
      const value = params[typedKey];
      if (value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach(val => {
            if (val !== null && val !== undefined) {
              searchParams.append(key, String(val));
            }
          });
        } else {
          searchParams.append(key, String(value));
        }
      }
    }
  }
  return searchParams;
}
