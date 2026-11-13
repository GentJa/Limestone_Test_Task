import { randomUUID } from 'node:crypto';
import { expect, test } from '../../fixtures';
import { schemaErrors } from '../../helpers/schema.helper';
import { postSchema } from '../../schemas/post.schema';
import { type NewPost } from '../../types/post.types';

// Unique payload per test, so parallel runs never share data.
const newPost = (): NewPost => ({ userId: 1, title: `title ${randomUUID()}`, body: `body ${randomUUID()}` });

test.describe('Posts API create', { tag: '@regression' }, () => {
  test('creates a post and echoes the sent payload with a new numeric id', { tag: '@smoke' }, async ({ postsClient }) => {
    const payload = newPost();

    const { status, body } = await postsClient.create(payload);

    expect(status).toBe(201);
    expect(schemaErrors(postSchema, body), 'schema violations').toEqual([]);
    expect(body).toEqual({ ...payload, id: expect.any(Number) });
  });

  test(
    'does not persist a created post (characteristic of the fake service)',
    {
      annotation: {
        type: 'fake-service',
        description:
          'JSONPlaceholder fakes writes: POST returns 201 with an id, but nothing is stored. A real system would assert the read-back instead.',
      },
    },
    async ({ postsClient }) => {
      const created = await postsClient.create(newPost());
      expect(created.status).toBe(201);

      const readBack = await postsClient.getById(created.body.id);

      expect(readBack.status).toBe(404);
      expect(readBack.body).toEqual({});
    },
  );
});
