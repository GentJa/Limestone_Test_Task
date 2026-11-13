import { randomUUID } from 'node:crypto';
import { env } from './env.helper';

/** Which credential a login case uses. Test data names the kind; real values come from env at runtime. */
export interface LoginCase {
  behaviour: string;
  user: 'standard' | 'lockedOut' | 'empty';
  password: 'valid' | 'wrong' | 'empty';
  error: string;
}

const usernames: Record<LoginCase['user'], () => string> = {
  standard: () => env.users.standard,
  lockedOut: () => env.lockedOutUser,
  empty: () => '',
};

const passwords: Record<LoginCase['password'], () => string> = {
  valid: () => env.password,
  // Unique per call, so it can never accidentally match a real password.
  wrong: () => `wrong-${randomUUID()}`,
  empty: () => '',
};

/** Resolves a login case to the username and password to type. */
export function credentialsFor(loginCase: LoginCase): { username: string; password: string } {
  return { username: usernames[loginCase.user](), password: passwords[loginCase.password]() };
}
