const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getTodos = async (req, res) => {
    const { folderId } = req.query;

    try {
        const todos = await prisma.todo.findMany({
            where: { userId: req.user.id, ...(folderId && { folderId: Number(folderId) }) },
            orderBy: { createdAt: 'desc' },
            include: { folder: true },
        });
        res.status(200).json(todos ?? []);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

const getTodo = async (req, res) => {
    const { id } = req.params;

    try {
        const todo = await prisma.todo.findUnique({
            where: { id: Number(id) },
            include: { folder: true },
        });

        if (!todo) return res.status(404).json({ message: 'Todo not found' });

        res.status(200).json(todo);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

const createTodo = async (req, res) => {
    const { title, folderId } = req.body;

    try {
        const todo = await prisma.todo.create({
            data: {
                title,
                ...(folderId && { folder: { connect: { id: Number(folderId) } } }),
                user: { connect: { id: req.user.id } },
            },
        });
        res.status(201).json(todo);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

const updateTodo = async (req, res) => {
    const { id } = req.params;
    const { title, completed, folderId } = req.body;

    try {
        const databaseTodo = await prisma.todo.findUnique({
            where: { id: Number(id) },
            include: { folder: true },
        });

        if (!databaseTodo) return res.status(404).json({ message: 'Todo not found' });

        const todo = await prisma.todo.update({
            where: { id: Number(id) },
            data: {
                title,
                completed: Boolean(completed),
                ...((folderId !== undefined && { folder: { connect: { id: Number(folderId) } } }) || {
                    folderId: null,
                }),
            },
            include: { folder: true },
        });
        res.status(200).json(todo);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

const deleteTodo = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.todo.delete({
            where: { id: Number(id) },
        });
        res.status(200).json({ success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getTodos,
    getTodo,
    createTodo,
    updateTodo,
    deleteTodo,
};
