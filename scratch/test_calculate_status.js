const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const companyId = 'company_skylinx';
  const month = 10;
  const year = 2029;

  // Cleanup old test run if exists
  await prisma.payrollRun.deleteMany({
    where: { companyId, month, year }
  });

  console.log(`Initializing run for ${month}/${year}...`);
  // Create run (should be DRAFT)
  let run = await prisma.payrollRun.create({
    data: { companyId, month, year, status: 'DRAFT' }
  });
  console.log(`Initialized run status: ${run.status}`);

  console.log(`Calculating payroll...`);
  // Call the calculate logic directly
  const employees = await prisma.employee.findMany({
    where: { companyId, status: 'ACTIVE' }
  });

  const result = await prisma.$transaction(async (tx) => {
    const payslips = [];
    for (const employee of employees) {
      const structure = await tx.salaryStructure.findFirst({
        where: {
          employeeId: employee.id,
          status: 'ACTIVE'
        },
        orderBy: { effectiveFrom: 'desc' }
      });
      if (!structure) continue;

      const monthlyBasic = Math.round(Number(structure.basic) / 12);
      const monthlyHra = Math.round(Number(structure.hra) / 12);
      const monthlyAllowances = Math.round(Number(structure.allowances) / 12);
      const employeePf = Math.round(Number(structure.employeePf) / 12);
      const esi = Math.round(Number(structure.esi) / 12);
      const professionalTax = Math.round(Number(structure.professionalTax) / 12);
      const tds = Math.round(Number(structure.tds) / 12);
      const grossPay = monthlyBasic + monthlyHra + monthlyAllowances;
      const deductions = employeePf + esi + professionalTax + tds;
      const netPay = grossPay - deductions;

      const payslip = await tx.payslip.upsert({
        where: {
          payrollRunId_employeeId: {
            payrollRunId: run.id,
            employeeId: employee.id,
          },
        },
        update: { grossPay, deductions, netPay, status: 'DRAFT' },
        create: { payrollRunId: run.id, employeeId: employee.id, grossPay, deductions, netPay, status: 'DRAFT' }
      });
      payslips.push(payslip);
    }

    const updatedRun = await tx.payrollRun.update({
      where: { id: run.id },
      data: {
        status: 'PENDING',
        processedAt: new Date(),
      }
    });
    return updatedRun;
  });

  console.log(`After calculation run status in DB is: ${result.status}`);

  // Now query it again
  const finalRun = await prisma.payrollRun.findUnique({ where: { id: run.id } });
  console.log(`Verified final status: ${finalRun.status}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
