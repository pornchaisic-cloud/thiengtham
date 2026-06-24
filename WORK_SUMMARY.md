# สรุปงาน 2026-06-23

## ทำวันนี้
### Step 2 — ตั้ง GitHub Secrets
| Secret | ค่า | ไว้ทำอะไร |
|--------|-----|----------|
| `PUBLIC_FB_ACCESS_TOKEN` | จาก `.env` | ดึงรูป Facebook Graph API ตอน build |
| `CF_ACCOUNT_ID` | `61257b4cb466aee91b4b06f25d42bf9b` | Cloudflare Account ID |
| `CF_API_TOKEN` | สร้างจาก Dashboard | Deploy ขึ้น Cloudflare Pages |
- ใช้ Node.js + libsodium เข้ารหัสผ่าน GitHub API, 3 secrets verified

### Step 4 — แก้ EN Service Pages
| ไฟล์ | แก้ไข |
|------|-------|
| `src/i18n/en.json` | services.items ตรงกับ 3 หน้าจริง + material keywords |
| `change-floor.astro` | เพิ่ม keywords + grammar fix |
| `fix-crack.astro` | title ขยายเป็น settlement/subsidence |
| `painting.astro` | badges + primer wording |

### Deploy
- Commit `8b02ba6`, `1080f24` → push → Cloudflare Pages 0 error

### Step 5 — Google Search Console
- `thiengtham.com` verify แล้ว

## สถานะโปรเจกต์
| ประเภท | จำนวน |
|--------|-------|
| หน้า TH | 4 |
| หน้า EN | 4 |
| รวม | 8 หน้า |
| Build | ผ่าน (0 error) |
| Deploy | Cloudflare Pages (thiengtham.com) |

---

# สรุปงาน 2026-06-24

## ทำวันนี้

### SEO keyword "ซ่อมคอนโด" — รอบ 1
- **Title TH service** — `th.json` items[].title → "รื้อและเปลี่ยนพื้นคอนโด", "ซ่อมรอยร้าวคอนโด", "ทาสีคอนโดภายในและภายนอก"
- **Hero subtitle** — 3 หน้า TH เติม "คอนโด" (พื้นคอนโด, โครงสร้างคอนโด, ผนังคอนโด/ห้องคอนโด)
- **Portfolio caption + alt** — "ซ่อมคอนโด ผลงานเที่ยงทำ ดีเวลลอปเม้นท์" (ใต้รูป + alt)
- **Marquee** — เปลี่ยนเป็น "✦ รีโนเวทคอนโดและบ้าน", "✦ ซ่อมคอนโด"
- **Internal linking** — "บริการอื่นๆ ของเรา" เชื่อม 3 หน้า service TH
- **GSC verification file** — เพิ่ม `google7ed23244e01e3555.html` และ `google1eda52919a059442.html`

### Commits
| Commit | รายละเอียด |
|--------|-----------|
| `1769e04` | SEO: add keyword ซ่อมคอนโด + hero subtitles |
| `5a1bdba` | SEO: update TH service titles + portfolio alt text |
| `c1242a6` | update marquee: add รีโนเวทคอนโดและบ้าน + ซ่อมคอนโด |
| `9f59628` | add internal linking between TH service pages |
| `d582772` | add GSC verification files |

### Deployed
- `thiengtham.com` — ทุก commit ผ่าน CF Pages auto-deploy

---

### Session 2 — LINE, GBP, Place ID + Review

#### LINE Official Account
| งาน | รายละเอียด |
|-----|-----------|
| Status | เปลี่ยนเป็น "รับซ่อมคอนโดและบ้าน" (19 ตัวอักษร, อยู่ในเกณฑ์ 20) |
| Website | เพิ่ม `https://thiengtham.com/` (USER: กด Add ใส่เอง) — เก็บ Facebook URL ไว้ |
| Name | คงชื่อเดิม "เที่ยงทำ DEV." (USER: ตัดสินใจไม่เปลี่ยน) |

#### Google Business Profile
| งาน | รายละเอียด |
|-----|-----------|
| Verification | ✅ **ยืนยันแล้ว** 100% (ไม่ต้องรออีก) |
| Address แก้ไข | USER แก้ที่อยู่แล้ว — รอ Google อนุมัติ (pending) |

#### Place ID + Review Link
| งาน | รายละเอียด |
|-----|-----------|
| CID (decimal) | `15743364229223628938` |
| CID (hex) | `0xda7baa5ac477408a` |
| Place ID | **`ChIJ3fICVYKb4jARikB3xFqqe9o`** |
| Maps URL | `https://www.google.com/maps?cid=15743364229223628938` |
| Review Link | `https://search.google.com/local/writereview?placeid=ChIJ3fICVYKb4jARikB3xFqqe9o` |
| รีวิวแรก | ✅ โพสต์แล้ว — **5.0** ★★★★★ โดย Succubuz Zaitsev49 |

## สิ่งที่ต้องทำพรุ่งนี้ (2026-06-25)

### 🔴 Priority สูง (ทำใน code ได้)
| # | งาน | รายละเอียด | เวลา |
|---|-----|-----------|------|
| 1 | **FAQ section + schema ทั้ง 3 หน้า** | Q&A ที่แต่ละหน้า service ("ซ่อมคอนโดราคา? ใช้เวลากี่วัน?") + JSON-LD FAQPage schema → rich snippet บน Google | ~15 นาที |
| 2 | **Blog: "ซ่อมคอนโด ต้องรู้ก่อนจ้างช่าง"** | Content marketing 1 หน้าใหม่ /blog/ซ่อมคอนโด — target keyword "ซ่อมคอนโด" — โพสต์ Facebook ลิงก์กลับ | ~30 นาที |
| 3 | **ขยายเนื้อหา TH service pages** | เพิ่ม keyword "ซ่อมคอนโด" ในเนื้อหาธรรมชาติมากขึ้น (H2/H3, body text) | ~10 นาที |

### 🟡 รอคุณทำ
| # | งาน |
|---|-----|
| 4 | **Google Business Profile** — แจกลิงก์รีวิวให้ลูกค้า + โพสต์รูปงาน + ใส่คำอธิบายบน GBP |
| 5 | **Facebook โพสต์** — รูปงานจริง + #ซ่อมคอนโด + ลิงก์กลับ thiengtham.com |
| 6 | **ขอ Google Review** — แจกลิงก์ `https://search.google.com/local/writereview?placeid=ChIJ3fICVYKb4jARikB3xFqqe9o` ให้ลูกค้า |

### ไฟล์ที่เกี่ยวข้อง
- `src/pages/services/change-floor.astro` — +FAQ section + schema
- `src/pages/services/fix-crack.astro` — +FAQ section + schema
- `src/pages/services/painting.astro` — +FAQ section + schema
- `src/pages/blog/ซ่อมคอนโด.astro` — หน้าใหม่ (blog)

### สถานะโปรเจกต์
| รายการ | สถานะ |
|--------|--------|
| หน้า TH | 4 |
| หน้า EN | 4 |
| Build | ✅ 0 error |
| Deploy | ✅ CF Pages auto-deploy |
| GSC | ✅ verified |
| GA4 | ✅ G-XSRZ1FJF3W |
| GBP | ✅ verified — มีรีวิวแรกแล้ว (5.0 ★) |
| LINE OA | ✅ status+website อัปเดตแล้ว |
| Keywords | "ซ่อมคอนโด" ใน title, desc, caption, alt, marquee, internal links |
