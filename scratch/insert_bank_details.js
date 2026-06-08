const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const employees = await prisma.employee.findMany();
  console.log(`Found ${employees.length} employees. Inserting bank details...`);
  
  for (const emp of employees) {
    const isOdd = emp.employeeCode.endsWith("1") || emp.employeeCode.endsWith("3") || emp.employeeCode.endsWith("5");
    const bankName = isOdd ? "HDFC Bank" : "ICICI Bank";
    const ifsc = isOdd ? "HDFC0000124" : "ICIC0000512";
    
    await prisma.employeeBankDetail.upsert({
      where: { employeeId: emp.id },
      update: {
        accountHolderName: `${emp.firstName} ${emp.lastName}`,
        bankName,
        ifsc,
        branch: "Madhapur, Hyderabad",
        verificationStatus: "VERIFIED"
      },
      create: {
        employeeId: emp.id,
        accountHolderName: `${emp.firstName} ${emp.lastName}`,
        bankName,
        accountNumberEncrypted: "encrypted_acc_no_12345",
        ifsc,
        branch: "Madhapur, Hyderabad",
        verificationStatus: "VERIFIED"
      }
    });
    console.log(`- Bank details updated/created for ${emp.firstName} ${emp.lastName} (${bankName})`);
  }
  
  console.log("All employee bank details upserted successfully.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
