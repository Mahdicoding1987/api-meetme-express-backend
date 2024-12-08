const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: false
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'prefer not to say']
    },
    location: {
        type: String,
        required: false
    },
    bio: {
        type: String,
        required: false
    },
    avatar: {
        type: String,
        default: 'https://example.com/default-avatar.png' // Default avatar URL
      },
});

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.hashedPassword;
    }
});

module.exports = mongoose.model('User', userSchema);