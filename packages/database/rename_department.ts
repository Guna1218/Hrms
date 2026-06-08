import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Check if People department exists
  const peopleDept = await prisma.department.findUnique({
    where: { id: "dept_people" }
  });

  if (peopleDept) {
    await prisma.department.update({
      where: { id: "dept_people" },
      data: {
        name: "HR",
        code: "HR"
      }
    });
    console.log("Successfully renamed 'People' department to 'HR' in DB.");
  } else {
    console.log("Department 'dept_people' not found.");
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
