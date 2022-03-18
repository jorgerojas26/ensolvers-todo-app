import { useState, useMemo } from 'react';

import { Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
import Button from '../components/Button';
import Select from 'react-select';

import classnames from 'classnames';
import useSWR from 'swr';
import { createTodo, updateTodo } from '../services/todos';

const NewTaskModal = ({ isOpen, onClose, onSubmit, editingTodo }) => {
    const { data: folders, error } = useSWR('/folders');
    const [loading, setLoading] = useState(false);

    const folderOptions = useMemo(() => {
        if (folders && folders.length) {
            return folders.map((folder) => ({
                value: folder.id,
                label: folder.name,
            }));
        }
        return [];
    }, [folders]);

    const [formData, setFormData] = useState({
        title: '',
        folder: null,
        ...(editingTodo && {
            title: editingTodo.title,
            ...(editingTodo.folder && { folder: { value: editingTodo.folder.id, label: editingTodo.folder.name } }),
        }),
    });

    const [formError, setFormError] = useState({
        title: '',
        response: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title) return setFormError({ ...formError, title: 'Title is required' });

        let response = {};
        setLoading(true);
        if (editingTodo) {
            response = await updateTodo({
                id: editingTodo.id,
                title: formData.title,
                folderId: formData.folder?.value,
            });
        } else {
            response = await createTodo({
                title: formData.title,
                folderId: formData.folder?.value,
            });
        }

        setLoading(false);

        if (response.status !== 200 && response.status !== 201)
            return setFormError({ ...formError, response: response.data.message });

        onSubmit(response.data, editingTodo ? 'update' : 'create');
    };

    return (
        <Modal isOpen={isOpen} toggle={onClose} centered>
            <ModalHeader>New Task</ModalHeader>
            <form onSubmit={handleSubmit}>
                <ModalBody className='d-flex flex-column'>
                    <Input
                        id='title'
                        name='title'
                        placeholder='Enter task title'
                        className={classnames({ 'is-invalid': formError.title })}
                        onChange={handleChange}
                        value={formData.title}
                        autoFocus
                    />
                    <Select
                        name='folder'
                        placeholder='Select folder'
                        options={folderOptions}
                        isClearable
                        value={formData.folder}
                        onChange={(option) => setFormData({ ...formData, folder: option })}
                        className='mt-2'
                        isLoading={!folders && !error}
                    />
                    {formError.title && <p className='mt-2 mb-0 text-danger text-center'>{formError.title}</p>}
                </ModalBody>
                <ModalFooter>
                    <Button type='submit' color='primary' loading={loading}>
                        Save
                    </Button>
                    <Button type='button' color='secondary' onClick={onClose}>
                        Cancel
                    </Button>
                </ModalFooter>
            </form>
        </Modal>
    );
};

export default NewTaskModal;
