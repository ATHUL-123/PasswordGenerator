import User from "../Models/UserModel.js";
import SavedPassword from "../Models/SavedPasswords.js";
import bcrypt, { hash } from 'bcrypt'
import _ from "lodash";
import generateToken from "../Utils/jwt.js";
import { passwordGenerator } from "../Helpers/passwordGenerator.js";
import { encryptPassword, decryptPassword } from "../Utils/crypto.js";
const saltRounds = 10;
// Register a new user
const register = async (req, res) => {
    try {


        // Extract user details from request body
        const { name, email, password, isGoogle = false } = req.body;






        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        let hashedPassword = await bcrypt.hash(isGoogle ? process.env.PSECRET : password, saltRounds)


        // Create a new user instance
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            isGoogle: isGoogle
        });

        // Save the user to the database
        await newUser.save();

        if (isGoogle) {
            const token = generateToken(newUser._id)
            const sanitizedUser = Object.assign({}, _.pick(newUser.toJSON(), ['_id', 'name', 'email']));
            sanitizedUser.token = token;
            res.status(201).json({ message: 'User registered successfully', user: sanitizedUser });
        } else {
            // Return success response
            res.status(201).json({ message: 'User registered successfully', user: newUser });
        }


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password = '', isGoogle = false } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser?.isGoogle && password.length > 0) {
            return res.status(400).json({ message: 'Try login with google' });
        }



        if (existingUser) {
            let passwordMatch = await bcrypt.compare(isGoogle ? process.env.PSECRET : password, existingUser.password)
            if (passwordMatch) {
                const token = generateToken(existingUser._id)
                const sanitizedUser = Object.assign({}, _.pick(existingUser.toJSON(), ['_id', 'name', 'email']));
                sanitizedUser.token = token;
                res.status(200).json({ message: 'User Login successfully', user: sanitizedUser });
            } else {
                return res.status(400).json({ message: 'Invalid Password' });
            }
        } else {
            return res.status(400).json({ message: `you don't have an account` });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const generatePassword = async (req, res) => {
    try {

        const { length, upperCase, lowerCase, number, Symbol } = req.body;
        const password = await passwordGenerator(length, upperCase, lowerCase, number, Symbol)
        res.status(200).json(password)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const SavePassword = async (req, res) => {
    try {
        const { password, name, userId } = req.body;
        console.log('adad', req.body);
        // Validate required fields
        if (!password || !name) {
            return res.status(400).json({ message: 'Password, name, are required' });
        }


        const { iv, encryptedData } = encryptPassword(password);
        // Create new password entry
        const newPassword = {
            value: encryptedData,
            iv: iv,
            name: name.trim(),
        };

        // Find the user's saved passwords document or create a new one if it doesn't exist
        let savedPasswordDoc = await SavedPassword.findOne({ userId: userId });
        if (!savedPasswordDoc) {
            savedPasswordDoc = new SavedPassword({ userId: userId, passwords: [newPassword] });
        } else {
            savedPasswordDoc.passwords.push(newPassword);
        }

        // Save the document
        await savedPasswordDoc.save();

        res.status(201).json({ message: 'Password saved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const fetchSaved = async (req, res) => {
    try {
        const userId = req.user.id;

        const savedPasswordDoc = await SavedPassword.findOne({ userId: userId });
        if (!savedPasswordDoc) {
            return res.status(200).json([]);
        }

        const decryptedPasswords = savedPasswordDoc.passwords.map(passwordEntry => ({
            name: passwordEntry.name,
            value: decryptPassword(passwordEntry.value, passwordEntry.iv),
            _id: passwordEntry._id,
            createdAt: passwordEntry.createdAt
        }));
        console.log(decryptedPasswords);
        res.status(200).json(decryptedPasswords);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const removeSaved = async (req, res) => {
    try {

        const  userId = req.user.id 
        const {removeId} = req.params

        if (!userId || !removeId) {
            return res.status(400).json({ message: 'Missing required parameters: userId and removeId' });
        }


        const update = await SavedPassword.findOneAndUpdate(
            { userId },
            { $pull: { passwords: { _id: removeId } } }
        );

        if (!update) {
            return res.status(404).json({ message: 'Document not found' });
        }

        res.status(200).json({status:200, message: 'Password removed successfully' });
    } catch (error) {
        console.error(error);


        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid ID format' });
        } else {
            return res.status(500).json({ message: 'Server error' });
        }
    }
};


// Export multiple methods
export { register, login, generatePassword, SavePassword, fetchSaved, removeSaved };