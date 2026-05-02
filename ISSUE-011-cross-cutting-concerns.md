# ISSUE-011: Cross-Cutting Concerns & Platform Features

**Date**: 2026-04-10  
**Status**: ✅ Completed  
**Priority**: P2  
**Type**: Feature / Infrastructure  
**Parent**: [ISSUE-005](ISSUE-005-feature-evaluation-master-plan.md)  
**Depends On**: [ISSUE-006](ISSUE-006-restructure-english.md), [ISSUE-007](ISSUE-007-village-management.md), [ISSUE-008](ISSUE-008-accommodation-management.md), [ISSUE-009](ISSUE-009-umkm-management.md), [ISSUE-010](ISSUE-010-experience-activity-management.md)

**Last Updated**: 2026-04-11

---

## 1. Objective

Implement shared platform features that span across all roles. These are the foundation services that enable monetization, payment processing, analytics, and inter-role communication.

---

## 2. Scope

### 2.1 Payment & Monetization Engine
### 2.2 Revenue Sharing Framework  
### 2.3 Shared Finance Module Enhancement  
### 2.4 Notification System Enhancement  
### 2.5 Chat System Enhancement  
### 2.6 i18n Completion (Hardcoded Strings)
### 2.7 Account Settings Enhancement
### 2.8 Shared Review System
### 2.9 Technical Documentation Standards

---

## 3. Feature Specifications

### 3.1 Payment & Monetization Engine

**Cross-role** — Unified payment processing for all transaction types.

#### Transaction Types
| Type | Source Role | Description |
|------|-----------|-------------|
| Accommodation Booking | ACCOMMODATION | Room reservation payments |
| UMKM Order | UMKM | Product purchase (pickup model) |
| Experience Booking | EVENT_ORGANIZER | Ticket/reservation payments |
| Facility Rental | VILLAGE_ADMIN / EVENT_ORGANIZER | Village facility rental fees |
| Experience DP | EVENT_ORGANIZER | Down payment for experience coordination |

#### Payment Flow
```
Customer initiates payment
  → Select payment method (bank transfer, e-wallet, VA, QRIS)
  → Payment gateway processes (Midtrans/Xendit — mock)
  → Webhook callback → Update status
  → Split payment to stakeholders
  → Settlement to partner bank accounts
```

#### Payment Gateway Mock
The platform already has `PaymentRecommendations` component listing Midtrans, Xendit, and DOKU. Extend this into a mock payment processing system:

```typescript
interface PaymentGatewayConfig {
  provider: "midtrans" | "xendit" | "doku";
  environment: "sandbox" | "production";
  merchantId: string;
  // Mock: all payments auto-succeed after 3 seconds
}

interface PaymentTransaction {
  id: string;
  externalId: string;
  type: "accommodation" | "sme_order" | "experience" | "facility_rental";
  referenceId: string; // reservationId, orderId, etc.
  amount: number;
  currency: "IDR";
  method: string;
  status: PaymentStatus;
  platformFee: number;
  platformFeePercent: number;
  splits: PaymentSplit[];
  metadata: Record<string, unknown>;
  createdAt: string;
  paidAt?: string;
  expiredAt?: string;
  refundedAmount?: number;
}
```

#### Refund Engine
```typescript
interface RefundRequest {
  id: string;
  paymentId: string;
  reason: string;
  type: "full" | "partial";
  amount: number;
  status: "pending" | "approved" | "processed" | "rejected";
  requestedBy: string;
  processedBy?: string;
  processedAt?: string;
  createdAt: string;
}
```

#### Cancellation Policies
| Policy Level | Refund % | Timeframe |
|-------------|----------|-----------|
| Free Cancellation | 100% | More than X days before |
| Moderate | 50% | X-Y days before |
| Strict | 0% | Less than Y days before |
| Custom | Configurable | Per-partner setting |

**Technical Docs**: Payment state machine, gateway mock implementation, split calculation, refund processing.  
**Manual Guide**: Understanding payment processing, cancellation policies, refund timelines.

---

### 3.2 Revenue Sharing Framework

**Cross-role** — Configurable revenue distribution for multi-party transactions.

#### Default Revenue Splits

| Transaction Type | Partner Share | Village Share | Platform Fee | Notes |
|-----------------|-------------|--------------|-------------|-------|
| Accommodation Booking | 85% | — | 15% | Direct to accommodation |
| UMKM Order | 90% | — | 10% | Lower fee for SMEs |
| Village Experience | 85% | — | 15% | Village is the partner |
| External Experience | 60% | 25% | 15% | Three-way split |
| Facility Rental | — | 85% | 15% | Goes to village |

#### Revenue Sharing Configuration
```typescript
interface RevenueShareConfig {
  id: string;
  transactionType: string;
  partnerPercent: number;
  villagePercent: number;
  platformPercent: number;  // Fixed, managed by platform
  isNegotiable: boolean;
  minPartnerPercent: number;
  maxPartnerPercent: number;
  effectiveFrom: string;
  effectiveTo?: string;
}
```

#### Settlement Schedule
| Method | Timeline | Fee |
|--------|----------|-----|
| Standard | T+7 (7 days after transaction) | Free |
| Express | T+1 (next business day) | 1% fee |
| Instant | Same day | 2% fee |

**Technical Docs**: Split calculation engine, settlement scheduler, configuration model.  
**Manual Guide**: Understanding revenue shares, settlement timelines, choosing settlement speed.

---

### 3.3 Shared Finance Module Enhancement (`/dashboard/finance/`)

**Existing**: 3 pages (overview, reports, management)  
**Enhanced**: Role-aware financial dashboards.

#### Finance Overview (`/dashboard/finance/`)
- **Balance Summary**: Available balance, pending settlement, total earned
- **Transaction Feed**: Recent transactions with type indicators
- **Revenue Chart**: Trend over time, filterable by source
- **Quick Actions**: Request withdrawal, view reports, update bank info

#### Financial Reports (`/dashboard/finance/reports`)
- **Period Selection**: Daily, weekly, monthly, quarterly, annual, custom range
- **Revenue Breakdown**: By source (bookings, orders, tickets, facility rentals)
- **Platform Fee Summary**: Total fees paid to platform
- **Revenue Share Summary**: For roles with revenue sharing (experience organizers)
- **Tax Report**: Aggregated income for tax filing
- **Export**: CSV, PDF download (mock)

#### Finance Management (`/dashboard/finance/management`)
- **Bank Account Management**: Add/edit/verify bank accounts
- **Withdrawal Request**: Amount, bank account selection, processing
- **Withdrawal History**: Status tracking (pending → processing → completed → failed)
- **Settlement Calendar**: When pending amounts become available
- **Platform Fee History**: All platform fees deducted
- **Invoice History**: Downloadable invoices per transaction

#### Shared Types
```typescript
interface WithdrawalRequest {
  id: string;
  partnerId: string;
  bankAccountId: string;
  amount: number;
  status: "pending" | "processing" | "completed" | "failed" | "cancelled";
  requestedAt: string;
  processedAt?: string;
  failureReason?: string;
  transactionRef?: string;
}

interface BankAccount {
  id: string;
  partnerId: string;
  holderName: string;
  bankName: string;
  accountNumber: string;
  branch?: string;
  isVerified: boolean;
  isPrimary: boolean;
  verifiedAt?: string;
  createdAt: string;
}
```

**Technical Docs**: Finance data model, withdrawal processing flow, report generation.  
**Manual Guide**: Managing bank accounts, requesting withdrawals, reading financial reports.

---

### 3.4 Notification System Enhancement

**Existing**: Basic notification store with demo notifications  
**Enhanced**: Comprehensive role-based notification system.

#### Notification Types per Role

| Role | Notification Types |
|------|-------------------|
| VILLAGE_ADMIN | new_partner_application, partner_approved, new_coordination_request, facility_rental_request, new_review, revenue_settlement |
| ACCOMMODATION | new_reservation, reservation_confirmed, reservation_cancelled, new_review, payment_received, withdrawal_processed, low_occupancy_alert |
| UMKM | new_order, order_paid, pickup_reminder, new_review, low_stock_alert, payment_received, withdrawal_processed |
| EVENT_ORGANIZER | coordination_status_change, new_booking, booking_cancelled, new_review, payment_milestone, revenue_settlement, ticket_sold_out |
| ALL | system_announcement, account_verification, password_changed |

#### Enhanced Features
- **Notification Preferences**: Toggle on/off per notification type
- **Email Notifications**: Mock email sending alongside in-app
- **Priority Levels**: urgent (red), info (blue), success (green), warning (amber)
- **Action Links**: Click notification to navigate to relevant page
- **Notification Grouping**: Group similar notifications (e.g., "5 new reviews")
- **Mark As Read**: Individual and bulk actions
- **Clear All**: Clear all read notifications

**Technical Docs**: Notification model, trigger conditions, preference storage.  
**Manual Guide**: Managing notification preferences, understanding notification types.

---

### 3.5 Chat System Enhancement (`/dashboard/chat`)

**Existing**: Mock chat with static conversations  
**Enhanced**: Role-aware chat channels.

#### Chat Channels
| Channel Type | Participants | Purpose |
|-------------|-------------|---------|
| Village ↔ Partner | VILLAGE_ADMIN + any partner | Coordination, verification |
| Organizer ↔ Village | EVENT_ORGANIZER + VILLAGE_ADMIN | Experience coordination |
| Support | Any role + Platform support | Technical issues |

#### Enhanced Features
- **Channel List**: Organized by type, sorted by last message
- **Unread Indicators**: Badge count per channel
- **Message Types**: Text, image (mock), document attachment (mock)
- **Typing Indicator**: Mock real-time indicators
- **Message Search**: Search within conversations
- **Pin Messages**: Pin important messages per channel
- **Online Status**: Show user availability

**Technical Docs**: Chat model, channel types, message schema.  
**Manual Guide**: Starting conversations, managing chat channels.

---

### 3.6 i18n Completion — Hardcoded String Migration

**Issue**: ~100+ hardcoded Indonesian strings found across dashboard pages.

#### Files with Hardcoded Strings (prioritized)

| Priority | File | Hardcoded Strings Count | Example Strings |
|----------|------|------------------------|-----------------|
| HIGH | sidebar.tsx | 8 | "Dashboard Penginapan", "Ajukan Penginapan", "Keuangan" |
| HIGH | penginapan/page.tsx | 15+ | "Pendapatan Bulan Ini", "Kamar Terisi", "Total Reservasi" |
| HIGH | pengelola-desa/page.tsx | 10+ | "Kelola pendaftaran mitra baru" |
| HIGH | approval/page.tsx | 12+ | "Menunggu", "Disetujui", "Ditolak", "Detail Pengajuan" |
| MEDIUM | umkm/page.tsx | 10+ | "Stok Menipis", "Dipublish", "Draft" |
| MEDIUM | produk/page.tsx | 8+ | "Cari produk...", "Tambah Produk" |
| MEDIUM | stok/page.tsx | 8+ | "Manajemen Stok", "Produk Perlu Restok" |
| MEDIUM | event-organizer/*.tsx | 10+ | "Buka", "Penuh", "Ditutup", "Selesai" |
| MEDIUM | keuangan/*.tsx | 12+ | "Laporan Keuangan", "Saldo Siap Withdraw" |
| MEDIUM | kamar/page.tsx | 10+ | "Manajemen Kamar", "Filter Kamar" |
| MEDIUM | reservasi/page.tsx | 10+ | "Reservasi Penginapan", "Filter Reservasi" |
| LOW | pengaturan/page.tsx | 15+ | All tab labels, field labels |
| LOW | chat/page.tsx | 10+ | All chat UI labels |

#### Migration Strategy
1. Identify all hardcoded strings per file
2. Create translation keys following existing naming convention
3. Add keys to all 3 locale files (id.json, en.json, ja.json)
4. Replace hardcoded strings with `t("key")` calls
5. Verify all locales render correctly

#### New i18n Key Categories Needed
```json
{
  "sidebar": { ... },
  "villageAdmin": { ... },
  "accommodation": { ... },
  "sme": { ... },
  "experience": { ... },
  "finance": { ... },
  "settings": { ... },
  "chat": { ... }
}
```

**Technical Docs**: i18n key naming convention, translation workflow, locale testing.  
**Manual Guide**: N/A (developer-facing task).

---

### 3.7 Account Settings Enhancement (`/dashboard/settings`)

**Existing**: Tabbed settings (profile, security, notifications, language, privacy)  
**Enhanced**: Role-specific settings + multi-admin.

#### Enhanced Tabs
| Tab | Features | New? |
|-----|----------|------|
| Profile | Personal info, avatar upload | Enhance |
| Security | Password change, 2FA toggle (future), login history | Enhance |
| Notifications | Per-type notification preferences | **NEW** |
| Organization | Business profile, logo, description | **NEW** |
| Bank Account | Primary/secondary accounts, verification | **NEW** |
| Admin Management | Add/remove admin users per organization | **NEW** |
| Language & Region | Locale, timezone, currency format | Enhance |
| Privacy | Data visibility, analytics opt-out | Keep |

#### Multi-Admin Model
```typescript
interface OrganizationAdmin {
  id: string;
  userId: string;
  organizationId: string;
  role: "owner" | "admin" | "viewer";
  permissions: string[];
  invitedBy: string;
  status: "active" | "invited" | "deactivated";
  createdAt: string;
}
```

**Technical Docs**: Settings model, multi-admin permission matrix, bank account verification.  
**Manual Guide**: Managing your profile, adding team members, setting up bank account.

---

### 3.8 Shared Review System

**Existing**: Review type supports product/accommodation/event targets  
**Enhanced**: Unified review management with response capability.

#### Enhanced Review Model
```typescript
interface Review {
  id: string;
  reviewerName: string;
  reviewerEmail?: string;
  targetId: string;
  targetType: "product" | "accommodation" | "experience" | "village" | "sme_store";
  rating: number;          // 1-5
  title?: string;          // Review title
  comment: string;
  pros?: string;           // What they liked
  cons?: string;           // What could improve
  images?: string[];
  isVerifiedPurchase: boolean;
  response?: {
    text: string;
    respondedBy: string;
    respondedAt: string;
  };
  isFlagged: boolean;
  flagReason?: string;
  helpfulCount: number;
  createdAt: string;
  updatedAt?: string;
}
```

**Technical Docs**: Review types, response model, moderation workflow, rating aggregation.  
**Manual Guide**: N/A (covered in each role's MANUAL.md).

---

## 4. Documentation Standards

Every feature module MUST include:

### README.md (Technical Documentation) Template
```markdown
# [Feature Name] — Technical Documentation

## Overview
Brief description of what this feature does.

## Architecture
- Component hierarchy diagram
- Data flow description
- State management patterns

## Data Model
- TypeScript types/interfaces
- Relationships between entities
- Validation rules (Zod schemas)

## Components
| Component | Purpose | Props |
|-----------|---------|-------|
| ComponentName | Description | Prop types |

## API Contracts (Future)
- Endpoints that will be needed
- Request/response shapes
- Error handling patterns

## Dependencies
- External packages used
- Internal module dependencies

## Configuration
- Environment variables
- Constants and their purposes
```

### MANUAL.md (User Guide) Template
```markdown
# [Feature Name] — User Guide

## Overview
What this feature helps you accomplish.

## Getting Started
Step-by-step initial setup instructions.

## Feature Walkthrough

### [Sub-feature 1]
1. Step 1...
2. Step 2...
> 💡 Tip: Helpful advice

### [Sub-feature 2]
1. Step 1...

## FAQ
**Q: Common question?**
A: Answer...

## Troubleshooting
| Issue | Solution |
|-------|---------|
| Description | Fix |

## Role Access
Which roles can access this feature and what they can do.
```

---

## 5. Files to Create / Modify

### New Shared Feature Files
```
src/features/shared/
├── README.md                       (NEW)
├── MANUAL.md                       (NEW)
├── payment/
│   ├── types.ts                    (NEW)
│   ├── constants.ts                (NEW)
│   ├── mock-gateway.ts             (NEW)
│   └── utils.ts                    (NEW)
├── revenue-sharing/
│   ├── types.ts                    (NEW)
│   ├── constants.ts                (NEW)
│   └── utils.ts                    (NEW)
└── notifications/
    ├── types.ts                    (NEW)
    └── constants.ts                (NEW)
```

### Modified Files
- `src/stores/notification-store.ts` — Enhanced notification types and preferences
- `src/types/index.ts` — Add shared types (Payment, Refund, WithdrawalRequest, BankAccount, etc.)
- `messages/en.json`, `messages/id.json`, `messages/ja.json` — All new translation keys
- `src/app/[locale]/dashboard/chat/page.tsx` — Enhanced chat UI
- `src/app/[locale]/dashboard/settings/page.tsx` — Additional settings tabs
- `src/app/[locale]/dashboard/finance/*.tsx` — Role-aware finance pages

---

## 6. Acceptance Criteria

### Payment & Monetization
- [ ] Payment gateway mock processes all transaction types _(deferred — backend scope)_
- [ ] Refund engine handles full and partial refunds _(deferred — backend scope)_
- [ ] Cancellation policies configurable per partner _(deferred — backend scope)_

### Revenue Sharing
- [ ] Default splits configured per transaction type _(deferred — backend scope)_
- [ ] Negotiable splits for external experience organizers _(deferred — backend scope)_
- [ ] Settlement schedule implemented (T+7 default) _(deferred — backend scope)_

### Finance Module
- [x] Role-aware financial dashboards
- [x] Bank account CRUD with verification flow
- [x] Withdrawal request and tracking
- [x] Financial reports with export capability (mock)

### Notifications
- [x] Role-based notification types implemented
- [x] Notification preferences per type
- [x] Action links from notifications to relevant pages

### Chat
- [x] Role-aware chat channels
- [x] Unread indicators and message search

### i18n
- [x] Zero hardcoded Indonesian strings in dashboard pages
- [x] All 3 locale files complete and consistent
- [x] New keys follow existing naming convention

### Settings
- [x] Multi-admin management per organization
- [x] Bank account management in settings
- [x] Enhanced notification preferences

---

## 7. Progress Update

### 2026-04-11 Implementation Slice

Completed in this pass:
- Enhanced [dashboard settings](src/app/[locale]/dashboard/settings/page.tsx) with organization and admin-management tabs, plus shared notification preference controls.
- Localized [chat page](src/app/[locale]/dashboard/chat/page.tsx) and [finance overview](src/app/[locale]/dashboard/finance/page.tsx) using `next-intl` keys.
- Added and aligned translation keys in [messages/en.json](messages/en.json), [messages/id.json](messages/id.json), and [messages/ja.json](messages/ja.json).
- Extended shared notification infrastructure in [src/stores/notification-store.ts](src/stores/notification-store.ts), [src/features/shared/notifications/constants.ts](src/features/shared/notifications/constants.ts), and [src/features/shared/notifications/types.ts](src/features/shared/notifications/types.ts).

Build evidence:
- Command: `npm run build`
- Date: 2026-04-11
- Result: success
- Verification summary: Next.js production build compiled successfully, linting and type validation passed, and static page generation completed without errors.

Remaining in ISSUE-011:
- Bank account CRUD and verification flow.
- Withdrawal workflow and financial export mock.
- Chat unread/search enhancements.
- Full hardcoded-string cleanup across all remaining dashboard modules.
- Shared feature README/MANUAL completion where still missing.

### Documentation
- [ ] Every feature module has README.md (technical) _(deferred — documentation sprint)_
- [ ] Every feature module has MANUAL.md (user guide) _(deferred — documentation sprint)_
- [ ] Documentation follows the template standards defined above _(deferred — documentation sprint)_
