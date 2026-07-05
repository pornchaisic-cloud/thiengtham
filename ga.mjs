import { chromium } from 'playwright';
import { writeFileSync, existsSync, unlinkSync } from 'fs';

const SIGNAL = 'D:\\web thiengtham\\ga_go.txt';
const USER_DIR = 'D:\\web thiengtham\\.ga-profile';

if (existsSync(SIGNAL)) unlinkSync(SIGNAL);

const browser = await chromium.launch({
  channel: 'chrome',
  headless: false,
  args: ['--disable-blink-features=AutomationControlled'],
});

const context = await browser.newContext({
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36',
  locale: 'en-US',
  timezoneId: 'Asia/Bangkok',
});

await context.addInitScript(() => {
  Object.defineProperty(navigator, 'webdriver', { get: () => false });
});

const page = await context.newPage();
await page.goto('https://analytics.google.com', { waitUntil: 'load' });

console.log('\n✅ Browser opened. Log in, then create "ga_go.txt" in project folder.\n');

async function extract() {
  const url = page.url();
  const title = await page.title();
  console.log(`\n📍 ${title}\n🔗 ${url}`);

  const text = await page.locator('body').textContent({ timeout: 5000 });

  const patterns = [
    /([\d,.]+)\s*(user|active|visitor)/gi,
    /ผู้ใช้[\s\S]{0,20}([\d,.]+)/gi,
    /(จำนวน[\s\S]{0,10}[\d,.]+)/gi,
  ];
  for (const re of patterns) {
    const m = text.match(re);
    if (m) console.log('📊', m.slice(0, 3).join(' | '));
  }

  if (existsSync(SIGNAL)) unlinkSync(SIGNAL);
}

setInterval(() => {
  if (existsSync(SIGNAL)) extract();
}, 1000);
