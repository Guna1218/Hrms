import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const notifications = await prisma.notification.findMany({
    include: {
      user: {
        include: {
          employee: true
        }
      }
    }
  });

  console.log(`Total notifications: ${notifications.length}`);
  for (const n of notifications) {
    console.log(`ID: ${n.id}`);
    console.log(`User ID: ${n.userId}`);
    console.log(`User Email: ${n.user?.email}`);
    console.log(`Employee: ${n.user?.employee ? `${n.user.employee.firstName} ${n.user.employee.lastName}` : "None"}`);
    console.log(`Channel: ${n.channel}`);
    console.log(`Title: ${n.title}`);
    console.log(`Body: ${n.body}`);
    console.log(`Status: ${n.status}`);
    console.log("-------------------");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
