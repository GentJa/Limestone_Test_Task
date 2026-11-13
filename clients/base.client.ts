import { type APIRequestContext, type APIResponse } from '@playwright/test';
import { type ApiResult } from '../types/api.types';

/** Shared plumbing for typed clients. Paths are relative to the `api` project's baseURL. */
export abstract class BaseClient {
  constructor(protected readonly request: APIRequestContext) {}

  protected async toResult<T>(response: APIResponse): Promise<ApiResult<T>> {
    return { status: response.status(), body: (await response.json()) as T };
  }
}
