import { useState } from 'react';
import { Card, CardBody, Container } from 'reactstrap';
import Sidebar from '../components/Sidebar';
import TodoList from '../components/TodoList';
import NewTaskModal from '../components/NewTaskModal';
import NewFolderModal from '../components/NewFolderModal';

import { useSWRConfig } from 'swr';

const Home = () => {
    const { mutate } = useSWRConfig();

    const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
    const [activeFolder, setActiveFolder] = useState('all');
    const [newTaskModalOpen, setNewTaskModalOpen] = useState(false);
    const [newFolderModalOpen, setNewFolderModalOpen] = useState(false);
    const [editingTodo, setEditingTodo] = useState(null);

    const handleTodoSubmit = (task, action) => {
        const url = activeFolder === 'all' ? '/todos' : `/todos?folderId=${activeFolder}`;

        if (action === 'update') {
            mutate(url, (todos) => todos.map((todo) => (todo.id === task.id ? task : todo)), false);
        } else {
            mutate(url, (todos) => [...todos, task], false);
        }

        setNewTaskModalOpen(false);
    };

    return (
        <>
            <Container className='h-100 d-grid align-items-center'>
                <Card className='h-75 rounded'>
                    <CardBody className='d-flex p-0 position-relative h-100'>
                        <div
                            style={{
                                position: 'absolute',
                                background: 'rgba(34,41,47,.2)',
                                zIndex: 1,
                            }}
                            className={`w-100 h-100 d-${sidebarCollapsed ? 'none' : 'flex'}`}
                            onClick={() => setSidebarCollapsed(true)}
                        />
                        <Sidebar
                            sidebarCollapsed={sidebarCollapsed}
                            onItemSelect={(item) => setActiveFolder(item)}
                            onAddTask={() => setNewTaskModalOpen(true)}
                            onAddFolder={() => setNewFolderModalOpen(true)}
                        />
                        <CardBody className='p-0 h-100'>
                            <TodoList
                                onMenuOpen={() => setSidebarCollapsed(!sidebarCollapsed)}
                                selectedFolder={activeFolder}
                                onUpdate={(todo) => {
                                    setEditingTodo(() => {
                                        setNewTaskModalOpen(true);
                                        return todo;
                                    });
                                }}
                            />
                        </CardBody>
                    </CardBody>
                </Card>
            </Container>
            {newTaskModalOpen && (
                <NewTaskModal
                    isOpen={newTaskModalOpen}
                    onClose={() => {
                        setEditingTodo(null);
                        setNewTaskModalOpen(false);
                    }}
                    onSubmit={handleTodoSubmit}
                    editingTodo={editingTodo}
                />
            )}
            {newFolderModalOpen && (
                <NewFolderModal
                    isOpen={newFolderModalOpen}
                    onClose={() => setNewFolderModalOpen(false)}
                    onSubmit={(newFolder) => {
                        setNewFolderModalOpen(false);
                        mutate('/folders', (folders) => [...folders, newFolder], false);
                    }}
                />
            )}
        </>
    );
};

export default Home;
