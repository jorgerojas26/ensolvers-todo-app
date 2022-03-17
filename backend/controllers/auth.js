const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signIn = async (req, res) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        return res.status(401).json({ message: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        return res.status(401).json({ message: 'Password incorrect' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });

    return res.status(200).json({
        data: {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        },
    });
};

const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) return res.status(400).json({ error: 'name, email and password are required' });

    const user = await prisma.user.findUnique({ where: { email } });

    if (user) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
        data: { name, email, password: hashedPassword },
    });

    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: '24h' });

    return res.status(201).json({
        data: {
            token,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
            },
        },
    });
};

module.exports = {
    signIn,
    register,
};
