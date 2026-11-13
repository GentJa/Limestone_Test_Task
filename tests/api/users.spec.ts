import { expect, test } from '../../fixtures';
import { schemaErrors } from '../../helpers/schema.helper';
import { userSchema } from '../../schemas/user.schema';

test.describe('Users API contract', { tag: '@regression' }, () => {
  for (const id of [1, 10]) {
    test(`returns user ${id} with a body that matches the full user schema`, { tag: '@smoke' }, async ({ usersClient }) => {
      const { status, body } = await usersClient.getById(id);

      expect(status).toBe(200);
      expect(schemaErrors(userSchema, body), 'schema violations').toEqual([]);
      expect(body.id, 'returned user is the requested one').toBe(id);
    });
  }
});
