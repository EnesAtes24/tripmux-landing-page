/**
 * Build-time OG image generator.
 * Output: public/og-image.png (1200x630), dark navy background, centered Tripmux logo.
 */
import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const logoPath = join(rootDir, 'public', 'tripmux-logo-light.svg');
const outputPath = join(rootDir, 'public', 'og-image.png');

const WIDTH = 1200;
const HEIGHT = 630;
const LOGO_MAX_WIDTH = 520;
const BG = '#0b1220';
const LOGO_OFFSET_Y = -25; // slightly above center

async function main() {
  const svg = readFileSync(logoPath);
  const logo = sharp(svg).resize(LOGO_MAX_WIDTH);
  const meta = await logo.metadata();
  const logoBuffer = await logo.png().toBuffer();

  const logoW = meta.width || LOGO_MAX_WIDTH;
  const logoH = meta.height || Math.round((LOGO_MAX_WIDTH * 535) / 1676);
  const left = Math.round((WIDTH - logoW) / 2);
  const top = Math.round((HEIGHT - logoH) / 2) + LOGO_OFFSET_Y;

  mkdirSync(join(rootDir, 'public'), { recursive: true });

  await sharp({
    create: { width: WIDTH, height: HEIGHT, channels: 3, background: BG },
  })
    .png()
    .composite([{ input: logoBuffer, top: Math.max(0, top), left }])
    .toFile(outputPath);

  console.log('Generated:', outputPath);
}

main().catch((err) => {
  console.error('generate-og-image.mjs failed:', err);
  process.exit(1);
});
