const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const generateJWTToken = (_id, role) => {
    return jwt.sign({_id, role}, process.env.JWT_SECRET, {expiresIn: '1d'});
};

exports.signup = async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).json({ message: 'A user with the same email already exists.' });
    const { firstName, lastName, email, password } = req.body;
    const hash_password = await bcrypt.hash(password, 10);
    user = new User({
        firstName,
        lastName,
        email,
        hash_password,
        username: Math.random().toString()
    });
    user = await user.save();
    if (!user) return res.status(400).json({ message: 'Something went wrong.' });
    
    const token = generateJWTToken(_id, user.role);
    res.status(201).json({
        user,
        token
    });
};

exports.signin = async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ message: 'No such user exists' });

    const isPasswordCorrect = await user.authenticate(req.body.password);
    if (isPasswordCorrect && user.role == 'user') {
        const { _id, firstName, lastName, email, role, fullName } = user;
        const token = generateJWTToken(_id, role);

        res.status(200).json({
            token,
            user: {
                fullName, firstName, lastName, email, role, _id
            }
        });
    }
    else return res.status(400).json({ message: 'Incorrect password' });
}