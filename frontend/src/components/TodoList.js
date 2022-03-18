import { useState, useMemo } from 'react';

import { useNavigate } from 'react-router-dom';

import { Input, InputGroup, Spinner } from 'reactstrap';
import { Menu, Search, LogOut } from 'react-feather';
import TodoItem from './TodoItem';

import useSWR, { useSWRConfig } from 'swr';

import { removeUserSession } from '../utility/utils';

const TodoList = ({ onMenuOpen, selectedFolder, onUpdate }) => {
    const navigate = useNavigate();
    const { mutate } = useSWRConfig();
    const { data: todos, error: todosError } = useSWR(
        selectedFolder === 'all' ? '/todos' : `/todos?folderId=${selectedFolder}`
    );
    const [search, setSearch] = useState('');

    const filteredTodos = useMemo(() => {
        if (!todos || !todos.length) return [];

        const formattedData = todos.map((todo) => {
            return {
                ...todo,
                createdAt: new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(
                    new Date(todo.createdAt)
                ),
            };
        });

        if (!search) return formattedData;

        return formattedData.filter((todo) => todo.title.toLowerCase().includes(search.toLowerCase()));
    }, [todos, search]);

    const handleTodoDelete = (todoId) => {
        mutate(
            selectedFolder === 'all' ? '/todos' : `/todos?folderId=${selectedFolder}`,
            todos.filter((todo) => todo.id !== todoId),
            false
        );
    };

    const handleTodoUpdate = (todo) => {
        mutate(
            selectedFolder === 'all' ? '/todos' : `/todos?folderId=${selectedFolder}`,
            todos.map((t) => (t.id === todo.id ? todo : t)),
            false
        );
    };

    const handleLogOut = () => {
        removeUserSession();
        navigate('/signin');
    };

    return (
        <div className='d-flex flex-column h-100' style={{ maxHeight: '100vh' }}>
            <div
                className='d-flex align-items-center gap-3 p-3 text-muted border bg-white'
                style={{ flex: '0 1 auto' }}
            >
                <Menu className='d-lg-none' role='button' onClick={onMenuOpen} />
                <InputGroup className='d-flex align-items-center'>
                    <Search size={15} />
                    <Input
                        className='m-0 border-0 p-0 ps-3 text-muted'
                        style={{ borderRadius: 0 }}
                        placeholder='Search task'
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </InputGroup>
                <LogOut role='button' className='text-danger' onClick={handleLogOut} />
            </div>
            <div className='d-flex flex-column overflow-auto h-100'>
                {!todos && !todosError && (
                    <div className='d-flex justify-content-center align-items-center h-100'>
                        <Spinner size='md' color='primary' />
                    </div>
                )}
                {filteredTodos &&
                    filteredTodos.map((todo) => (
                        <TodoItem
                            key={todo.id}
                            todo={todo}
                            onDelete={handleTodoDelete}
                            onUpdate={handleTodoUpdate}
                            onClick={() => onUpdate(todo)}
                        />
                    ))}
            </div>
        </div>
    );
};

export default TodoList;
