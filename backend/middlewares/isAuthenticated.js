const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const jwt = require('jsonwebtoken');

const isAuthenticated = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    const token = authHeader && authHeader.split(' ')[1];

    if (!token) next(new Error('You are not authenticated'));

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);

        const databaseUser = await prisma.user.findUnique({ where: { id: user.userId } });

        if (!databaseUser) next(new Error('You are not authenticated'));

        req.user = {
            id: databaseUser.id,
            email: databaseUser.email,
            name: databaseUser.name,
            token,
        };

        next();
    } catch (err) {
        next(err);
    }
};

module.exports = isAuthenticated;
