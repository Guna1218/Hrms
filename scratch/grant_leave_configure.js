const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    // 1. Ensure the permission "leave.configure" exists in the Permission table
    const perm = await prisma.permission.upsert({
      where: {
        module_action: {
          module: 'leave',
          action: 'configure',
        },
      },
      update: {},
      create: {
        module: 'leave',
        action: 'configure',
      },
    });
    console.log('Permission leave.configure resolved:', perm);

    // 2. Link it to the HR_ADMIN role (ID: role_hr_admin)
    const role = await prisma.role.findFirst({
      where: { name: 'HR_ADMIN' },
    });
    if (!role) {
      throw new Error('HR_ADMIN role not found');
    }
    console.log('Found HR_ADMIN role:', role);

    const rolePerm = await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: role.id,
          permissionId: perm.id,
        },
      },
      update: {},
      create: {
        roleId: role.id,
        permissionId: perm.id,
      },
    });
    console.log('Linked leave.configure to HR_ADMIN role successfully:', rolePerm);
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

run();
