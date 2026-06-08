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

targetFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    console.warn(`File not found: ${file}`);
    return;
  }

  let content = fs.readFileSync(file, 'utf8');

  // 1. Remove "use client";
  content = content.replace(/^"use client";\r?\n\r?\n?/, '');
  content = content.replace(/^'use client';\r?\n\r?\n?/, '');

  // 2. Replace icon: IconName with icon: <IconName className="h-4 w-4" />
  // We match: icon: IconName (excluding <)
  // Let's use a regex that looks for icon: followed by spaces and a word, not starting with <
  content = content.replace(/icon:\s*([A-Za-z0-9_]+)(?!\s*className)/g, (match, p1) => {
    // If it's already a component call or LucideIcon type, ignore
    if (p1 === 'LucideIcon' || p1 === 'ReactNode') return match;
    return `icon: <${p1} className="h-4 w-4" />`;
  });

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Updated file: ${file}`);
});
console.log("All files updated successfully.");
