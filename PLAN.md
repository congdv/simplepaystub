# Stripe Pricing & Paywall Integration Plan

## Context

simplepaystub.com is currently a free paystub generator with no monetization. The `next/payment` branch was created to add payment features. This plan implements Stripe subscription billing with free/pro tiers.

**All current features remain free**: preview, PDF download, email sending, both templates, history.

**Pro tier unlocks new features** (to be built in subsequent work):
- Auto tax calculations (federal, FICA, state)
- Bulk/batch generation (CSV upload)
- Premium templates (beyond Nova and Mono)
- Secure email delivery (expiring links, portal inboxes)

This phase builds the billing infrastructure (Stripe Checkout, webhooks, subscription tracking, pricing page) and adds Pro entry points (upgrade modal, locked feature buttons) for the new Pro features.

---

## Phase 1: Foundation

### 1.1 Install Stripe
- `npm install stripe`

### 1.2 Stripe server client
- **New**: `src/lib/stripe.ts` — singleton `stripe` instance using `STRIPE_SECRET_KEY`

### 1.3 Database migration
- **New**: `supabase/migrations/003_create_subscriptions.sql`
- Table `subscriptions`: `id`, `user_id` (FK → auth.users), `stripe_customer_id`, `stripe_subscription_id`, `status` (active/trialing/past_due/canceled/inactive/unpaid), `plan` (free/pro), `price_id`, `interval` (month/year), `current_period_start`, `current_period_end`, `cancel_at_period_end`, `created_at`, `updated_at`
- Unique indexes on `user_id` and `stripe_customer_id`
- RLS: users read own row, service_role manages all
- Reuse `update_updated_at_column()` trigger already defined in `supabase/migrations/001_create_daily_stats.sql`

### 1.4 Subscription helpers
- **New**: `src/lib/subscription.ts`
  - `getSubscription(userId)` — queries subscriptions table via `pg` Pool (same pattern as `src/lib/supabase/admin.ts`)
  - `isProUser(subscription)` — returns `true` if status is `active` or `trialing`
  - `checkProAccess(userId)` — combines both

### 1.5 Subscription status API route
- **New**: `src/app/api/stripe/status/route.ts` — auth required, returns `{ isPro, subscription }` for current user

### 1.6 Client-side subscription hook
- **New**: `src/hooks/use-subscription.ts` — fetches `/api/stripe/status`, returns `{ isPro, isLoading, subscription }`

---

## Phase 2: Payment Flow

### 2.1 Checkout session endpoint
- **New**: `src/app/api/stripe/checkout/route.ts`
- Auth required. Accepts `{ priceId }`. Looks up or creates Stripe customer linked to Supabase user. Creates Checkout Session with `client_reference_id = user.id`. Returns `{ url }`.

### 2.2 Customer portal endpoint
- **New**: `src/app/api/stripe/portal/route.ts`
- Auth required. Looks up `stripe_customer_id` from DB. Creates Stripe billing portal session. Returns `{ url }`.

### 2.3 Webhook handler
- **New**: `src/app/api/stripe/webhook/route.ts`
- No auth — verified via Stripe signature (`stripe.webhooks.constructEvent`)
- Uses `pg` Pool (same pattern as `admin.ts`) for DB writes, bypassing RLS
- Events handled:
  - `checkout.session.completed` — upsert subscription row, link `stripe_customer_id` → `user_id` via `client_reference_id`
  - `customer.subscription.created` / `updated` — sync status, plan, dates
  - `customer.subscription.deleted` — set `status=canceled`, `plan=free`
  - `invoice.payment_failed` — set `status=past_due`

---

## Phase 3: Pricing Page

### 3.1 Route setup
- **Modify**: `src/paths.ts` — add `pricing: '/pricing'`
- **Modify**: `src/lib/supabase/middleware.ts` — add `paths.pricing` to `PUBLIC_PATHS`

### 3.2 Pricing page
- **New**: `src/app/(landing)/pricing/page.tsx`
- Two-column comparison: Free vs Pro
- Free tier: All current features (preview, download, email, 2 templates)
- Pro tier: Auto tax calculations, batch generation, premium templates, secure delivery
- Monthly ($9.99) and Annual ($79.99) toggle
- CTA buttons call `/api/stripe/checkout`. If not logged in, redirect to sign-up with return URL.

### 3.3 Navigation
- **Modify**: `src/components/header.tsx` — add "Pricing" `<Link>` between logo and `<UserButton />`

---

## Phase 4: Pro Entry Points

> **No changes to existing download or email flows — they remain fully free.**

### 4.1 Upgrade modal
- **New**: `src/components/upgrade-modal.tsx` — shown when a free user clicks a Pro feature. CTA links to `/pricing`.

### 4.2 Pro feature placeholders
- Add locked Pro feature buttons in the UI (e.g., "Auto Tax", "Batch Generate") that:
  - Show `UpgradeModal` when clicked by a free user
  - Are enabled (functional) for Pro users
- These are placeholder entry points; the actual feature logic comes in later work.

### 4.3 Wire up subscription in hooks
- **Modify**: `src/hooks/use-paystub-actions.ts` — add `isPro: boolean` and `setShowUpgradeModal: (show: boolean) => void` to `UsePaystubActionsProps` for use by Pro feature actions

---

## Phase 5: Account Integration

### 5.1 Subscription info on account page
- **Modify**: `src/app/(protected)/account/page.tsx`
  - Show current plan (Free/Pro), status, renewal date
  - "Manage Subscription" button → calls `/api/stripe/portal` and redirects
  - "Upgrade to Pro" button for free users → navigates to `/pricing`

### 5.2 Pro badge
- **New**: `src/components/pro-badge.tsx` — small "PRO" badge shown in header/account for subscribed users

---

## Environment Variables

Add to `.env.local` and Vercel:

```
STRIPE_SECRET_KEY=sk_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_MONTHLY_PRICE_ID=price_...
STRIPE_PRO_ANNUAL_PRICE_ID=price_...
```

**Stripe Dashboard setup required before running:**
1. Create product "SimplePaystub Pro" with monthly ($9.99) and annual ($79.99) prices
2. Note the two Price IDs
3. Configure Customer Portal (allow cancel, plan switch, payment method update; return URL: `/account`)
4. Create webhook endpoint at `https://simplepaystub.com/api/stripe/webhook` listening for: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`

---

## Files Changed

### Modified
| File | Change |
|------|--------|
| `src/paths.ts` | Add `pricing` path |
| `src/lib/supabase/middleware.ts` | Add `paths.pricing` to `PUBLIC_PATHS` |
| `src/components/header.tsx` | Add Pricing nav link |
| `src/hooks/use-paystub-actions.ts` | Add `isPro` + `setShowUpgradeModal` props |
| `src/lib/commands/paystub-actions.ts` | Add `isPro` + `setShowUpgradeModal` to `PaystubActionDependencies` |
| `src/app/(protected)/account/page.tsx` | Subscription info + portal/upgrade buttons |

> `src/app/api/generate/route.ts` and `src/app/api/send-email/route.ts` are **not changed**.

### New
| File | Purpose |
|------|---------|
| `src/lib/stripe.ts` | Stripe client singleton |
| `src/lib/subscription.ts` | Server-side subscription helpers |
| `src/hooks/use-subscription.ts` | Client-side subscription hook |
| `src/app/api/stripe/status/route.ts` | Get current user's subscription status |
| `src/app/api/stripe/checkout/route.ts` | Create Stripe Checkout Session |
| `src/app/api/stripe/portal/route.ts` | Create Stripe Customer Portal Session |
| `src/app/api/stripe/webhook/route.ts` | Stripe webhook handler |
| `src/app/(landing)/pricing/page.tsx` | Public pricing page |
| `src/components/upgrade-modal.tsx` | Upgrade prompt modal |
| `src/components/pro-badge.tsx` | Pro badge component |
| `supabase/migrations/003_create_subscriptions.sql` | Subscriptions table |

---

## Verification

1. **Local webhooks**: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
2. **Checkout flow**: Sign up → `/pricing` → Subscribe → test card `4242 4242 4242 4242` → verify redirect back + `subscriptions` row created with `status=active`
3. **Free features**: As any user, download PDF and send email — both work with no prompts or restrictions
4. **Pro entry points**: As free user, click "Auto Tax" or "Batch Generate" → verify upgrade modal. As Pro user → verify button is enabled.
5. **Account page**: Verify plan, status, renewal date shown. "Manage Subscription" opens Stripe portal.
6. **Cancellation**: Cancel in portal → webhook fires → DB sets `cancel_at_period_end=true`
