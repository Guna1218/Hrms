const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("--- PAYROLL AUDIT LOGS ---");
  const audits = await prisma.auditLog.findMany({
    where: { module: 'payroll' },
    orderBy: { createdAt: 'desc' },
    take: 30
  });
  audits.forEach(a => {
    console.log(`- Time: ${a.createdAt}, Action: ${a.action}, Entity: ${a.entityType}, ID: ${a.entityId}, Value: ${JSON.stringify(a.newValueJson)}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
