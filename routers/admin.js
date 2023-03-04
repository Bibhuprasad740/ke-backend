const express = require('express');
const adminRouter = express.Router();
const admin = require('../middlewares/admin_middleware');
const Product = require('../models/product');

// Add a product -->
adminRouter.post('/admin/add-product', admin, async (request, response) => {
    try {
        const { name, description, imageUrls, quantity, price, category } = request.body;
        let product = new Product({
            name, description, imageUrls, quantity, price, category
        });
        product = await product.save();
        response.json(product);
    } catch (e) {
        response.status(500).json({ error: e.message });
    }
});

// Get all the products -->
adminRouter.get('/admin/get-products', admin, async (request, response) => {
    try {
        const { name } = request.body;
        const product = await Product.find({});
        if (!product) {
            return response.status(400).json({
                message: 'Requested product doesn\t exist!',
            });
        }
        response.json(product);
    } catch (e) {
        response.status(500).json({ error: e.message });
    }
});

module.exports = adminRouter;

