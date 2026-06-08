const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const expenses = await prisma.expense.findMany({
    include: { employee: true }
  });
  console.log(`Total expenses: ${expenses.length}`);
  expenses.forEach(e => {
    console.log(`- ID: ${e.id}, Employee: ${e.employee.firstName} ${e.employee.lastName}, Title: ${e.title}, Amount: ${e.amount}, Status: ${e.status}, ClaimDate: ${e.claimDate}, ReimbursedAt: ${e.reimbursedAt}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
