import { ReportType } from "./report";
import { NotificationType } from "./notification";

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
  search?: string;
};

export type postQueryParams = queryParams & locationQueryParams  & {
  postTypeId?: number;
  userId?: number;
  tagIds?: number[];
  refresh?: number;
};

export type notificationQueryParams = queryParams & {
  userId?: number;
  isRead?: boolean;
  type?: NotificationType;
  roleIds?: number[];
  dateMin?: Date;
  dateMax?: Date;
};

export type petQueryParams = queryParams & locationQueryParams  & {
  userId?: number;
  breedId?: number;
  minAge?: number;
  maxAge?: number;
  isSterilized?: boolean;
  isVaccinated?: boolean;
  gender?: string;
  petStatusId?: number[];
  refresh?: number;
};

export type productQueryParams = queryParams & locationQueryParams & {
  categoryId?: number;
  condition?: string;
  price?: number;
  minPrice?: number;
  maxPrice?: number;
  animalIds?: number;
  userId?: number;
  search?: string;
  refresh?: number;
};

export type myPetsQueryParams = queryParams & {
  animalId?: number;
  minAge?: number;
  maxAge?: number;
  userId?: number;
  petStatusId?: number;
  refresh?: number;
};

export type reportQueryParams = queryParams & {
  idPost?: number;
  idPet?: number;
  idProduct?: number;
  idComment?: number;
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
  search?: string;
};

export type adoptionsResponseQueryParams = queryParams & {
  petId?: number;
  userId?: number;
  fullName?: string;
  email?: string;
  phone?: string;
  status?: "ACCEPTED" | "REJECTED" | "PENDING";
  createdAfter?: string;
  createdBefore?: string;
};

export type locationQueryParams = queryParams & {
  departmentId?: string;
  districtId?: string;
  neighborhoodId?: string;
  coordinates?: number[];
};

export type crowdfundingQueryParams = queryParams & {
  userId?: number;
  status?: string;
  minGoal?: number;
  maxGoal?: number;
  keywords?: string;
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
