//encrypt password
import bcrypt from "bcrypt";
//give me the way to send the user web token to as authorization
import jwt from "jsonwebtoken";
//MVC Model (I will created this)
import User from "../models/User.js"

//Register User
export const register = async (req, res) => {
    try {
        //this is form User UI from the Front End
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

        //This is when the newUser (User object) is actually initialized
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

        //save user: ?
        const savedUser = await newUser.save();
        //send token back to the user
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//Logging IN:
export const login = async (req, res) => {
    try {
        //destructure:
        const { email, password } = req.body;

        //using mongoose to findOne person that has the same email
        //note the second 'email' is the one from the above line
        const user = await User.findOne({ email: email });
        if (!user) return res.status(400).json({ msg: "User does not exist.  " });

        const isMatch = await bcrypt.compare(password,
            //this is one that is save in the DB
            user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credential.  " });

        //Passed the logged in process
        //this line pull values process.env.JWT_SECRET from .env file
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        //so that it does not get send back to the front end
        delete user.password;
        //send back the token
        res.status(200).json({ token, user });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}