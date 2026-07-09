# Plan: Client-side Facebook Portfolio

เปลี่ยน Portfolio.astro จากดึงข้อมูล Facebook API ตอน build → ดึงจาก client-side ผ่าน Cloudflare Pages Function

---

## ปัญหา

- Astro static site (`output: "static"`)
- Facebook API ถูกเรียกตอน `astro build` เท่านั้น
- ไม่ rebuild อัตโนมัติเมื่อ Facebook อัปเดท
- ผู้ใช้ต้อง push ไป main หรือ trigger workflow_dispatch ด้วยตนเอง

## วิธีแก้

ใช้ Cloudflare Pages Functions เป็น proxy เพื่อเรียก Facebook API แทน server-side fetch ใน Astro

---

## ขั้นตอนดำเนินงาน

### Step 1: สร้าง `/functions/api/facebook-posts.js`

Cloudflare Pages Function ที่เรียก Facebook Graph API และ return JSON images

```js
export async function onRequest(context) {
  const token = context.env.PUBLIC_FB_ACCESS_TOKEN;
  const url = `https://graph.facebook.com/v22.0/ThiengTham.DEV/posts?fields=message,permalink_url,attachments{media{source,image},subattachments{media{image}}}&limit=5&access_token=${token}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      return new Response(JSON.stringify({ error: "Facebook API error" }), { status: 502 });
    }
    const data = await res.json();
    const posts = data.data || [];
    const images = [];
    const seen = new Set();

    for (const post of posts) {
      if (post.attachments?.data) {
        const link = post.permalink_url || "#";
        for (const att of post.attachments.data) {
          if (att.subattachments?.data) {
            for (const sub of att.subattachments.data) {
              const src = sub.media?.image?.src;
              if (src) {
                const key = src.split("?")[0].split("_n.jpg")[0] + "_n.jpg";
                if (!seen.has(key)) { seen.add(key); images.push({ src, url: link }); }
              }
            }
          }
          if (att.media?.image?.src) {
            const src = att.media.image.src;
            const key = src.split("?")[0].split("_n.jpg")[0] + "_n.jpg";
            if (!seen.has(key)) { seen.add(key); images.push({ src, url: link }); }
          }
        }
      }
      if (images.length >= 6) break;
    }

    return new Response(JSON.stringify({ images: images.slice(0, 6) }), {
      headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=300" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
```

### Step 2: แก้ `src/components/Portfolio.astro`

**ลบ:**
- frontmatter ทั้งหมดตั้งแต่ `export interface Props` ถึง `console.error(...)` (บรรทัด 1-64)
- คงไว้แค่ `---` + Props + locale

**เพิ่ม client-side script:**

```astro
<script>
async function loadPortfolio() {
  const grid = document.getElementById('portfolioGrid');
  if (!grid) return;

  try {
    const res = await fetch('/api/facebook-posts');
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    const images = data.images || [];
    if (images.length === 0) return;

    const items = grid.querySelectorAll('.portfolio-item');
    images.forEach((img, i) => {
      if (items[i]) {
        items[i].outerHTML = `
          <a href="${img.url}" target="_blank" rel="noopener" class="portfolio-item">
            <img src="${img.src}" alt="ซ่อมคอนโด ผลงานเที่ยงทำ ดีเวลลอปเม้นท์"
                 style="width:100%;height:auto;display:block;" loading="lazy" />
          </a>
        `;
      }
    });
  } catch (e) {
    console.warn('Failed to load portfolio images:', e);
  }
}
loadPortfolio();
</script>
```

### Step 3: เพิ่ม Environment Variable ใน Cloudflare Dashboard

`PUBLIC_FB_ACCESS_TOKEN` ต้องอยู่ใน Cloudflare Pages environment (setting → variables)

### Step 4: Deploy

```bash
npm run build
npx wrangler pages deploy dist --project-name=thiengtham
```

หรือ push ไป GitHub (CI/CD จะ deploy อัตโนมัติ)

---

## สรุปการเปลี่ยนแปลงไฟล์

| ไฟล์ | Action |
|------|--------|
| `functions/api/facebook-posts.js` | **สร้างใหม่** |
| `src/components/Portfolio.astro` | **แก้ไข** — ลบ server fetch logic + เพิ่ม client script |
| `.github/workflows/deploy.yml` | **ไม่ต้องแก้** (Cloudflare Pages รองรับ `/functions` อัตโนมัติ) |

---

## UX Flow

```
1. User request → Cloudflare serve static HTML + placeholders
2. Browser render → show 6 placeholders (SVG silhouettes)
3. Browser execute script → fetch /api/facebook-posts
4. Cloudflare Pages Function → fetch Facebook Graph API (cache 5 min)
5. Return JSON → Browser replace placeholders with real images
6. If API fail → placeholders remain (site not broken)
```
