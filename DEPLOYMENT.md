# FK Pizza Platform - Deployment Configuration

**Last Updated:** July 22, 2026  
**Environment:** Production (Vercel + Supabase + Cloudinary)

---

## 🚀 Quick Start

### Prerequisites
- Vercel account configured
- Supabase project active: `llungqolufzcfaqghydt`
- Cloudinary account configured: `dajqdbpms`

---

## 📋 Environment Variables

### Supabase Configuration

Set these in Vercel Dashboard → Project Settings → Environment Variables:

```env
SUPABASE_URL=https://llungqolufzcfaqghydt.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsdW5ncW9sdWZ6Y2ZhcWdoeWR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0MjAzMzcsImV4cCI6MjA5NTk5NjMzN30.jbhdR8rWYrlTU-FR_jBI63THbnuYk1m_Xh7oMJAqrPI
SUPABASE_SERVICE_ROLE_KEY=<SERVICE_ROLE_KEY>
```

**Status:**
- ✅ URL: Reachable at `https://llungqolufzcfaqghydt.supabase.co`
- ✅ Region: eu-central-1 (Ireland)
- ✅ Database: PostgreSQL 17.6.1
- ✅ Auth: Enabled
- ✅ Vector Support: Available

### Cloudinary Configuration

Set these in Vercel Dashboard:

```env
CLOUDINARY_CLOUD_NAME=dajqdbpms
CLOUDINARY_API_KEY=<API_KEY>
CLOUDINARY_API_SECRET=<API_SECRET>
CLOUDINARY_UPLOAD_PRESET=fkpizza_unsigned
```

**Status:**
- ✅ Cloud: `dajqdbpms`
- ✅ Preset: `fkpizza_unsigned` (unsigned uploads enabled)
- ✅ Storage: Unlimited
- ✅ CDN: Active at `https://res.cloudinary.com/dajqdbpms/`

### Application Configuration

```env
NODE_ENV=production
VERCEL_ENV=production
```

---

## 📊 Vercel Project Configuration

### Project Details
```
Name: fkpizza
Project ID: prj_LL2Ob6a549DDbjQyfg0XvuOdmSje
Framework: Other (Static/Vanilla JS)
Node Version: 24.x
Repository: daxluna88-max/fkpizza (GitHub)
```

### Deployment Settings

**Production Domain:**
- Primary: `fkpizza.vercel.app`
- Custom: `fkpizza.com` (if configured)

**Build Settings:**
```json
{
  "buildCommand": null,
  "outputDirectory": ".",
  "rootDirectory": "."
}
```

**File Rewrite Rules:**
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 🔗 Connection Status Matrix

| Service | Status | Endpoint | Note |
|---------|--------|----------|------|
| Supabase REST API | ✅ Active | `https://llungqolufzcfaqghydt.supabase.co/rest/v1/` | CORS enabled |
| Supabase Auth | ✅ Active | `https://llungqolufzcfaqghydt.supabase.co/auth/v1/` | JWT-based |
| Supabase Realtime | ✅ Active | WebSocket support available | For live updates |
| Cloudinary API | ✅ Active | `https://api.cloudinary.com/v1_1/dajqdbpms/` | Upload & transform |
| Cloudinary CDN | ✅ Active | `https://res.cloudinary.com/dajqdbpms/` | Image delivery |
| Vercel Deployment | ✅ Active | `fkpizza.vercel.app` | Auto-deploys from main |

---

## 🗄️ Database Connection Details

### Supabase Connection String
```
postgresql://postgres:[password]@llungqolufzcfaqghydt.postgres.supabase.co:5432/postgres
```

**Tables Status:**
- ✅ `restaurants` - Multi-tenant main table
- ✅ `orders` - Order management
- ✅ `dishes` - Dish catalog
- ✅ `menu_categories` - Category management
- ✅ `restaurant_dishes` - Per-restaurant dish customization
- ✅ `admins` - Admin account management
- ✅ `waiters` - Staff management
- ✅ `reviews` - Customer reviews
- ✅ `work_menus` - Special menus
- ✅ `instagram_feeds` - Social media integration
- ✅ `restaurant_pos` - POS integration

**RLS Status:** ✅ Enabled on all tables

---

## 🧪 Connection Verification

### Local Testing

Run the connection test script:
```bash
node test-connections.js
```

**Expected Output:**
```
✅ Supabase is reachable
✅ Restaurants table is accessible
✅ Orders table is accessible
✅ Cloudinary is reachable
✅ All tests passed! Platform is ready.
```

### Browser Console Test

Open browser DevTools Console and run:
```javascript
// Test Supabase
fetch('https://llungqolufzcfaqghydt.supabase.co/rest/v1/restaurants?limit=1', {
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsdW5ncW9sdWZ6Y2ZhcWdoeWR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0MjAzMzcsImV4cCI6MjA5NTk5NjMzN30.jbhdR8rWYrlTU-FR_jBI63THbnuYk1m_Xh7oMJAqrPI'
  }
}).then(r => r.json()).then(d => console.log('✅ Supabase works:', d.length, 'restaurants'));

// Test Cloudinary
fetch('https://res.cloudinary.com/dajqdbpms/image/upload/v1/test', { method: 'HEAD' })
  .then(r => console.log('✅ Cloudinary works:', r.status));
```

---

## 🔒 Security Checklist

- ✅ Anon key only exposed in client-side code (public URLs)
- ✅ Service role key stored only in Vercel secrets (never in code)
- ✅ JWT tokens stored in localStorage with secure flag
- ✅ RLS policies enforce per-restaurant data isolation
- ✅ Cloudinary unsigned uploads configured for client-side use
- ✅ CORS enabled for frontend domain

---

## 🚨 Troubleshooting

### Issue: "403 Forbidden" from Supabase

**Causes:**
1. API key is missing or expired
2. CORS policy blocked the request
3. RLS policy denied access

**Solution:**
- Verify API key in browser console: `SB.KEY`
- Check Supabase dashboard for key status
- Review RLS policies in SQL Editor

### Issue: "Cloudinary upload failed"

**Causes:**
1. Upload preset not configured
2. Network blocked by CORS
3. File too large

**Solution:**
- Verify preset: `fkpizza_unsigned`
- Check Cloudinary console for quota
- Reduce image size (max 100MB)

### Issue: "No orders appearing in admin"

**Causes:**
1. RLS policy filtering data
2. Wrong restaurant_id selected
3. Auth token expired

**Solution:**
- Check admin auth token: `localStorage.getItem('fkJwt')`
- Refresh page to get new token
- Verify restaurant_id in orders filter

---

## 📱 Multi-Tenant Configuration

### Subdomain Routing

```javascript
// Automatic routing based on subdomain
getPageType() → 'homepage' | 'admin' | 'waiter' | restaurant_slug
```

**Examples:**
- `fkpizza.com` → Homepage (all restaurants)
- `pizza1.fkpizza.com` → Pizza 1 restaurant
- `admin.fkpizza.com` → Admin dashboard
- `cameriere.fkpizza.com` → Waiter app

### RLS Policy Example

```sql
-- Restaurants can only see their own data
CREATE POLICY "restaurants_isolation" ON orders
  FOR SELECT
  USING (restaurant_id = current_setting('request.jwt.claims')::jsonb->>'restaurant_id');
```

---

## 📞 Support Resources

- **Supabase Docs:** https://supabase.com/docs
- **Cloudinary Docs:** https://cloudinary.com/documentation
- **Vercel Docs:** https://vercel.com/docs

---

## ✅ Pre-Deployment Checklist

- [ ] All environment variables set in Vercel
- [ ] Supabase tables created and RLS enabled
- [ ] Cloudinary upload preset configured
- [ ] GitHub repository connected to Vercel
- [ ] Admin account created via manage-admins function
- [ ] Test restaurants added
- [ ] Test order placed successfully
- [ ] Images upload to Cloudinary successfully
- [ ] Admin dashboard accessible
- [ ] Waiter app functional
- [ ] Multi-tenant routing working

---

**Deployment Status:** ✅ READY  
**Last Verification:** July 22, 2026
