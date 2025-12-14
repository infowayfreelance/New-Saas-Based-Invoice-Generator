# Stripe Integration Setup

This application uses Stripe for subscription billing. Follow these steps to set up Stripe:

## 1. Create Stripe Products and Prices

You need to create three subscription products in your Stripe dashboard:

### Basic Plan - $5/month
1. Go to [Stripe Dashboard → Products](https://dashboard.stripe.com/products)
2. Click "Add product"
3. Name: **Basic Plan**
4. Price: **$5.00 USD** / month (recurring)
5. After creating, copy the **Price ID** (starts with `price_`)

### Standard Plan - $12/month
1. Create another product
2. Name: **Standard Plan**
3. Price: **$12.00 USD** / month (recurring)
4. Copy the **Price ID**

### Pro Plan - $29.99/month
1. Create another product
2. Name: **Pro Plan**
3. Price: **$29.99 USD** / month (recurring)
4. Copy the **Price ID**

## 2. Add Environment Variables

Add these environment variables to your Vercel project or `.env.local`:

\`\`\`bash
# Stripe API Keys (already configured)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Stripe Price IDs (ADD THESE)
STRIPE_PRICE_ID_BASIC=price_xxxxxxxxxxxxx
STRIPE_PRICE_ID_STANDARD=price_xxxxxxxxxxxxx
STRIPE_PRICE_ID_PRO=price_xxxxxxxxxxxxx

# Stripe Webhook Secret (for production)
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
\`\`\`

## 3. Set Up Webhook (for production)

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the **Signing secret** and add it as `STRIPE_WEBHOOK_SECRET`

## 4. Test the Integration

1. Use Stripe test mode for development
2. Test card: `4242 4242 4242 4242`
3. Any future expiry date
4. Any 3-digit CVC

## Note

The Guest plan is free and doesn't require Stripe. Users are automatically assigned the Guest plan when they sign up.
