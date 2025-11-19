export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  code?: string;
}

export interface ApiError {
  error: string;
  code: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}
