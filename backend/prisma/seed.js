const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
    const user = await prisma.user.findUnique({
        where: {
            email: 'ensolvers@ensolvers.com',
        },
    });

    if (!user) {
        const hashedPassword = await bcrypt.hash('ensolvers', 10);

        await prisma.user.create({
            data: {
                name: 'Ensolvers',
                email: 'ensolvers@ensolvers.com',
                password: hashedPassword,
            },
        });
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
