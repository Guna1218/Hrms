const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const depts = await prisma.department.findMany();
  const desgs = await prisma.designation.findMany();
  const locs = await prisma.location.findMany();

  console.log("Departments:");
  depts.forEach(d => console.log(`  - ID: ${d.id}, Name: ${d.name}`));

  console.log("Designations:");
  desgs.forEach(d => console.log(`  - ID: ${d.id}, Title: ${d.title}`));

  console.log("Locations:");
  locs.forEach(l => console.log(`  - ID: ${l.id}, Name: ${l.name}`));
}

main().catch(console.error).finally(() => prisma.$disconnect());
