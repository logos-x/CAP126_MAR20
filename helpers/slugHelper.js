const slugify = require('slugify');

const createSlug = (text) => {
    return slugify(text, {
        lower: true,  
        strict: true, 
        locale: 'vi'        
    });
};

module.exports = createSlug;