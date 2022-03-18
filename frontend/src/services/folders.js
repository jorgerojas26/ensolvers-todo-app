import { getUserToken } from '../utility/utils';

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export const createFolder = async (folder) => {
    const response = await fetch(`${SERVER_URL}/folders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getUserToken()}`,
        },
        body: JSON.stringify(folder),
    });
    return { status: response.status, data: await response.json() };
};

export const updateFolder = async (folder) => {
    const response = await fetch(`${SERVER_URL}/folders/${folder.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getUserToken()}`,
        },
        body: JSON.stringify(folder),
    });
    return { status: response.status, data: await response.json() };
};

export const deleteFolder = async (folderId) => {
    const response = await fetch(`${SERVER_URL}/folders/${folderId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getUserToken()}`,
        },
    });
    return { status: response.status, data: await response.json() };
};
