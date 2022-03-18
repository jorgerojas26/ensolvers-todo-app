import { useState } from 'react';

import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input } from 'reactstrap';

import classnames from 'classnames';
import { createFolder } from '../services/folders';

const NewFolderModal = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        folder: null,
    });
    const [formError, setFormError] = useState({
        name: '',
        response: '',
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setFormError({ name: '', response: '' });

        if (!formData.name) return setFormError({ ...formError, name: 'Name is required' });

        setLoading(true);
        const { status, data: newFolder } = await createFolder(formData);
        setLoading(false);

        if (status !== 201) return setFormError({ ...formError, response: newFolder.message });

        onSubmit(newFolder);
    };

    return (
        <Modal isOpen={isOpen} toggle={onClose} centered>
            <ModalHeader>New Folder</ModalHeader>
            <form onSubmit={handleSubmit}>
                <ModalBody className='d-flex flex-column'>
                    <Input
                        name='name'
                        placeholder='Enter folder name'
                        className={classnames({ 'is-invalid': formError.name })}
                        onChange={handleChange}
                        autoFocus
                    />
                    {formError.name && <p className='mt-2 mb-0 text-danger text-center'>{formError.name}</p>}
                    {formError.response && <p className='mt-2 mb-0 text-danger text-center'>{formError.response}</p>}
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

export default NewFolderModal;
