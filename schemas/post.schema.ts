// Shape of a post returned by JSONPlaceholder (also the echo of POST /posts).
export const postSchema = {
  $id: 'post',
  type: 'object',
  additionalProperties: false,
  required: ['id', 'userId', 'title', 'body'],
  properties: {
    id: { type: 'integer', minimum: 1 },
    userId: { type: 'integer', minimum: 1 },
    title: { type: 'string', minLength: 1 },
    body: { type: 'string', minLength: 1 },
  },
} as const;
