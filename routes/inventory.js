const express = require('express');
const router = express.Router();

const item_controller = require('../controllers/itemController');
const category_controller = require('../controllers/categoryController');

//Inventory home page GET
router.get('/', item_controller.index);

//Item routes//

//Display all items
router.get('/items', item_controller.item_list);

//Display item detail page
router.get('/item/:id', item_controller.item_detail);

//Handle create item GET
router.get('/create/item', item_controller.item_create_get);

//Handle create item POST
router.post('/create/item', item_controller.item_create_post);

//Handle update item GET
router.get('/item/:id/update', item_controller.item_update_get);

//Handle update item POST
router.post('/item/:id/update', item_controller.item_update_post);

//Handle delete item GET
router.get('/item/:id/delete', item_controller.item_delete_get);


//Category routes//

router.get('/categories', category_controller.category_list);

//Display item detail page
router.get('/category/:id', category_controller.category_detail);

//Handle create item GET
router.get('/create/category', category_controller.category_create_get);

//Handle create item POST
router.post('/create/category', category_controller.category_create_post);

//Handle update item GET
router.get('/category/:id/update', category_controller.category_update_get);

//Handle update item POST
router.post('/category/:id/update', category_controller.category_update_post);

//Handle delete item GET
router.get('/category/:id/delete', category_controller.category_delete_get);

module.exports = router;