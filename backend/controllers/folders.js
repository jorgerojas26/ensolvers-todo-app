const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getFolders = async (req, res) => {
    try {
        const folders = await prisma.folder.findMany({ where: { userId: req.user.id } });

        res.status(200).json({ folders });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

const getFolder = async (req, res) => {
    try {
        const { id } = req.params;

        const folder = await prisma.folder.findUnique({ where: { id: Number(id) } });

        if (!folder) throw new Error('Folder not found');

        res.status(200).json({ folder });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

const createFolder = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) throw new Error('Name is required');

        const folder = await prisma.folder.create({
            data: {
                name,
                userId: req.user.id,
            },
        });

        res.status(201).json({ folder });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

const updateFolder = async (req, res) => {
    try {
        const { name } = req.body;
        const { id } = req.params;

        if (!name) throw new Error('Name is required');

        const folder = await prisma.folder.update({
            where: { id: Number(id) },
            data: {
                name,
                userId: req.user.id,
            },
        });

        res.status(200).json({ folder });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

const deleteFolder = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.folder.delete({ where: { id: Number(id) } });

        res.status(200).json({ message: 'Folder deleted' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getFolders,
    getFolder,
    createFolder,
    updateFolder,
    deleteFolder,
};
