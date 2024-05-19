
import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Define the User schema
const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true,
    },
    isGoogle:{
        type: Boolean,
        default:false
    }

}, { timestamps: true });

// Create and export the User model
const User = mongoose.model('User', UserSchema);
export default  User;
