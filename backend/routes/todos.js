const router = require('express').Router();

const todo_controller = require('../controllers/todos');

router.route('/').get(todo_controller.getTodos).post(todo_controller.createTodo);

router.route('/:id').get(todo_controller.getTodo).put(todo_controller.updateTodo).delete(todo_controller.deleteTodo);

module.exports = router;
