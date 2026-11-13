import { type ApiResult } from '../types/api.types';
import { type NewPost, type Post } from '../types/post.types';
import { BaseClient } from './base.client';

export class PostsClient extends BaseClient {
  /** POST /posts */
  async create(post: NewPost): Promise<ApiResult<Post>> {
    return this.toResult<Post>(await this.request.post('posts', { data: post }));
  }

  /** GET /posts/{id}. Body is `{}` when the post does not exist. */
  async getById(id: number): Promise<ApiResult<Post | Record<string, never>>> {
    return this.toResult(await this.request.get(`posts/${id}`));
  }
}
