# TRIPMADLY DEPLOYMENT & SETUP GUIDE

## 1. SUPABASE SETUP
1. Create a new project on [Supabase](https://supabase.com).
2. Go to **SQL Editor** and paste the contents of `supabase_schema.sql`.
3. Go to **Project Settings > API** to get your `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`.

## 2. STRAPI BACKEND (RAILWAY)
1. Create a new Strapi project locally or use the Railway Strapi template.
2. Install dependencies: `npm install razorpay @supabase/supabase-js crypto`.
3. Add the logic from `strapi_razorpay_service.js` to `src/api/subscription/services/razorpay.js`.
4. Add the logic from `strapi_cron.js` to `config/cron.js`.
5. Deploy to [Railway](https://railway.app).
6. Set Environment Variables in Railway:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
   - `RAZORPAY_WEBHOOK_SECRET`
   - `RAZORPAY_MONTHLY_PLAN_ID`
   - `RAZORPAY_YEARLY_PLAN_ID`

## 3. RAZORPAY SETUP
1. Create a [Razorpay](https://razorpay.com) account.
2. Create two **Subscription Plans**:
   - Monthly: ₹99
   - Yearly: ₹999
3. Go to **Settings > Webhooks** and add your Strapi endpoint: `https://your-strapi-url.railway.app/api/razorpay/webhook`.
4. Select events: `subscription.activated`, `subscription.charged`, `subscription.cancelled`, `subscription.completed`, `payment.failed`.

## 4. FRONTEND DEPLOYMENT (VPS)
1. Point your domain to your VPS IP.
2. Install Node.js and PM2 on your VPS.
3. Clone your repository.
4. Create `.env.local` with:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_STRAPI_URL`
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID`
5. Run `npm install`, `npm run build`, and `pm2 start npm --name "tripmadly" -- start`.

## 5. CMS CONTENT (STRAPI)
Create the following Collection Types in Strapi:
- **Holidays**: name, duration, price, inclusions, image, affiliate_link.
- **Hotels**: name, rating, price_per_night, description, image, affiliate_link.
- **Blogs**: title, content, slug, author, image.
- **Global**: about_us, contact_email, social_links.
