const fetch = require('node-fetch');

async function test() {
  const apiBase = 'http://127.0.0.1:4000/api/v1';

  // 1. Login
  console.log('Logging in as hr.admin@skylinx.local...');
  const loginRes = await fetch(`${apiBase}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'hr.admin@skylinx.local',
      password: 'Skylinx@123'
    })
  });

  const loginBody = await loginRes.json();
  if (!loginRes.ok) {
    console.error('Login failed:', loginBody);
    return;
  }

  const token = loginBody.data.accessToken;
  console.log('Login Success!');

  // 2. Fetch Assets Summary
  console.log('\nFetching Assets summary...');
  const assetsRes = await fetch(`${apiBase}/assets`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const assetsBody = await assetsRes.json();
  if (!assetsRes.ok) {
    console.error('Assets fetch failed:', assetsBody);
    return;
  }

  console.log('Total Assets:', assetsBody.data.total);
  console.log('Assigned Assets:', assetsBody.data.assigned);
  console.log('Available Assets:', assetsBody.data.available);
  console.log('Asset Tags in DB:', assetsBody.data.rows.map(r => r.assetTag));

  // Find an available asset tag
  const availableAsset = assetsBody.data.rows.find(r => r.status === 'AVAILABLE');
  if (!availableAsset) {
    console.log('No available asset to assign, exiting test');
    return;
  }

  const tag = availableAsset.assetTag;
  console.log(`\nAssigning asset ${tag}...`);

  // 3. Assign
  const assignRes = await fetch(`${apiBase}/assets/${tag}/assign`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  const assignBody = await assignRes.json();
  if (!assignRes.ok) {
    console.error('Assign failed:', assignBody);
    return;
  }
  console.log('Assign status:', assignBody.data.status);

  // 4. Return
  console.log(`\nReturning asset ${tag}...`);
  const returnRes = await fetch(`${apiBase}/assets/${tag}/return`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  const returnBody = await returnRes.json();
  if (!returnRes.ok) {
    console.error('Return failed:', returnBody);
    return;
  }
  console.log('Return status:', returnBody.data.status);
  console.log('=== ASSETS API VERIFICATION PASSED SUCCESSFULLY ===');
}

console.log('Waiting for dev server to settle...');
setTimeout(test, 4000);
