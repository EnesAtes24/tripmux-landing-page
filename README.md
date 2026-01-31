# tripmux-landing-page

Frontend UI for Tripmux (Cloudflare Pages). Built with Vite + vanilla ES modules for fast, maintainable static delivery.

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The build output is written to `dist/`.

## Sync into backend static

After building, sync the output into the backend repo:

```bash
../tripmux-api/scripts/sync-landing-page.sh
```
