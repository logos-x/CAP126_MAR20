let productSchema = require('../schema/product');
let categoryController = require('../controllers/categories');

module.exports = {
    GetAllProduct: async () => {
        return await productSchema.find({}).populate('category');
    },
    GetProductById: async (id) => {
        return await productSchema.findById(id).populate('category');
    },
    CreateProduct: async (name, price, quantity, category) => {
        let GetCategory = await categoryController.GetCategoryByName(category);
        if (GetCategory) {
            newProduct = new productSchema({
                name: name,
                price: price,
                quantity: quantity,
                category: GetCategory._id
            })
            return await newProduct.save();
        } else {
            throw new Error("Category is not exist");
        }
    },
    UpdateProduct: async function (id, body) {
        let allowFields = ["price", "quantity", "description"];
        let product = await productSchema.findById(id);
        if (product) {
            for (const key of Object.keys(body)) {
                if (allowFields.includes(key)) {
                    product[key] = body[key]
                }
            }
            return await product.save();
        }
    },
    DeleteProduct: async function (id) {
        let product = await productSchema.findById(id);
        if (product) {
            product.isDelete = true;
            return await product.save();
        }
    }
}