# QA Automation Task: Playwright + TypeScript

UI tests for [SauceDemo](https://www.saucedemo.com/), API tests for [JSONPlaceholder](https://jsonplaceholder.typicode.com/),
a Postman collection (`/postman`) and SQL queries (`/sql/queries.sql`).

## Install and run

Requires Node.js 20.19+ (ESLint 10 minimum).

```bash
npm ci
npx playwright install chromium
cp .env.example .env          # base URLs and credentials; in CI these come from secrets
```

| What | Command |
|---|---|
| Full suite (setup, UI, API) | `npx playwright test` |
| UI only / API only | `npm run test:ui` / `npm run test:api` |
| A single file | `npx playwright test tests/ui/login.spec.ts` |
| A single test by name | `npx playwright test -g "standard_user"` |
| Smoke (critical path) | `npm run test:smoke` |
| Regression (full suite) | `npm run test:regression` |
| Known defects only | `npm run test:defects` (runs tests tagged `@defect`) |
| Headed browser | `npx playwright test --project=ui --headed` |
| Debug (Inspector, step through) | `npx playwright test tests/ui/checkout.spec.ts --debug` |
| UI mode (watch + time travel) | `npx playwright test --ui` |
| Isolation check | `npx playwright test --repeat-each=3 --workers=4 --shuffle` |
| Type check | `npm run typecheck` |
| Lint | `npm run lint` |

`setup` runs automatically before `ui` (project dependency), so a single UI test still gets a logged-in session.

## Report and Postman

```bash
npx playwright show-report                 # opens playwright-report/index.html
npm run postman                            # Newman via npx, same as:
npx --yes newman run postman/jsonplaceholder.postman_collection.json -e postman/jsonplaceholder.postman_environment.json
```

Traces are recorded on the first retry (CI), and screenshots are taken on failure.
The `problem_user` test is shown as **expected to fail**. It carries a `defect` annotation and the `@defect` tag.
In Postman, import both files from `/postman`, select the "JSONPlaceholder" environment and run the collection in order.

## Layout

```
eslint.config.mjs          typescript-eslint + eslint-plugin-playwright (enforces the CLAUDE.md rules)
playwright.config.ts       projects: setup → ui, api (no browser); all timeouts set here
tests/auth.setup.ts        logs in each user once, saves .auth/<user>.json
tests/ui, tests/api        specs (no selectors, URLs or setup code)
pages/*.page.ts            page objects; the only place that knows selectors (data-test via getByTestId)
clients/*.client.ts        typed API clients; tests never build URLs or call request.get()
schemas/*.schema.ts        JSON schemas (validated with Ajv)
types/*.types.ts           API types
fixtures/index.ts          the single merged `test`/`expect` (ui.fixture + api.fixture)
helpers/                   env reader (fail-fast), price maths in integer cents, schema validation, login credentials
test-data/                 checkout.json (products, customer), login.json (login-form cases)
postman/                   collection + environment (baseUrl, missingPostId, maxResponseTimeMs)
sql/queries.sql            Part 3
```

## Design decisions

- **Architecture:** specs → fixtures → page objects / typed API clients → config. Specs hold no selectors, URLs or setup code; everything comes from one merged fixture, so a UI or endpoint change touches one file.
- **Auth and isolation:** a `setup` project logs each user in once and saves `storageState`; the `standardUser` / `problemUser` fixtures open a fresh context from it. No UI login in tests, an empty cart per test, fully parallel.
- **Totals:** prices are read from the page; item total, 8% tax and total are computed in integer cents and checked with web-first assertions.
- **problem_user:** same scenario, marked `test.fail()` with a `defect` annotation and `@defect` tag. The report shows "expected to fail", the build stays green, and the test turns red ("unexpectedly passed") once the bug is fixed. `skip` would hide the defect; a plain failure teaches people to ignore red builds. `test.fail` accepts *any* failure, so new breakage is still caught by standard_user, which runs the identical flow without the marker; the report shows the exact failing check (First Name loses its value).
- **Non-persisting POST:** test 1 asserts the write contract (201, schema, echoed payload, numeric `id`); test 2 documents that `GET` of the new id returns 404, labelled as a property of the fake. Against a real service, test 2 would assert the read-back.
- **Contract and Postman:** one strict JSON schema per resource instead of field-by-field checks. In Postman, shared checks live at collection level and each request only declares its expected status and schema.
- **Extras:** data-driven login tests (the only UI tests that start logged out); ESLint with `eslint-plugin-playwright`, so rules like "no fixed waits" are enforced by the linter, not by review; and tags: `@smoke` = critical path (standard checkout, user contract, post create) for a fast pre-merge check, `@regression` = every functional test, `@defect` = known defects.
- **Skipped on purpose:** CI workflow, pre-filled cart, data factory and other browsers. In a one-hour task the required scenarios and the reasoning came first, and each extra fits the current layers without refactoring.
- **At 500 tests and five engineers:** CI sharding with a merged HTML report published per run; the existing tags wired to CI jobs (smoke per PR, regression nightly); shared fixtures and components as an internal package; a data factory and API/`localStorage` state seeding instead of UI setup; defects linked to tracker IDs; CODEOWNERS per area; schemas generated from OpenAPI.

## Assumptions

- SauceDemo tax is a flat 8% of the item total, rounded to the cent (this is what the site applies).
- The two products are fixed in `test-data/checkout.json`. Their prices are read at runtime, not hard-coded.
- Login error texts are SauceDemo's current messages (e.g. `Epic sadface: Username is required`).
- TypeScript is pinned to `~6.0`: TypeScript 7 ships no JavaScript compiler API, so `typescript-eslint` cannot parse the project with it yet.
- Both targets are public external services we do not control. JSONPlaceholder occasionally takes longer than 10 s to answer `POST /posts` (`apiRequestContext.post: Timeout 10000ms exceeded`; seen a handful of times across a few hundred local runs). The 10 s limit is deliberate and stays central in the config: raising it would only hide slowness. CI retries up to 2 times and the report then marks the test **flaky** instead of hiding it; a test that fails on every attempt is a real failure.
- SauceDemo credentials are public demo values. They still live in `.env` (gitignored) / `.env.example`, not in code.
- problem_user's checkout bug (typing Last Name overwrites First Name) is a deliberate, permanent defect of the demo site, so it is treated as a known defect and not as a new regression.
- JSONPlaceholder `POST /posts` returns `201` with id `101`, and `GET /posts/101` returns `404 {}`.
- The user schema is strict (`additionalProperties: false`), so a new or renamed field fails the contract test. That is intended: any contract change should be noticed, not silently accepted.
- Postman: the user is picked **at random** from `/users`, so the chain does not depend on one user. The chosen id appears in the test name. An empty `/users` fails with a clear message and stops the run. `missingPostId` = 999999 (JSONPlaceholder has a fixed set of 100 posts, so it never exists), `maxResponseTimeMs` = 3000.
- SQL: "Total value" = Σ(Quantity × Products.Price), using the current product price, because Northwind's OrderDetails has no unit price.
- SQL was run in the W3Schools Try-It editor: Query 1 returns 45 customers and Query 2 returns 29, with no customer in both.

