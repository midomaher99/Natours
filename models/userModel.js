const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

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
        minlength: [8, "password can't be less than 8 characters"],
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, "please confirm tour password"],
        validate: {
            //only works on create and save
            validator: function (el) {
                return el === this.password;
            },
            message: "Passwords are not the same."
        }
    },
    passwordChangedAt: Date
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        //do nothing   
    } else {
        this.password = await bcrypt.hash(this.password, 10);
        this.passwordConfirm = undefined;
    }
    next()
})

userSchema.methods.isCorrectPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}
userSchema.methods.changedPasswordAfter = (iat) => {
    if (this.passwordChangedAt) {
        const changeTime = this.passwordChangedAt.getTime() / 1000; //division to convert to second
        return iat < changeTime;
    }
    return false;
}
const User = mongoose.model('User', userSchema);
module.exports = User;