import { getUserToken } from '../utility/utils';

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export const createTodo = async (todo) => {
    const response = await fetch(`${SERVER_URL}/todos`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getUserToken()}`,
        },
        body: JSON.stringify(todo),
    });
    return { status: response.status, data: await response.json() };
};

export const updateTodo = async (todo) => {
    const response = await fetch(`${SERVER_URL}/todos/${todo.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getUserToken()}`,
        },
        body: JSON.stringify(todo),
    });
    return { status: response.status, data: await response.json() };
};

export const deleteTodo = async (todoId) => {
    const response = await fetch(`${SERVER_URL}/todos/${todoId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getUserToken()}`,
        },
    });
    return { status: response.status, data: await response.json() };
};
