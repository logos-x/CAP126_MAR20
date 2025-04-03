let categorySchema = require('../schema/category');
const createSlug = require('../helpers/slugHelper');

module.exports = {
    GetAllCategory: async () => {
        return await categorySchema.find({});
    },
    GetCategoryById: async (id) => {
        return await categorySchema.findById(id);
    },
    GetCategoryByName: async (name) => {
        return await categorySchema.findOne({
            name: name
        });
    },
    CreateCategory: async (name, description) => {
        let slug = createSlug(name);
        newCategory = new categorySchema({
            name: name,
            slug: slug,
            description: description
        })
        return await newCategory.save();
    },
    UpdateCategory: async function (id, body) {
        let allowFields = ["description"];
        let category = await categorySchema.findById(id);
        if (category) {
            for (const key of Object.keys(body)) {
                if (allowFields.includes(key)) {
                    category[key] = body[key]
                }
            }
            if (body.name) {
                category.slug = createSlug(body.name);
            }
            return await category.save();
        }
    },
    DeleteCategory: async function (id) {
        let category = await categorySchema.findById(id);
        if (category) {
            category.isDelete = true;
            return await category.save();
        }
    },
    GetCategoryBySlug: async (slug) => {
        return await categorySchema.findOne({ slug: slug });
    },
}