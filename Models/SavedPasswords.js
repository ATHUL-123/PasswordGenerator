import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Define the Password schema
const passwordSchema = new Schema({
    value: {
        type: String,
        required: true,
    },
    iv: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

// Define the SavedPassword schema
const savedPasswordSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    passwords: [passwordSchema]
}, { timestamps: true });

// Create and export the SavedPassword model
const SavedPassword = mongoose.model('SavedPassword', savedPasswordSchema);
export default SavedPassword;

