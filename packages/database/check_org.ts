import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const employees = await prisma.employee.findMany({
    include: {
      department: true,
      designation: true,
    }
  });
  console.log("Employees in DB:");
  employees.forEach(emp => {
    console.log(`- ID: ${emp.id}, Code: ${emp.employeeCode}, Name: ${emp.firstName} ${emp.lastName}, Dept: ${emp.department?.name}, Desig: ${emp.designation?.title}, ManagerId: ${emp.managerId}`);
  });
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
