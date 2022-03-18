import { Input } from 'reactstrap';
import { MinusCircle } from 'react-feather';
import classnames from 'classnames';

import { deleteTodo, updateTodo } from '../services/todos';

const TodoItem = ({ todo, onDelete, onUpdate, onClick }) => {
    const handleDelete = async (event) => {
        event.stopPropagation();
        event.preventDefault();

        const isConfirmed = window.confirm('Are you sure you want to delete this todo?');

        if (isConfirmed) {
            const { status } = await deleteTodo(todo.id);

            if (status === 200) onDelete(todo.id);
        }
    };

    const handleCompletion = async (event) => {
        event.stopPropagation();

        const { status, data: updatedTodo } = await updateTodo({ ...todo, completed: event.target.checked });

        if (status === 200) onUpdate(updatedTodo);
    };

    return (
        <li
            className={classnames('py-3 border todo-item', {
                'bg-white': !todo.completed,
                'bg-light': todo.completed,
                'text-muted': todo.completed,
            })}
            role='button'
            onClick={onClick}
        >
            <div className='d-flex justify-content-between px-3'>
                <div className='d-flex gap-3'>
                    <Input type='checkbox' defaultChecked={todo.completed} onClick={handleCompletion} />
                    <span>{todo.title}</span>
                </div>
                <div className='d-flex gap-2 align-items-center'>
                    <span>{todo.createdAt}</span>
                    <MinusCircle size={20} onClick={handleDelete} className='text-danger' />
                </div>
            </div>
        </li>
    );
};

export default TodoItem;
