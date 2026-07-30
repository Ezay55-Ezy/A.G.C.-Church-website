## Critical Rules

- NEVER commit real API keys, secrets, or credentials to git. Ever.
- Use placeholder `'YOUR_YOUTUBE_API_KEY'` in `script.js` for committed code.
- The pre-commit hook in `.githooks/pre-commit` blocks commits containing key patterns.
- Before committing, run `git diff --cached` and visually verify no secrets are present.

## Deployment

The GitHub Action `.github/workflows/deploy.yml` injects the real YouTube API key from the `YOUTUBE_API_KEY` repository secret at deploy time.

To set it up:
1. Add `YOUTUBE_API_KEY` secret at Settings > Secrets and variables > Actions
2. Pages source must be set to "GitHub Actions" in Settings > Pages
3. Push to `main` — the action will deploy with the key injected
