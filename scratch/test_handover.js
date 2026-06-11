const http = require('http');

const API_BASE = 'http://localhost:4000/api/v1';

async function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const reqOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            resolve(data);
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function run() {
  console.log('=== STARTING ASSET HANDOVER VERIFICATION TEST ===\n');

  // 1. Authenticating as HR Admin
  console.log('1. Authenticating as hr.admin@skylinx.local...');
  const authRes = await request(`${API_BASE}/auth/login`, {
    method: 'POST',
    body: {
      email: 'hr.admin@skylinx.local',
      password: 'Skylinx@123',
    },
  });
  const token = authRes.data.accessToken;
  const headers = { Authorization: `Bearer ${token}` };
  console.log('Authenticated successfully.\n');

  // 2. Querying summary to see if EXITED employees' assets show up in the handover list
  console.log('2. Querying current asset summary...');
  const summaryRes = await request(`${API_BASE}/assets`, { headers });
  const summary = summaryRes.data;
  console.log(`Current handoverPending count: ${summary.handoverPending}`);

  // Find rows where employeeStatus is EXITED
  const exitedEmployeeAssets = summary.rows.filter(row => row.employeeStatus === 'EXITED');
  console.log(`Found ${exitedEmployeeAssets.length} assets assigned to EXITED employees:`);
  for (const asset of exitedEmployeeAssets) {
    console.log(`- Tag: ${asset.assetTag}, Item: ${asset.item}, AssignedTo: ${asset.assignedTo}, EmployeeStatus: ${asset.employeeStatus}, Condition: ${asset.condition}`);
  }

  if (exitedEmployeeAssets.length === 0) {
    console.log('\nWarning: No assets currently assigned to EXITED employees in database.');
    console.log('We will create one to test the flow.');
  }

  // 3. Creating a test asset
  const testTag = `SKY-LAP-HANDOVER-${Date.now().toString().slice(-4)}`;
  console.log(`\n3. Creating a test asset with tag: ${testTag}...`);
  await request(`${API_BASE}/assets`, {
    method: 'POST',
    headers,
    body: {
      assetTag: testTag,
      type: 'Laptop',
      item: 'Test Handover Device',
      status: 'AVAILABLE',
      condition: 'GOOD',
    },
  });

  // Assign to Kabir Sethi (employeeId: emp_1003, status: EXITED)
  console.log(`Assigning asset ${testTag} to EXITED employee Kabir Sethi (emp_1003)...`);
  await request(`${API_BASE}/assets/${testTag}/assign`, {
    method: 'POST',
    headers,
    body: {
      employeeId: 'emp_1003',
    },
  });

  // 4. Verify it is counted as handoverPending and has EXITED status
  console.log('\n4. Re-fetching summary to check handover queue classification...');
  const summaryAfterAssign = (await request(`${API_BASE}/assets`, { headers })).data;
  const targetAsset = summaryAfterAssign.rows.find(r => r.assetTag === testTag);
  
  if (!targetAsset) {
    throw new Error(`Test asset ${testTag} was not found in summary rows!`);
  }

  console.log(`Asset ${testTag} properties:`);
  console.log(`- Status: ${targetAsset.status}`);
  console.log(`- Condition: ${targetAsset.condition}`);
  console.log(`- Employee Status: ${targetAsset.employeeStatus}`);
  
  if (targetAsset.employeeStatus !== 'EXITED') {
    throw new Error(`Asset employeeStatus was not populated as EXITED! Current: ${targetAsset.employeeStatus}`);
  }
  console.log(`Success! Exited status verified.`);

  // 5. Return the asset with a POOR condition to test return condition parameter
  console.log(`\n5. Returning asset ${testTag} with condition set to 'POOR'...`);
  const returnRes = await request(`${API_BASE}/assets/${testTag}/return`, {
    method: 'POST',
    headers,
    body: {
      condition: 'POOR',
    },
  });
  console.log(`Return response status: ${returnRes.status}`);

  // 6. Verify that the asset condition is updated to POOR in the database
  console.log('\n6. Checking asset condition in summary after return...');
  const summaryAfterReturn = (await request(`${API_BASE}/assets`, { headers })).data;
  const returnedAsset = summaryAfterReturn.rows.find(r => r.assetTag === testTag);

  if (!returnedAsset) {
    throw new Error(`Test asset ${testTag} not found after return!`);
  }

  console.log(`Returned asset properties:`);
  console.log(`- Status: ${returnedAsset.status} (Expected: AVAILABLE)`);
  console.log(`- Condition: ${returnedAsset.condition} (Expected: POOR)`);

  if (returnedAsset.condition !== 'POOR') {
    throw new Error(`Asset condition was not updated to POOR! Current: ${returnedAsset.condition}`);
  }
  console.log('Success! Asset condition was updated to POOR on return.');

  // Clean up
  console.log(`\n7. Cleaning up test asset ${testTag}...`);
  await request(`${API_BASE}/assets/${testTag}`, {
    method: 'DELETE',
    headers,
  });
  console.log('Cleaned up successfully.');

  console.log('\n=== ALL HANDOVER VERIFICATION CHECKS PASSED SUCCESSFULLY ===');
}

run().catch((err) => {
  console.error('\nTest failed with error:', err.message || err);
  process.exit(1);
});
