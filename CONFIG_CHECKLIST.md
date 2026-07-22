# 🎯 FK Pizza Platform - Configuration Checklist

**Date:** July 22, 2026  
**Status:** Ready for Configuration

---

## ✅ Pre-Configuration Requirements

### Local Repository
- [x] Git repository initialized
- [x] Code committed to branch `claude/fk-pizza-migration-setup-uh70l2`
- [x] vercel.json configured for SPA routing
- [x] index.html contains all necessary configurations

### External Services
- [x] Supabase project created: `llungqolufzcfaqghydt`
- [x] PostgreSQL database ready (17.6.1)
- [x] Cloudinary account active: `dajqdbpms`
- [x] Vercel project created: `prj_LL2Ob6a549DDbjQyfg0XvuOdmSje`

---

## 🔧 Configuration Tasks

### Phase 1: Supabase Database Setup

#### Database Tables
- [ ] Run migration SQL to create all tables:
  - [ ] `restaurants`
  - [ ] `orders`
  - [ ] `dishes`
  - [ ] `menu_categories`
  - [ ] `restaurant_dishes`
  - [ ] `admins`
  - [ ] `waiters`
  - [ ] `reviews`
  - [ ] `work_menus`
  - [ ] `instagram_feeds`
  - [ ] `restaurant_pos`

#### Row Level Security (RLS)
- [ ] Enable RLS on all tables
- [ ] Create policies for multi-tenant isolation
- [ ] Test RLS with sample data

#### Edge Functions
- [ ] Deploy `manage-admins` function
- [ ] Test function with sample requests
- [ ] Verify JWT verification works

### Phase 2: Vercel Environment Setup

#### Environment Variables - Production
- [ ] `SUPABASE_URL` = `https://llungqolufzcfaqghydt.supabase.co`
- [ ] `SUPABASE_ANON_KEY` = [Public API Key]
- [ ] `CLOUDINARY_CLOUD_NAME` = `dajqdbpms`
- [ ] `CLOUDINARY_UPLOAD_PRESET` = `fkpizza_unsigned`
- [ ] `NODE_ENV` = `production`

#### Environment Variables - Preview/Development
- [ ] Same as production (frontend is environment-agnostic)

#### Deployment Configuration
- [ ] GitHub repository connected: `daxluna88-max/fkpizza`
- [ ] Auto-deploy from `main` branch enabled
- [ ] Build settings verified (no build step required)
- [ ] Domain configured: `fkpizza.vercel.app`

### Phase 3: Cloudinary Configuration

#### Upload Preset
- [ ] Preset name: `fkpizza_unsigned`
- [ ] Unsigned uploads: Enabled
- [ ] Max file size: Appropriate (suggested: 50MB)
- [ ] Allowed formats: jpg, png, webp, gif, webm
- [ ] Auto tagging: Disabled
- [ ] Auto moderation: Configured (optional)

#### API Keys (for backend use)
- [ ] API Key obtained from dashboard
- [ ] API Secret stored securely
- [ ] Vercel secrets configured (if needed)

#### CDN Configuration
- [ ] CDN enabled: `https://res.cloudinary.com/dajqdbpms/`
- [ ] Cache headers configured
- [ ] Image optimization enabled

### Phase 4: Testing & Verification

#### Connectivity Tests
- [ ] Supabase REST API reachable
- [ ] Supabase Auth system functional
- [ ] Cloudinary upload endpoint accessible
- [ ] Cloudinary CDN serves images
- [ ] Vercel deployment accessible

#### Data Verification
- [ ] Test restaurants table populated
- [ ] Sample menu items added
- [ ] Images uploaded to Cloudinary
- [ ] URLs resolve correctly

#### Application Tests
- [ ] Homepage loads without errors
- [ ] Restaurant carousel displays
- [ ] Admin login page works
- [ ] Order creation flow functional
- [ ] Multi-tenant isolation verified
- [ ] Image uploads work end-to-end

#### Browser Console Checks
- [ ] No 403 errors
- [ ] No CORS errors
- [ ] No undefined references
- [ ] All API calls successful

### Phase 5: Multi-Tenant Configuration

#### Subdomain Setup
- [ ] Subdomain routing logic verified in code
- [ ] Test single restaurant access
- [ ] Test admin access
- [ ] Test waiter access
- [ ] Verify data isolation works

#### Restaurant Data
- [ ] At least 1 test restaurant created
- [ ] Logo/images uploaded
- [ ] Menu categories set up
- [ ] Sample dishes added
- [ ] Opening hours configured

### Phase 6: Admin Setup

#### First Admin Account
- [ ] Create admin user via `manage-admins` function
- [ ] Email: `admin@fkpizza.com` (or preferred email)
- [ ] Password: Strong password set
- [ ] Role: `superadmin`
- [ ] Restaurants: Assigned to all test restaurants

#### Admin Features Verification
- [ ] Login page accessible
- [ ] Dashboard loads
- [ ] Restaurant list visible
- [ ] Order management works
- [ ] Menu editing works (if implemented)

### Phase 7: Performance & Security

#### Performance
- [ ] Page load time < 3 seconds
- [ ] Images optimized via Cloudinary
- [ ] Client-side caching working
- [ ] No memory leaks in browser

#### Security
- [ ] API keys not exposed in git history
- [ ] Environment variables only in Vercel
- [ ] HTTPS enforced on all domains
- [ ] RLS policies prevent data leakage
- [ ] JWT tokens properly validated

#### CORS Configuration
- [ ] Supabase CORS allows frontend domain
- [ ] Cloudinary CORS allows unsigned uploads
- [ ] No wildcard origins in production

---

## 📊 Configuration Verification Matrix

### Supabase Status
| Component | Status | Details |
|-----------|--------|---------|
| Project | ✅ | llungqolufzcfaqghydt active |
| Database | ✅ | PostgreSQL 17.6.1 running |
| Tables | ⏳ | Awaiting migration execution |
| RLS | ⏳ | Awaiting policy creation |
| Auth | ✅ | System enabled |
| Edge Functions | ⏳ | Awaiting deployment |

### Cloudinary Status
| Component | Status | Details |
|-----------|--------|---------|
| Account | ✅ | dajqdbpms active |
| Upload Preset | ✅ | fkpizza_unsigned configured |
| CDN | ✅ | res.cloudinary.com active |
| API Keys | ⏳ | Awaiting configuration in Vercel |
| Storage | ✅ | Unlimited available |

### Vercel Status
| Component | Status | Details |
|-----------|--------|---------|
| Project | ✅ | prj_LL2Ob6a549DDbjQyfg0XvuOdmSje ready |
| Domain | ✅ | fkpizza.vercel.app assigned |
| GitHub | ⏳ | Awaiting connection |
| Env Vars | ⏳ | Awaiting configuration |
| Deployment | ⏳ | Awaiting first deploy |

---

## 🚀 Quick Start Commands

Once all configuration is complete:

```bash
# 1. Verify code is committed
git status
# Should show: working tree clean

# 2. Push to main branch
git push -u origin main

# 3. Verify Vercel deployment
# Visit: https://vercel.com/daxluna88-max/fkpizza

# 4. Test in browser
# Visit: https://fkpizza.vercel.app

# 5. Run verification script
node test-connections.js
```

---

## 📋 Configuration Files Reference

| File | Purpose | Status |
|------|---------|--------|
| `.env.example` | Environment variable template | ✅ Created |
| `.vercel/project.json` | Vercel project configuration | ✅ Created |
| `vercel.json` | Vercel build/routing config | ✅ Created |
| `index.html` | Main application with embedded config | ✅ Ready |
| `DEPLOYMENT.md` | Deployment configuration guide | ✅ Created |
| `SETUP_GUIDE.md` | Step-by-step setup instructions | ✅ Created |
| `test-connections.js` | Connection verification script | ✅ Created |

---

## ⚠️ Critical Reminders

1. **Never commit `.env` with real credentials** - Use `.env.example` template only
2. **Supabase keys are in HTML** - Public ANON key is fine, never commit SERVICE_ROLE
3. **Test thoroughly before production** - Use preview deployments first
4. **Monitor for errors** - Keep browser console open while testing
5. **Backup data** - Configure Supabase backups before going live

---

## 🎯 Success Criteria

When ALL items are checked:

- ✅ Platform is fully configured
- ✅ All services connected and tested
- ✅ Multi-tenant isolation verified
- ✅ Admin functionality working
- ✅ Ready for production deployment

---

## 📞 Support Resources

- **Supabase Docs:** https://supabase.com/docs
- **Cloudinary Docs:** https://cloudinary.com/documentation
- **Vercel Docs:** https://vercel.com/docs
- **Test Script:** Run `node test-connections.js`
- **Setup Guide:** See `SETUP_GUIDE.md`

---

**Configuration Package Version:** 1.0  
**Last Updated:** July 22, 2026  
**Status:** Ready for Implementation
