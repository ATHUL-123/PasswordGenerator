import express from 'express'
const userRoute = express()
import { register,login, generatePassword,SavePassword,fetchSaved,removeSaved } from '../Controllers/UserController.js';
import protect from '../Middleware/userMiddleware.js';

userRoute.post('/register',register)
userRoute.post('/login',login)
userRoute.post('/generate',protect,generatePassword)
userRoute.post('/save',protect,SavePassword)
userRoute.get('/fetchsaved',protect,fetchSaved)
userRoute.patch('/removesaved/:removeId',protect,removeSaved)


export default userRoute;