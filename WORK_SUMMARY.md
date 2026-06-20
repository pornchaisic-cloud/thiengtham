# สรุปงาน 2026-06-20 (คืนนี้)

## ทำวันนี้
### 3 หน้า TH Service — แก้ไข/ปรับปรุง
| หน้า | การเปลี่ยนแปลง |
|------|---------------|
| `change-floor` | hero subtitle custom + spacing section-first + เปลี่ยนปุ่มโทร→Facebook |
| `fix-crack` | เนื้อหาทั้งหมด (hero, severity 4 cards, 5 steps, 4 checkmarks, CTA) |
| `painting` | เนื้อหาทั้งหมด (hero, severity 4 cards, 5 steps, 4 checkmarks, CTA) |

### 3 หน้า EN Service — สร้างใหม่ (`/en/services/...`)
- `change-floor` — hero + Why Choose Us 4 cards + CTA (แปลจาก TH)
- `fix-crack` — เต็มรูปแบบ (crack types + steps + checkmarks)
- `painting` — เต็มรูปแบบ (painting types + steps + checkmarks)

### Fix
- `Services.astro` — ทำให้ link บริการ locale-aware (TH→/services/..., EN→/en/services/...)

### ไฟล์ที่ลบ (ไม่เกี่ยวข้อง)
- `design-preview.html`, `font-preview.html`, `fix-dist.ps1`
- `THIENGTHAM_PROGRESS.md`, `desktop.ini`, `.env.example`
- `logo/` โฟลเดอร์ทั้งหมด (ของจริงใช้ใน `public/`)

## สำหรับพรุ่งนี้
- [ ] **Facebook Page** — นำข้อมูล FB Page (ThiengTham.DEV) มาใส่ในเว็บ เช่น embed post, feed, หรือข้อมูลติดต่อ
- [ ] **Domain** — ตั้งค่าหรือเปลี่ยน custom domain สำหรับเว็บ
- [ ] **ตรวจสอบ 3 หน้า EN** — เนื้อหาครบ/ถูกต้องหรือไม่ โดยเฉพาะ fix-crack + painting
- [ ] **Deploy** — ขึ้น Cloudflare Pages ถ้าพร้อม
- [ ] **Google Search Console** — ใส่ meta verification จริง
- [ ] **ตรวจสอบ responsive** — 3 หน้าใหม่บนมือถือ/แท็บเล็ต

## สถานะโปรเจกต์
| ประเภท | จำนวน |
|--------|-------|
| หน้า TH | 4 (หน้าแรก + 3 บริการ) |
| หน้า EN | 4 (หน้าแรก + 3 บริการ) |
| รวม | 8 หน้า |
| Build | ✅ ผ่าน (0 error) |
