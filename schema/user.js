let mongoose  = require('mongoose');
let bcrypt = require('bcrypt')

// 218060541 - Tran Quang Tai

let userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        default: ""
    },
    avatarURL: {
        type: String,
        default: ""
    },
    status: {
        type: Boolean,
        default: false
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    },
    loginCount: {
        type: Number,
        default: 0,
        min: 0
    },
    isDelete: { 
        type: Boolean, 
        default: false 
    },
    tokenResetPassword:String,
    tokenResetPasswordExp:Date
}, {
    timestamps: true
})
userSchema.pre('save',function(next){
    if(this.isModified("password")){
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(this.password,salt);
        this.password=hash;
    }
    next();
})

module.exports = mongoose.model('User', userSchema);