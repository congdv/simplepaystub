# Credit-Based Monetization Plan

## Context

simplepaystub.com is a free paystub generator. The `next/payment` branch adds monetization via a **credit-based** system — users buy credit packs and spend credits on premium actions. No recurring subscriptions.

**All current free features stay free**: preview, PDF download, email sending (attachment), both templates (Nova & Mono), paystub history.

**Credits unlock premium actions:**
- Auto Tax — auto-fill payroll contributions (US FICA, Canada CPP/EI) — **1 credit per use**
- Batch Generate — bulk generation from CSV — **1 credit per paystub generated**

**Deferred (revisit later):**
- Secure email with expiring links (replace attachment email with signed storage URLs)
- Premium templates

---

## Credit Packs (Stripe one-time payments)

| Pack | Credits | Price | Per credit |
|------|---------|-------|------------|
| Starter | 5 | $4.99 | $1.00 |
| Value | 20 | $14.99 | $0.75 |
| Pro | 50 | $29.99 | $0.60 |

New users receive **3 free credits** on first sign-in.

---

## Phase 1: Foundation

### 1.1 Database migration
- **New**: `db/migrations/YYYYMMDD_create_credits.sql`
- Table `credits`: `id`, `user_id`, `balance` (int, default 0), `created_at`, `updated_at`
- Table `credit_transactions`: `id`, `user_id`, `amount` (positive = top-up, negative = spend), `action` (e.g. `auto_tax`, `batch_generate`, `purchase`, `signup_bonus`), `stripe_payment_intent_id` (nullable), `created_at`
- Unique index on `credits.user_id`
- RLS: users read own row; service_role manages all

### 1.2 Stripe server client
- **Existing**: `src/lib/stripe.ts` — singleton `stripe` instance (already done)

### 1.3 Credits helpers
- **New**: `src/lib/credits.ts`
  - `getCredits(userId)` — returns current balance from `credits` table
  - `deductCredit(userId, action)` — deducts 1 credit, inserts transaction row; throws if balance < 1
  - `addCredits(userId, amount, action, paymentIntentId?)` — adds credits, inserts transaction row

### 1.4 Credits status API
- **New**: `src/app/api/credits/status/route.ts` — auth required, returns `{ balance: number }`

### 1.5 Client-side credits hook
- **New**: `src/hooks/use-credits.ts` — fetches `/api/credits/status`, returns `{ balance, isLoading, refresh }`

---

## Phase 2: Purchase Flow

### 2.1 Checkout session endpoint
- **New**: `src/app/api/credits/checkout/route.ts`
- Auth required. Accepts `{ packId: 'starter' | 'value' | 'pro' }`. Creates Stripe Checkout Session (`mode: 'payment'`). Returns `{ url }`.

### 2.2 Webhook handler
- **New** (or update existing): `src/app/api/stripe/webhook/route.ts`
- Events handled:
  - `checkout.session.completed` (mode=payment) — call `addCredits` with pack amount
- Keep existing subscription events removed (no subscriptions in new model)

### 2.3 Signup bonus
- **Modify**: auth callback or user creation flow — call `addCredits(userId, 3, 'signup_bonus')` on first sign-in

---

## Phase 3: Pricing Page

### 3.1 Pricing page
- **Modify**: `src/app/(landing)/pricing/page.tsx`
- Show credit pack cards (Starter / Value / Pro) with prices and credit amounts
- Remove monthly/annual subscription toggle
- CTA buttons call `/api/credits/checkout`. If not logged in, redirect to sign-up.

---

## Phase 4: Credit Gates

> **No changes to download or email flows — they remain fully free.**

### 4.1 Upgrade modal
- **Modify**: `src/components/upgrade-modal.tsx`
- Update copy to reference credits instead of Pro plan
- Show current balance if user is signed in
- CTA links to `/pricing` (credit packs)

### 4.2 Credit deduction API
- **New**: `src/app/api/credits/deduct/route.ts`
- Auth required. Accepts `{ action: 'auto_tax' | 'batch_generate' }`. Calls `deductCredit`. Returns `{ balance: number }`.

### 4.3 Auto Tax gate
- **Modify**: `src/components/paystub-form.tsx`
- Replace `isPro` check with `balance > 0` check from `useCredits`
- On click: call `/api/credits/deduct`, then run auto-tax logic on success
- On insufficient credits: show upgrade modal

### 4.4 Batch Generate gate
- **Modify**: `src/components/paystub-form.tsx`
- On batch submit: deduct 1 credit per paystub via `/api/credits/deduct` before generating each
- On insufficient credits mid-batch: stop and inform user

---

## Phase 5: Account Integration

### 5.1 Credits display on account page
- **Modify**: `src/app/(protected)/account/page.tsx`
- Show current credit balance
- "Buy more credits" button → navigates to `/pricing`
- Show recent credit transaction history

### 5.2 Remove subscription UI
- Remove plan/status/renewal date display
- Remove "Manage Subscription" portal button
- Remove `useSubscription` hook usage

---

## Environment Variables

```
STRIPE_SECRET_KEY=sk_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_CREDITS_STARTER_PRICE_ID=price_...   # $4.99 / 5 credits
NEXT_PUBLIC_STRIPE_CREDITS_VALUE_PRICE_ID=price_...     # $14.99 / 20 credits
NEXT_PUBLIC_STRIPE_CREDITS_PRO_PRICE_ID=price_...       # $29.99 / 50 credits
```

**Stripe Dashboard setup:**
1. Create product "SimplePaystub Credits" with three one-time prices ($4.99, $14.99, $29.99)
2. Note the three Price IDs
3. Create webhook endpoint at `https://simplepaystub.com/api/stripe/webhook` listening for: `checkout.session.completed`

---

## Files Changed

### Modified
| File | Change |
|------|--------|
| `src/app/(landing)/pricing/page.tsx` | Credit packs UI, remove subscription toggle |
| `src/components/upgrade-modal.tsx` | Credit-based copy and CTA |
| `src/components/paystub-form.tsx` | Replace `isPro` gates with credit balance checks |
| `src/app/api/stripe/webhook/route.ts` | Handle `checkout.session.completed` for one-time payments |
| `src/app/(protected)/account/page.tsx` | Show credit balance + transaction history, remove subscription UI |

### New
| File | Purpose |
|------|---------|
| `src/lib/credits.ts` | Server-side credit helpers (get, deduct, add) |
| `src/hooks/use-credits.ts` | Client-side credits hook |
| `src/app/api/credits/status/route.ts` | Get current user's credit balance |
| `src/app/api/credits/checkout/route.ts` | Create Stripe Checkout Session for credit pack |
| `src/app/api/credits/deduct/route.ts` | Deduct 1 credit for a premium action |
| `db/migrations/YYYYMMDD_create_credits.sql` | Credits + credit_transactions tables |

### Removed / Superseded
| File | Reason |
|------|--------|
| `src/lib/subscription.ts` | No subscriptions in new model |
| `src/hooks/use-subscription.ts` | Replaced by `use-credits.ts` |
| `src/app/api/stripe/status/route.ts` | Replaced by `/api/credits/status` |
| `src/app/api/stripe/checkout/route.ts` | Replaced by `/api/credits/checkout` |
| `src/app/api/stripe/portal/route.ts` | No portal needed (no subscriptions) |

---

## Verification

1. **Local webhooks**: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
2. **Purchase flow**: Sign in → `/pricing` → buy Starter pack → test card `4242 4242 4242 4242` → verify redirect back + balance = 5
3. **Signup bonus**: New user signs in → verify balance = 3
4. **Auto Tax gate**: With 0 credits, click Auto Tax → upgrade modal. With credits → deducts 1, runs calculation.
5. **Batch Generate gate**: Upload CSV with 3 paystubs, 2 credits remaining → generates 2, stops with insufficient credit message.
6. **Free features**: Download PDF and send email as any user — no credit check, no prompts.
7. **Account page**: Verify balance and transaction history shown correctly.
