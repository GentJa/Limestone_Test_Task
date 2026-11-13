/** A typed response: status plus parsed body, so tests never touch raw APIResponse objects. */
export interface ApiResult<T> {
  status: number;
  body: T;
}
