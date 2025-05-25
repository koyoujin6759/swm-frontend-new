export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface CursorPageData<T> {
  numberOfElements: number;
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
  data: T[];
}

export * from './study-room';


