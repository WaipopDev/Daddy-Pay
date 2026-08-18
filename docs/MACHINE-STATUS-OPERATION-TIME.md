# Machine Status และ Operation Time

## หน่วยของ Operation Time

ค่า `machineProgramOperationTime` มีหน่วยเป็น **นาที** ไม่ใช่วินาที

ตัวอย่าง:

```text
5  = 5 นาที
10 = 10 นาที
20 = 20 นาที
60 = 60 นาที
```

การคำนวณเวลาสิ้นสุดของ Transaction:

```text
เวลาสิ้นสุด = Transaction Date + (Operation Time × 60 นาที)
```

Frontend จะแปลงนาทีเป็น milliseconds เฉพาะตอนคำนวณ Countdown:

```text
operationTime × 60 × 1,000 milliseconds
```

## Machine Type เก้าอี้นวดไฟฟ้าหยอดเหรียญ

Machine ที่มีประเภทตรงกับ:

```text
เก้าอี้นวดไฟฟ้าหยอดเหรียญ
```

จะใช้ Transaction ล่าสุดจากสาขาและชื่อเครื่องเป็นหลัก โดยไม่ใช้ `machine.status` และไม่ตรวจ `transaction.status` เป็นตัวตัดสินสถานะ

เงื่อนไข:

```text
มี Transaction ล่าสุด และเวลายังเหลือ
→ The machine is operating + Countdown

Transaction ล่าสุดหมดเวลาแล้ว
→ The machine is available

ไม่มี Transaction ล่าสุด
→ The machine is available
```

การจับคู่ Transaction ใช้:

```text
branchId + shopManagementName
```

เพื่อรองรับกรณีที่ `shopManagementId` หรือ Machine/IoT ID ของรายการใน Report ไม่ตรงกับ Machine ปัจจุบัน แต่ชื่อเครื่องและสาขาตรงกัน

## Machine Type อื่น

Machine Type อื่นยังใช้ `machine.status` เป็นเงื่อนไขหลัก

```text
status = standby
→ The machine is available

status = active และ Countdown ยังไม่หมด
→ The machine is operating

status = active แต่ Countdown เป็น (0 Mins)
→ The machine is available

status อื่น
→ Disconnected
```

สำหรับ Machine Type อื่น Dashboard จะใช้ Latest Active Transaction ที่ผูกกับ Machine เพื่อคำนวณเวลา

## Refresh และการเขียนข้อมูล

- Dashboard refresh Machine Status ทุก 30 วินาที
- Countdown อัปเดตทุก 1 วินาทีในหน้าเว็บ
- ใช้เฉพาะการอ่านข้อมูลผ่าน GET/Query
- ไม่มีการแก้ไข `Machine`, `Transaction` หรือ `Program`
- ไม่มีการเขียนหรืออัปเดตข้อมูลลง Database

## ไฟล์ที่เกี่ยวข้อง

### Frontend

```text
my-app/src/hooks/useDashboardData.ts
my-app/src/utils/machineStatusUtils.ts
my-app/src/hooks/useMachineOperationCountdown.ts
my-app/src/components/Dashboard/MachineStatus/MachineStatusItem.tsx
my-app/src/components/Dashboard/MachineStatusReport.tsx
```

### Backend

```text
Daddy-Pay-API/src/dashboard/dashboard.service.ts
Daddy-Pay-API/src/repositories/Dashboard.repository.ts
```

## การตรวจสอบล่าสุด

```text
npx tsc --noEmit  ผ่าน
npm run build     ผ่าน
 git diff --check ผ่าน
```
