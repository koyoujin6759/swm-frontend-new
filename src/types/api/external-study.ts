export interface ApiResponse<T> {
  message: string;
  data: PaginatedResponse<T>;
}
 
export interface ExternalStudy {
  deadlineDate: number[];
  id: string;
  link: string;
  roles: string[];
  technologies: string[];
  title: string;
  description: string;
}

export interface ExternalStudyList { 
  content: ExternalStudy[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: {
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    sort: {
      sorted: boolean;
      empty: boolean;
      unsorted: boolean;
    };
    unpaged: boolean;
  };
  size: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  totalPages: number;
  totalElements: number;
}
   

export type ExternalStudyResponse = ApiResponse<ExternalStudyList>;


export interface PaginatedResponse<T> {
  externalStudies: T;
}