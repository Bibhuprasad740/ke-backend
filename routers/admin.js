const express = require('express');
const adminRouter = express.Router();
const admin = require('../middlewares/admin_middleware');
const Product = require('../models/product');

// Add a product -->
adminRouter.post('/admin/add-product', admin, async (request, response) => {
    try {
        const { name, description, images, quantity, price, category } = request.body;
        let product = new Product({
            name, description, images, quantity, price, category
        });
        product = await product.save();
        response.json(product);
    } catch (e) {
        response.status(500).json({ error: e.message });
    }
});

module.exports = adminRouter;

