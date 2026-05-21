# Daddy Pay Admin

เอกสารสำหรับ AI agent อยู่ที่ **[docs/](./docs/)** — อ่านคู่มือหลักที่ **[docs/AGENTS.md](./docs/AGENTS.md)**

**สำคัญ:** ฟีเจอร์ใหม่ใน `(appAuth)` ต้องแยก **page → ViewModel → service → components/** และใน `components/<Feature>/` ต้องแยก **View + sub-components** (Header, Filter, Table, Modal) — ห้ามรวม logic ใน `page.tsx` หรือรวม UI ทั้งหน้าใน `*View.tsx` ไฟล์เดียว

อ้างอิงโครงสร้าง: `LanguageSettings/`, `ShopManagementTransaction/`, `ShopInfo/` — รายละเอียดใน [docs/RULE.md](./docs/RULE.md)

**UI/Design:** ใช้ component และ layout ตามโปรเจกต์ (Bootstrap + Tailwind + `TableComponent` + `FormGroup` + `Modals`) — ห้ามออกแบบ UI ใหม่เอง → [docs/DESIGN.md](./docs/DESIGN.md#ui-design-system-required)

| เอกสาร | ลิงก์ |
|--------|------|
| คู่มือหลัก | [docs/AGENTS.md](./docs/AGENTS.md) |
| กฎโค้ด | [docs/RULE.md](./docs/RULE.md) |
| Workflows | [docs/SKILL.md](./docs/SKILL.md) |
| สถาปัตยกรรม | [docs/DESIGN.md](./docs/DESIGN.md) |
