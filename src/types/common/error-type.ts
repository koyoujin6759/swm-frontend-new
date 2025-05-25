export interface ApiErrorResponse {
  code: string;
  message: string;
  messageClient?: string;
  path: string;
  status: boolean;
}

export function isApiErrorResponse(error: unknown): error is ApiErrorResponse {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    'path' in error &&
    'status' in error
  );
}

export interface HttpError extends Error {
  statusCode: number;
}

export interface AlertState {
  isOpen: boolean;
  message: string;
  severity: 'success' | 'info' | 'warning' | 'error';
}

export interface ApplicationError extends Error {
  statusCode?: number;
  payload?: unknown;
  isAuthError?: boolean;
}