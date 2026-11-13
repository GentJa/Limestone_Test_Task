// Strict contract for GET /users/{id}: every field required, no unknown fields, nested objects included.
export const userSchema = {
  $id: 'user',
  type: 'object',
  additionalProperties: false,
  required: ['id', 'name', 'username', 'email', 'address', 'phone', 'website', 'company'],
  properties: {
    id: { type: 'integer', minimum: 1 },
    name: { type: 'string', minLength: 1 },
    username: { type: 'string', minLength: 1 },
    email: { type: 'string', format: 'email' },
    phone: { type: 'string', minLength: 1 },
    website: { type: 'string', minLength: 1 },
    address: {
      type: 'object',
      additionalProperties: false,
      required: ['street', 'suite', 'city', 'zipcode', 'geo'],
      properties: {
        street: { type: 'string', minLength: 1 },
        suite: { type: 'string', minLength: 1 },
        city: { type: 'string', minLength: 1 },
        zipcode: { type: 'string', minLength: 1 },
        geo: {
          type: 'object',
          additionalProperties: false,
          required: ['lat', 'lng'],
          properties: {
            lat: { type: 'string', pattern: '^-?\\d+(\\.\\d+)?$' },
            lng: { type: 'string', pattern: '^-?\\d+(\\.\\d+)?$' },
          },
        },
      },
    },
    company: {
      type: 'object',
      additionalProperties: false,
      required: ['name', 'catchPhrase', 'bs'],
      properties: {
        name: { type: 'string', minLength: 1 },
        catchPhrase: { type: 'string', minLength: 1 },
        bs: { type: 'string', minLength: 1 },
      },
    },
  },
} as const;
