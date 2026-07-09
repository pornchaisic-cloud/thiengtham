// Copy Cloudflare Pages Functions from repo root into the build output.
// CF Pages + Astro: `wrangler pages deploy dist` only ships whatever is in
// `dist/`, so Functions must live under `dist/functions/` to be picked up.

const { cpSync, existsSync } = require('node:fs');

const src = 'functions';
const dest = 'dist/functions';

if (existsSync(src)) {
  cpSync(src, dest, { recursive: true });
  console.log(`[copy-functions] ${src}/ -> ${dest}/`);
} else {
  console.log(`[copy-functions] no ${src}/ directory, skipping`);
}
