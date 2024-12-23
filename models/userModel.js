const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        maxlenght: [40, "name shouldn't exceed 40 characters."],
        required: [true, "please tell us your name"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "please provide an e-mail"],
        unique: [true, "invalid e-mail"],
        lowercase: true,
        validate: {
            validator: validator.isEmail,
            message: "please provide a valid e-mail."
        }

    },
    photo: {
        type: String
    },
    password: {
        type: String,
        required: [true, "please provide a password"],
        minlength: [8, "password can't be less than 8 characters"]
    },
    passwordConfirm: {
        type: String,
        required: [true, "please confirm tour password"]
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;