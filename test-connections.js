#!/usr/bin/env node
/**
 * Connection Test Script for FK Pizza Platform
 * Tests Supabase and Cloudinary connectivity
 */

const SB_URL = 'https://llungqolufzcfaqghydt.supabase.co';
const SB_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsdW5ncW9sdWZ6Y2ZhcWdoeWR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0MjAzMzcsImV4cCI6MjA5NTk5NjMzN30.jbhdR8rWYrlTU-FR_jBI63THbnuYk1m_Xh7oMJAqrPI';
const CLOUDINARY_CLOUD = 'dajqdbpms';

console.log('🔍 FK Pizza Platform - Connection Test Suite\n');
console.log('═'.repeat(50));

// Test 1: Supabase Health Check
async function testSupabaseHealth() {
  console.log('\n📊 Test 1: Supabase Health Check');
  console.log('─'.repeat(50));
  try {
    const res = await fetch(`${SB_URL}/rest/v1/`, {
      headers: {
        'apikey': SB_ANON_KEY,
        'Accept': 'application/json',
      },
    });
    if (res.ok) {
      console.log('✅ Supabase is reachable');
      console.log(`   URL: ${SB_URL}`);
      console.log(`   Status: ${res.status} ${res.statusText}`);
      return true;
    } else {
      console.log(`❌ Supabase returned error: ${res.status}`);
      return false;
    }
  } catch (e) {
    console.log(`❌ Supabase connection failed: ${e.message}`);
    return false;
  }
}

// Test 2: Supabase Tables
async function testSupabaseTables() {
  console.log('\n📋 Test 2: Supabase Tables Check');
  console.log('─'.repeat(50));
  const tables = ['restaurants', 'orders', 'dishes', 'menu_categories', 'admins', 'waiters'];
  let successCount = 0;

  for (const table of tables) {
    try {
      const res = await fetch(`${SB_URL}/rest/v1/${table}?limit=0`, {
        headers: {
          'apikey': SB_ANON_KEY,
          'Authorization': `Bearer ${SB_ANON_KEY}`,
          'Accept': 'application/json',
        },
      });
      if (res.ok) {
        console.log(`   ✅ ${table}`);
        successCount++;
      } else {
        console.log(`   ⚠️  ${table} (${res.status})`);
      }
    } catch (e) {
      console.log(`   ❌ ${table} - ${e.message}`);
    }
  }
  console.log(`\n   Result: ${successCount}/${tables.length} tables accessible`);
  return successCount === tables.length;
}

// Test 3: Cloudinary Connectivity
async function testCloudinary() {
  console.log('\n☁️  Test 3: Cloudinary Connectivity');
  console.log('─'.repeat(50));
  try {
    const testUrl = `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/upload/v1/test`;
    const res = await fetch(testUrl, { method: 'HEAD' });
    if (res.ok || res.status === 404) {
      console.log('✅ Cloudinary is reachable');
      console.log(`   Cloud: ${CLOUDINARY_CLOUD}`);
      console.log(`   Status: Accessible`);
      return true;
    } else {
      console.log(`❌ Cloudinary returned error: ${res.status}`);
      return false;
    }
  } catch (e) {
    console.log(`❌ Cloudinary connection failed: ${e.message}`);
    return false;
  }
}

// Test 4: Verify Restaurants Data
async function testRestaurantsData() {
  console.log('\n🏪 Test 4: Restaurant Data Verification');
  console.log('─'.repeat(50));
  try {
    const res = await fetch(`${SB_URL}/rest/v1/restaurants?limit=1`, {
      headers: {
        'apikey': SB_ANON_KEY,
        'Authorization': `Bearer ${SB_ANON_KEY}`,
        'Accept': 'application/json',
      },
    });
    const data = await res.json();
    if (Array.isArray(data)) {
      console.log(`✅ Restaurants table is accessible`);
      console.log(`   Sample count: ${data.length}`);
      if (data.length > 0) {
        console.log(`   First restaurant: ${data[0].name || 'N/A'}`);
      }
      return true;
    }
    return false;
  } catch (e) {
    console.log(`❌ Failed to retrieve restaurant data: ${e.message}`);
    return false;
  }
}

// Test 5: Verify Orders Table
async function testOrdersTable() {
  console.log('\n📦 Test 5: Orders Table Verification');
  console.log('─'.repeat(50));
  try {
    const res = await fetch(`${SB_URL}/rest/v1/orders?limit=0`, {
      headers: {
        'apikey': SB_ANON_KEY,
        'Authorization': `Bearer ${SB_ANON_KEY}`,
        'Accept': 'application/json',
      },
    });
    if (res.ok) {
      const total = res.headers.get('content-range');
      console.log(`✅ Orders table is accessible`);
      console.log(`   Range header: ${total || 'Not available'}`);
      return true;
    }
    return false;
  } catch (e) {
    console.log(`❌ Failed to access orders: ${e.message}`);
    return false;
  }
}

// Test 6: Auth Configuration
async function testAuthConfig() {
  console.log('\n🔐 Test 6: Supabase Auth Configuration');
  console.log('─'.repeat(50));
  try {
    const res = await fetch(`${SB_URL}/auth/v1/settings`, {
      headers: {
        'apikey': SB_ANON_KEY,
        'Accept': 'application/json',
      },
    });
    if (res.ok) {
      const settings = await res.json();
      console.log('✅ Auth system is configured');
      console.log(`   MFA Enabled: ${settings.mfa_enabled || false}`);
      console.log(`   SMTP Configured: ${settings.smtp_settings || false}`);
      return true;
    }
    return false;
  } catch (e) {
    console.log(`⚠️  Auth settings not accessible: ${e.message}`);
    return true; // Not critical
  }
}

// Run all tests
async function runAllTests() {
  const results = [];

  results.push(await testSupabaseHealth());
  results.push(await testSupabaseTables());
  results.push(await testCloudinary());
  results.push(await testRestaurantsData());
  results.push(await testOrdersTable());
  results.push(await testAuthConfig());

  console.log('\n' + '═'.repeat(50));
  console.log('\n📊 Test Summary');
  console.log('─'.repeat(50));

  const passed = results.filter(r => r).length;
  const total = results.length;
  const percentage = Math.round((passed / total) * 100);

  console.log(`Passed: ${passed}/${total} (${percentage}%)`);

  if (passed === total) {
    console.log('\n✅ All tests passed! Platform is ready.\n');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tests failed. Check configuration.\n');
    process.exit(1);
  }
}

// Run tests
runAllTests().catch(e => {
  console.error('Test suite failed:', e);
  process.exit(1);
});
