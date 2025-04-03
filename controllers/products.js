let productSchema = require('../schema/product');
let categoryController = require('../controllers/categories');
const createSlug = require('../helpers/slugHelper');

module.exports = {
    GetAllProduct: async () => {
        return await productSchema.find({}).populate('category');
    },
    GetProductById: async (id) => {
        return await productSchema.findById(id).populate('category');
    },
    CreateProduct: async (name, price, quantity, category) => {
        let GetCategory = await categoryController.GetCategoryByName(category);
        let slug = createSlug(name);
        if (GetCategory) {
            newProduct = new productSchema({
                name: name,
                price: price,
                quantity: quantity,
                slug: slug,
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
            if (body.name) {
                product.slug = createSlug(body.name);
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
    },
    GetAllProductByCategorySlug: async function (slug){
        let category = await categoryController.GetCategoryBySlug(slug);
        if (category) {
            return await productSchema.find({ category: category._id }).populate('category');
        }
    },
    GetProductBySlug: async function (slug) {
        return await productSchema.findOne({ slug: slug }).populate('category');
    },
}