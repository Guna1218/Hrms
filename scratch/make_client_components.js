const fs = require('fs');
const path = require('path');

const targetFiles = [
  'c:/Hrms/apps/web/app/analytics/page.tsx',
  'c:/Hrms/apps/web/app/assets/page.tsx',
  'c:/Hrms/apps/web/app/ats/page.tsx',
  'c:/Hrms/apps/web/app/attendance/page.tsx',
  'c:/Hrms/apps/web/app/compliance/page.tsx',
  'c:/Hrms/apps/web/app/documents/page.tsx',
  'c:/Hrms/apps/web/app/employees/page.tsx',
  'c:/Hrms/apps/web/app/expenses/page.tsx',
  'c:/Hrms/apps/web/app/holidays/page.tsx',
  'c:/Hrms/apps/web/app/insurance/page.tsx',
  'c:/Hrms/apps/web/app/integrations/page.tsx',
  'c:/Hrms/apps/web/app/lifecycle/page.tsx',
  'c:/Hrms/apps/web/app/organization/page.tsx',
  'c:/Hrms/apps/web/app/performance/page.tsx',
  'c:/Hrms/apps/web/app/rewards/page.tsx',
  'c:/Hrms/apps/web/app/security/page.tsx'
];

console.log("Adding 'use client' to files:");
targetFiles.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    if (!content.trim().startsWith('"use client";') && !content.trim().startsWith("'use client';")) {
      content = '"use client";\n\n' + content;
      fs.writeFileSync(file, content, 'utf8');
      console.log(`- Prepended 'use client' to: ${file}`);
    } else {
      console.log(`- Already client component: ${file}`);
    }
  } else {
    console.warn(`- File not found: ${file}`);
  }
});
console.log("Done.");
