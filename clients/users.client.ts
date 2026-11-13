import { type ApiResult } from '../types/api.types';
import { type User } from '../types/user.types';
import { BaseClient } from './base.client';

export class UsersClient extends BaseClient {
  /** GET /users/{id} */
  async getById(id: number): Promise<ApiResult<User>> {
    return this.toResult<User>(await this.request.get(`users/${id}`));
  }
}
