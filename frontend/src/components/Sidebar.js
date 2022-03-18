import { useState, useEffect } from 'react';
import { Card, CardTitle, Collapse, Button, Spinner } from 'reactstrap';
import { Plus, Folder, Star, MinusCircle } from 'react-feather';
import { Link } from 'react-router-dom';

import { deleteFolder } from '../services/folders';

import classnames from 'classnames';
import useSWR, { useSWRConfig } from 'swr';

const Sidebar = ({ sidebarCollapsed, onAddTask, onAddFolder, onItemSelect }) => {
    const { mutate } = useSWRConfig();
    const { data: folders, error: foldersError } = useSWR('/folders');
    const [activeItemId, setActiveItemId] = useState('all');

    const handleDeleteFolder = async (event, folder) => {
        event.stopPropagation();
        event.preventDefault();

        const isConfirmed = window.confirm(`Are you sure you want to delete ${folder.name}?`);

        if (isConfirmed) {
            const { status } = await deleteFolder(folder.id);

            if (status === 200) {
                mutate(
                    '/folders',
                    (oldData) => {
                        const newData = oldData.filter((item) => item.id !== folder.id);
                        return newData;
                    },
                    false
                );
                mutate('/todos');
                mutate(activeItemId === 'all' ? '/todos' : `/todos?folderId=${activeItemId}`);
            }
        }
    };

    useEffect(() => {
        onItemSelect(activeItemId);
    }, [activeItemId]);

    return (
        <Collapse
            isOpen={true}
            navbar
            horizontal
            className={`d-${sidebarCollapsed ? 'none' : 'block'} d-lg-block h-100 text-muted`}
            style={{
                minWidth: 250,
                maxWidth: 250,
                zIndex: 2,
                position: sidebarCollapsed ? 'relative' : 'absolute',
            }}
        >
            <Card className='border-end h-100 text-muted overflow-auto' style={{ maxHeight: '100vh' }}>
                <div className='p-3'>
                    <Button color='primary' block onClick={onAddTask}>
                        Add Task
                    </Button>
                </div>
                <div className='mt-2 mb-5'>
                    <Link
                        to='#'
                        className={classnames(
                            'btn d-flex align-items-center mb-1 text-muted w-100 py-1 gap-2 px-3 border-primary border-0 border-2 rounded-0',
                            {
                                'border-start ': activeItemId === 'all',
                            }
                        )}
                        onClick={() => setActiveItemId('all')}
                    >
                        <Star size={20} />
                        <h6 className='m-0'>My tasks</h6>
                    </Link>
                </div>
                <CardTitle className='d-flex justify-content-between align-items-center mt-2 px-3'>
                    <h6 className='m-0'>Folders</h6>
                    <button className='btn m-0 p-0' onClick={onAddFolder}>
                        <Plus size={15} />
                    </button>
                </CardTitle>
                <div className='mt-2'>
                    {!folders && !foldersError && (
                        <div className='d-flex justify-content-center'>
                            <Spinner size='sm' color='primary' />
                        </div>
                    )}
                    {folders &&
                        folders.length > 0 &&
                        folders.map((folder) => {
                            return (
                                <Link
                                    to='#'
                                    key={folder.id}
                                    className={classnames(
                                        'btn d-flex align-items-center justify-content-between mb-1 text-muted w-100 py-1 px-3 border-primary border-0 border-2 rounded-0',
                                        {
                                            'border-start ': activeItemId === folder.id,
                                        }
                                    )}
                                    onClick={() => setActiveItemId(folder.id)}
                                >
                                    <div className='d-flex gap-2'>
                                        <Folder size={20} />
                                        <h6 className='m-0 text-truncate' title={folder.name}>
                                            {folder.name}
                                        </h6>
                                    </div>
                                    <MinusCircle
                                        size={15}
                                        onClick={(e) => handleDeleteFolder(e, folder)}
                                        className='text-danger'
                                    />
                                </Link>
                            );
                        })}
                </div>
            </Card>
        </Collapse>
    );
};

export default Sidebar;
