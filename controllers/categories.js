let categorySchema = require('../schema/category');

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
        newCategory = new categorySchema({
            name: name,
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
            return await category.save();
        }
    },
    DeleteCategory: async function (id) {
        let category = await categorySchema.findById(id);
        if (category) {
            category.isDelete = true;
            return await category.save();
        }
    }
}