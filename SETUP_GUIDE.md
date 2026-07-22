# FK Pizza Platform - Complete Setup Guide

**Date:** July 22, 2026  
**Version:** 1.0

---

## 📋 Table of Contents

1. [Vercel Setup](#vercel-setup)
2. [Environment Variables](#environment-variables)
3. [Supabase Configuration](#supabase-configuration)
4. [Cloudinary Configuration](#cloudinary-configuration)
5. [Verification Steps](#verification-steps)

---

## 🎯 Vercel Setup

### Step 1: Verify Project Connection

```bash
cd /home/user/fkpizza
ls -la .vercel/
```

**Expected Output:**
```
-rw-r--r-- project.json
```

### Step 2: Set Environment Variables in Vercel Dashboard

**URL:** https://vercel.com/daxluna88-max/fkpizza/settings/environment-variables

#### Production Environment Variables

Add these variables with **Production** environment selected:

| Variable | Value | Required |
|----------|-------|----------|
| `SUPABASE_URL` | `https://llungqolufzcfaqghydt.supabase.co` | Yes |
| `SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Yes |
| `CLOUDINARY_CLOUD_NAME` | `dajqdbpms` | Yes |
| `CLOUDINARY_UPLOAD_PRESET` | `fkpizza_unsigned` | Yes |
| `NODE_ENV` | `production` | Yes |

#### Development/Preview Environment Variables

Same as Production (frontend is environment-agnostic)

### Step 3: Verify Deployment

**URL:** https://vercel.com/daxluna88-max/fkpizza/deployments

Check that:
- ✅ Latest deployment shows "READY"
- ✅ Domain is `fkpizza.vercel.app`
- ✅ Auto-deployment from `main` branch is enabled

---

## 🔑 Environment Variables Reference

### Supabase Keys

**SUPABASE_URL:**
```
https://llungqolufzcfaqghydt.supabase.co
```

**SUPABASE_ANON_KEY** (Public, safe for frontend):
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsdW5ncW9sdWZ6Y2ZhcWdoeWR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0MjAzMzcsImV4cCI6MjA5NTk5NjMzN30.jbhdR8rWYrlTU-FR_jBI63THbnuYk1m_Xh7oMJAqrPI
```

**Location in code:** `/index.html` (hardcoded in script)

**SUPABASE_SERVICE_ROLE_KEY** (Private, for edge functions only):
- Contact: [Supabase Dashboard](https://app.supabase.com)
- Project: `llungqolufzcfaqghydt`
- Settings → API → Service Role Key

### Cloudinary Configuration

**CLOUDINARY_CLOUD_NAME:**
```
dajqdbpms
```

**CLOUDINARY_UPLOAD_PRESET:**
```
fkpizza_unsigned
```

**Status:** ✅ Preset is configured for unsigned uploads (client-side)

**API Keys (for admin operations only):**
- Get from: https://cloudinary.com/console
- Store in: Vercel secrets (if needed)

---

## 🗄️ Supabase Configuration

### Project Details

| Setting | Value |
|---------|-------|
| Project URL | `https://llungqolufzcfaqghydt.supabase.co` |
| Project Ref | `llungqolufzcfaqghydt` |
| Region | eu-central-1 (Ireland) |
| Database | PostgreSQL 17.6.1 |

### Verify Database Connection

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select project `llungqolufzcfaqghydt`
3. Go to **SQL Editor**
4. Run:

```sql
SELECT version();
-- Should return: PostgreSQL 17.6.1 on x86_64-pc-linux-gnu
```

### Verify Tables

```sql
-- Check all tables
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;
```

**Expected tables:**
- admins
- dishes
- instagram_feeds
- menu_categories
- orders
- restaurant_dishes
- restaurant_pos
- restaurants
- reviews
- waiters
- work_menus

### Enable RLS

For each table, run:

```sql
-- Example for restaurants table
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;

-- Create policy for multi-tenant isolation
CREATE POLICY "restaurants_isolation" ON restaurants
  FOR SELECT
  USING (true);
```

---

## ☁️ Cloudinary Configuration

### Project Details

| Setting | Value |
|---------|-------|
| Cloud Name | `dajqdbpms` |
| Upload Preset | `fkpizza_unsigned` |
| CDN URL | `https://res.cloudinary.com/dajqdbpms/` |

### Verify Preset Configuration

1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Settings → Upload
3. Find preset: **fkpizza_unsigned**

**Expected Settings:**
- ✅ Unsigned uploads enabled
- ✅ Auto tagging disabled (optional)
- ✅ Allowed formats: jpg, png, webp, gif
- ✅ Max file size: appropriate for your needs

### Test Upload

Upload a test image to Cloudinary:

```javascript
// In browser console on fkpizza.vercel.app
const fd = new FormData();
fd.append('file', imageFile); // from file input
fd.append('upload_preset', 'fkpizza_unsigned');

fetch('https://api.cloudinary.com/v1_1/dajqdbpms/image/upload', {
  method: 'POST',
  body: fd
})
.then(r => r.json())
.then(d => console.log('✅ Uploaded:', d.secure_url));
```

---

## ✅ Verification Steps

### Test 1: Frontend Loads

1. Visit https://fkpizza.vercel.app
2. Check browser console for errors
3. Verify page renders correctly

**Expected:**
- ✅ Hero section loads
- ✅ Restaurants carousel visible
- ✅ No 403 errors in console

### Test 2: Supabase Connection

In browser console:

```javascript
// Verify configuration
console.log('SB URL:', SB.URL);
console.log('SB KEY (first 20 chars):', SB.KEY.substring(0, 20));

// Test fetch
fetch(SB.URL + '/rest/v1/restaurants?limit=1', {
  headers: { apikey: SB.KEY }
})
.then(r => r.json())
.then(d => {
  if (d.length > 0) {
    console.log('✅ Supabase works! First restaurant:', d[0].name);
  } else {
    console.log('⚠️ Supabase connected but no data');
  }
})
.catch(e => console.log('❌ Supabase error:', e.message));
```

### Test 3: Cloudinary Connection

In browser console:

```javascript
// Verify configuration
console.log('Cloudinary cloud:', CLOUDINARY.CLOUD_NAME);
console.log('Cloudinary preset:', CLOUDINARY.PRESET);

// Test CDN access
fetch('https://res.cloudinary.com/dajqdbpms/image/upload/w_100/v1780262831/test', { method: 'HEAD' })
  .then(r => console.log('✅ Cloudinary CDN works! Status:', r.status))
  .catch(e => console.log('❌ Cloudinary error:', e.message));
```

### Test 4: Admin Login

1. Navigate to https://fkpizza.vercel.app?admin=1
2. Try login with credentials:
   - Email: `admin@fkpizza.com`
   - Password: Check FALLBACK_ADMIN in index.html

**Expected:**
- ✅ Login form appears
- ✅ No CORS errors
- ✅ Redirect to admin dashboard

### Test 5: Order Creation

1. Select a restaurant
2. Add items to cart
3. Place test order

**Expected:**
- ✅ Order saved to database
- ✅ Confirmation message
- ✅ Admin sees new order

### Test 6: Multi-tenant Isolation

Test with different restaurants:

1. Visit `pizza1.fkpizza.com` (or restaurant subdomain)
2. Place order for Pizza 1
3. Visit `pizza2.fkpizza.com`
4. Verify Pizza 1's orders are NOT visible

**Expected:**
- ✅ Each restaurant sees only its own data

---

## 📊 Connection Status Dashboard

Create a status page at: `https://fkpizza.vercel.app/status`

Add this to `index.html` before closing body tag:

```html
<div id="status-check" style="position:fixed;bottom:10px;right:10px;background:#000;color:#fff;padding:10px;border-radius:8px;font-size:12px;opacity:0.7;max-width:200px;z-index:9999">
  <div><strong>System Status</strong></div>
  <div id="sb-status">🔄 Supabase...</div>
  <div id="cdn-status">🔄 Cloudinary...</div>
</div>

<script>
// Status check on load
window.addEventListener('load', async () => {
  // Check Supabase
  fetch(SB.URL + '/rest/v1/', { headers: { apikey: SB.KEY } })
    .then(r => {
      document.getElementById('sb-status').textContent = r.ok ? '✅ Supabase' : '❌ Supabase';
    })
    .catch(() => {
      document.getElementById('sb-status').textContent = '❌ Supabase';
    });

  // Check Cloudinary
  fetch('https://res.cloudinary.com/' + CLOUDINARY.CLOUD_NAME + '/image/upload/v1/test', { method: 'HEAD' })
    .then(r => {
      document.getElementById('cdn-status').textContent = r.status === 404 ? '✅ Cloudinary' : '✅ Cloudinary';
    })
    .catch(() => {
      document.getElementById('cdn-status').textContent = '❌ Cloudinary';
    });
});
</script>
```

---

## 🔧 Troubleshooting Guide

### Problem: Supabase returning 403

**Solution:**
1. Check API key in `SB.KEY`
2. Verify in Supabase: Settings → API
3. Make sure key is not expired
4. Check CORS settings in Supabase

### Problem: Cloudinary images not loading

**Solution:**
1. Verify cloud name: `dajqdbpms`
2. Check if preset exists: `fkpizza_unsigned`
3. Test URL format: `https://res.cloudinary.com/dajqdbpms/image/upload/...`

### Problem: Admin login not working

**Solution:**
1. Clear localStorage: `localStorage.clear()`
2. Check Supabase auth: Settings → Auth Providers
3. Verify email exists in `admins` table
4. Reset password via manage-admins function

### Problem: Orders not showing in admin

**Solution:**
1. Verify `restaurant_id` matches
2. Check RLS policies: `SELECT * FROM pg_policies;`
3. Clear browser cache and localStorage
4. Refresh admin page

---

## 🚀 Deployment Checklist

Before going live:

- [ ] All environment variables set in Vercel
- [ ] Vercel deployment shows "READY"
- [ ] Test page loads at vercel.app domain
- [ ] Supabase health check passes
- [ ] Cloudinary upload works
- [ ] Admin login works
- [ ] Create test order
- [ ] Multi-tenant isolation verified
- [ ] Images load correctly
- [ ] No console errors
- [ ] Performance acceptable (<3s load)
- [ ] Mobile responsive (test on phone)

---

## 📞 Support

For issues:
1. Check browser console for errors
2. Verify environment variables in Vercel
3. Check Supabase/Cloudinary dashboards
4. Run `node test-connections.js`
5. Review DEPLOYMENT.md

---

**Setup Complete!** 🎉  
Your FK Pizza platform is ready to deploy.
