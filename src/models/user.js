const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        min: 3,
        max: 20,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        min: 3,
        max: 20,
        trim: true
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        index: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        loadClass: true
    },
    hash_password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    contactNo: {
        type: String
    },
    profilePic: {
        type: String
    },

 }, {timestamps: true}); 

//  userSchema.virtual('password')
//     .set( function(password) {
//         this.hash_password = bcrypt.hashSync(password, 10);
//     });

userSchema.virtual('fullName')
    .get( function(password) {
        return `${this.firstName} ${this.lastName}`;
    });

userSchema.methods = {
    authenticate: async function(password) {
        return await bcrypt.compare(password, this.hash_password);
    }
}

module.exports = mongoose.model('User', userSchema);