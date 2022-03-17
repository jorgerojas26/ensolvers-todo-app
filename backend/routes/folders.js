const router = require('express').Router();

const folder_controller = require('../controllers/folders');

router.route('/').get(folder_controller.getFolders).post(folder_controller.createFolder);

router
    .route('/:id')
    .get(folder_controller.getFolder)
    .put(folder_controller.updateFolder)
    .delete(folder_controller.deleteFolder);

module.exports = router;
