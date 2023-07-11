//encrypt password
import bcrypt from "bcrypt";
//give me the way to send the user web token to as authorization
import jwt from "jsonwebtoken";
//MVC Model (I will created this)
import User from "/models/User.js"

//Register User
export const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body;

        //use variable: salt to encrypt the password
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User(
            {
                firstName,
                lastName,
                email,
                password: passwordHash,
                picturePath,
                friends,
                location,
                occupation,
                viewProfile: Math.floor(Math.random() * 10000),
                impressions: Math.floor(Math.random() * 10000)
            }
        );
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}