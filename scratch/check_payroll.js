const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const employees = await prisma.employee.findMany();
  console.log(`Total active/all employees: ${employees.length}`);
  
  const structures = await prisma.salaryStructure.findMany({
    include: { employee: true }
  });
  console.log("\nSalary Structures:");
  structures.forEach(s => {
    console.log(`- Employee: ${s.employee.firstName} ${s.employee.lastName} (${s.employee.email}), Basic: ${s.basic}, Status: ${s.status}, Effective: ${s.effectiveFrom}`);
  });

  const runs = await prisma.payrollRun.findMany({
    include: { payslips: true }
  });
  console.log("\nPayroll Runs:");
  runs.forEach(r => {
    console.log(`- Run ID: ${r.id}, Month/Year: ${r.month}/${r.year}, Status: ${r.status}, Payslips Count: ${r.payslips.length}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
