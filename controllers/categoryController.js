const Category = require('../models/category');
const Item = require('../models/item');
const async = require('async');
const { body,validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator/filter');

//Display all categories
exports.category_list = function(req, res) {
    Category.find()
    .exec(function (err, results) {
        if (err) { return next(err) }
        res.render('category_list', {title: 'Category list', results: results})
    })
};

//Display category detail page
exports.category_detail = function(req, res, next) {

    async.parallel({
        category: function(callback) {
            Category.findById(req.params.id)
              .exec(callback);
        },

        item: function(callback) {
            Item.find({ 'category': req.params.id })
              .exec(callback);
        },

    }, function(err, results) {
        if (err) { return next(err); }
        res.render('category_detail', { title: results.category.name, category: results.category, items: results.item } );
    });
};

//Handle create category GET
exports.category_create_get = function(req, res, next) {
    res.render('category_form', { title: 'Add category' })
};

//Handle create category POST
exports.category_create_post = [
    
    //validate
    body('name').isLength({min: 1}).trim().withMessage('Item name must be specified.'),
    body('description').isLength({min: 1}).trim().withMessage('Item description must be specified.'),

    //sanitise
    sanitizeBody('name').escape(),
    sanitizeBody('description').escape(),

    //save to db
    (req, res, next) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            console.error(errors)
            res.redirect('/')
            return;
        } else {
            const category = new Category(
                {
                    name: req.body.name,
                    description: req.body.description
                }
            );

            category.save(function(err) {
                if (err) { return next(err); }
                res.redirect('../categories')
            })
        }
    }
]

//Handle update category GET
exports.category_update_get = function(req, res) {
    Category.findById(req.params.id)
    .exec(function (err, results) {
        if (err) { return next(err) }
        res.render('category_update', {title: 'Update category', results: results})
    })
};

//Handle update category POST
exports.category_update_post = [
    
    //validate
    body('name').isLength({min: 1}).trim().withMessage('Item name must be specified.'),
    body('description').isLength({min: 1}).trim().withMessage('Item description must be specified.'),

    //sanitise
    sanitizeBody('name').escape(),
    sanitizeBody('description').escape(),

    //save to db
    (req, res, next) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            console.error(errors)
            res.redirect('/')
            return;
        } else {
            const category = new Category(
                {
                    name: req.body.name,
                    description: req.body.description,
                    _id: req.params.id
                }
            );

            Category.findByIdAndUpdate(req.params.id, category, {}, function (err, results) {
                if (err) { return next(err) }
                res.redirect('/inventory/categories')
            });
        }
    }
]

//Handle delete category GET
exports.category_delete_get = function(req, res) {
    Category.findByIdAndDelete(req.params.id, function deleteCategory(err) {
        if (err) { return next(err) }
        res.redirect('/inventory/categories');
    })
};