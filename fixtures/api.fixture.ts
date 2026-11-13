import { test as base } from '@playwright/test';
import { PostsClient } from '../clients/posts.client';
import { UsersClient } from '../clients/users.client';

interface ApiClients {
  usersClient: UsersClient;
  postsClient: PostsClient;
}

export const test = base.extend<ApiClients>({
  usersClient: async ({ request }, use) => use(new UsersClient(request)),
  postsClient: async ({ request }, use) => use(new PostsClient(request)),
});
