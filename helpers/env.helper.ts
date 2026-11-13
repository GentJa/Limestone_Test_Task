import 'dotenv/config';

/** Reads a required variable and fails fast with a clear message instead of running tests against `undefined`. */
function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable "${name}". Copy .env.example to .env or set it in CI.`);
  }
  return value;
}

export const env = {
  sauceBaseUrl: required('SAUCE_BASE_URL'),
  apiBaseUrl: required('API_BASE_URL'),
  password: required('SAUCE_PASSWORD'),
  users: {
    standard: required('SAUCE_STANDARD_USER'),
    problem: required('SAUCE_PROBLEM_USER'),
  },
  // Kept outside `users`: setup logs in every entry of `users`, and this user cannot log in by design.
  lockedOutUser: required('SAUCE_LOCKED_OUT_USER'),
} as const;

export type SauceUserKey = keyof typeof env.users;

/** Where the setup project saves each user's session; the UI project loads it via storageState. */
export const storageStatePath = (user: SauceUserKey): string => `.auth/${user}.json`;
