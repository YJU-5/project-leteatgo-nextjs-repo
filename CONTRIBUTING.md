# Contributing to Let Eat Go

Thank you for contributing to Let Eat Go.

This document defines the shared workflow for branches, commits, pull requests, and repository safety. Following these conventions keeps the `main` branch stable and makes changes easier to review.

## Development Workflow

1. Create or select a GitHub issue for the work.
2. Update your local `main` branch.
3. Create a branch using the naming rules below.
4. Keep the change focused on one purpose.
5. Run the relevant checks locally.
6. Open a pull request and link the related issue.
7. Address review feedback before merging.

Do not commit directly to `main`. The `main` branch should always represent a stable, deployable version of the application.

## Branch Naming

Use lowercase English words and kebab-case:

```text
<type>/<short-description>
```

### Branch Types

| Type | Purpose | Example |
| --- | --- | --- |
| `feature` | Add a new feature | `feature/map-event-filter` |
| `bugfix` | Fix a non-critical bug | `bugfix/login-redirect-error` |
| `hotfix` | Fix an urgent production issue | `hotfix/oauth-token-validation` |
| `refactor` | Improve code structure without changing behavior | `refactor/chat-service-structure` |
| `style` | Change visual styles or formatting only | `style/profile-card-spacing` |
| `test` | Add or update tests | `test/album-api-coverage` |
| `docs` | Update documentation | `docs/backend-setup-guide` |
| `chore` | Update tooling, configuration, or dependencies | `chore/update-docker-config` |
| `experiment` | Explore an idea that is not ready for release | `experiment/recommendation-model` |

### Rules

- Use lowercase letters.
- Use English words for branch names.
- Separate words with hyphens.
- Keep the description short but specific.
- Do not use spaces, underscores, names, or vague descriptions such as `fix` or `update`.
- Create branches from the latest `main` branch.
- Delete merged branches when they are no longer needed.

## Commit Messages

Use a concise, imperative subject in the following format:

```text
<type>: <summary>
```

### Commit Types

| Type | Purpose |
| --- | --- |
| `feat` | Add a new feature |
| `fix` | Fix a bug |
| `refactor` | Change internal structure without changing behavior |
| `style` | Change styles or formatting |
| `test` | Add or update tests |
| `docs` | Update documentation |
| `chore` | Update configuration, dependencies, or tooling |
| `perf` | Improve performance |

Examples:

```text
feat: add Kakao Map event markers
fix: preserve authentication state after refresh
refactor: separate album API utilities
docs: add local setup instructions
```

Keep each commit focused on one logical change. Avoid committing generated files, local settings, or unrelated formatting changes.

## Pull Requests

Every pull request should include:

- A clear title describing the change.
- A short explanation of what changed and why.
- A link to the related issue, when available.
- Screenshots or recordings for visible UI changes.
- Test steps and results.
- Notes about environment variables, migrations, or deployment impact.

Before requesting a review:

- Review your own diff.
- Remove debugging output and dead code.
- Confirm that no secrets or personal data are included.
- Resolve merge conflicts.
- Run the relevant checks.

Keep pull requests small enough to review. Split unrelated changes into separate pull requests.

## Local Checks

For the Next.js frontend:

```bash
npm ci
npm run lint
npm run build
```

For the NestJS backend:

```bash
npm ci
npm run lint
npm test
npm run build
```

If a check cannot be run, explain why in the pull request.

## Environment Variables and Secrets

- Never commit `.env`, `.env.local`, API keys, access tokens, passwords, or private credentials.
- Store local values in ignored environment files.
- Document required variable names in `.env.example` using empty or safe placeholder values.
- Use GitHub Actions secrets for deployment credentials.
- Revoke and rotate any credential that is accidentally committed.

## Review and Merge

- Respond to review comments or explain the chosen approach.
- Do not merge a pull request with unresolved critical feedback.
- Prefer a clean history and a descriptive final commit or squash message.
- Verify the application after merging changes that affect deployment or shared infrastructure.

Thank you for helping improve Let Eat Go.
