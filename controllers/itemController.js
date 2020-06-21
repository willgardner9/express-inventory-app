const Item = require('../models/item');
const Category = require('../models/category');
const { body,validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator/filter');
const { findByIdAndDelete } = require('../models/item');
const async = require('async');

//Index
exports.index = function(req, res) {
    res.redirect('../');
};

//Display all items
exports.item_list = function(req, res, next) {
    Item.find()
    .exec(function (err, results) {
        if (err) { return next(err) }
        res.render('item_list', {title: 'Item list', results: results})
    })
};

//Display item detail page
exports.item_detail = function(req, res, next) {
    Item.findById(req.params.id)
    .populate('category')
    .exec(function (err, results) {
        if (err) { return next(err) }
        res.render('item_detail', {title: results.name, results: results})
    })
};

//Handle create item GET
exports.item_create_get = function(req, res, next) {
    Category.find()
    .exec(function (err, results) {
        if (err) { return next(err) }
        res.render('item_form', { title: 'Add item', results: results })
    })
};

//Handle create item POST
exports.item_create_post = [

    //validate
    body('name').isLength({min: 1}).trim().withMessage('Item name must be specified.'),
    body('description').isLength({min: 1}).trim().withMessage('Item description must be specified.'),
    body('category').isLength({min: 1}).trim().withMessage('Item category must be specified.'),
    body('price').isNumeric(),
    body('stock').isNumeric(),

    //sanitise
    sanitizeBody('name').escape(),
    sanitizeBody('description').escape(),
    sanitizeBody('category').escape(),
    sanitizeBody('price').escape(),
    sanitizeBody('stock').escape(),

    //save to db
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.error(errors)
            res.redirect('/')
            return;
        } else {
            const item = new Item(
                {
                    name: req.body.name,
                    description: req.body.description,
                    category: req.body.category,
                    price: req.body.price,
                    stock: req.body.stock
                });

            item.save(function(err) {
                if (err) { return next(err); }
                res.redirect('../items')
            });
        }
    }
];

//Handle update item GET
exports.item_update_get = function(req, res) {
    async.parallel({
        category: function(callback) {
            Category.find()
              .exec(callback);
        },

        item: function(callback) {
            Item.findById(req.params.id)
              .exec(callback);
        },

    }, function(err, results) {
        if (err) { return next(err); }
        console.log(results)
        res.render('item_update', { title: results.category.name, category: results.category, items: results.item } );
    });
};

//Handle update item POST
exports.item_update_post = [
    
    //validate
    body('name').isLength({min: 1}).trim().withMessage('Item name must be specified.'),
    body('description').isLength({min: 1}).trim().withMessage('Item description must be specified.'),
    body('category').isLength({min: 1}).trim().withMessage('Item category must be specified.'),
    body('price').isNumeric(),
    body('stock').isNumeric(),

    //sanitise
    sanitizeBody('name').escape(),
    sanitizeBody('description').escape(),
    sanitizeBody('category').escape(),
    sanitizeBody('price').escape(),
    sanitizeBody('stock').escape(),

    //save to db
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.error(errors)
            res.redirect('/')
            return;
        } else {
            const item = new Item(
                {
                    name: req.body.name,
                    description: req.body.description,
                    category: req.body.category,
                    price: req.body.price,
                    stock: req.body.stock,
                    _id: req.params.id,
                });

            Item.findByIdAndUpdate(req.params.id, item, {}, function (err, results) {
                if (err) { return next(err) }
                res.redirect('/inventory/items')
            });
        }
    }
]

//Handle delete item GET
exports.item_delete_get = function(req, res) {
    Item.findByIdAndDelete(req.params.id, function deleteItem(err) {
        if (err) { return next(err) }
        res.redirect('/inventory/items');
    })
};