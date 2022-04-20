const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.signup = async(req, res) => {
    let user = await User.findOne({email: req.body.email});
    if (user)   return res.status(400).json({message: 'A user with the same email already exists.'});

    const {firstName, lastName, email, password} = req.body;
    const hash_password = await bcrypt.hash(password, 10);
    user = new User({
        firstName,
        lastName,
        email,
        hash_password,
        username: Math.random().toString()
    });
    user = await user.save();

    if (!user) return res.status(400).json({message: 'Something went wrong.'});
    // else
    res.status(201).json({
        message: 'User created successfully'
    });
};

exports.signin = async(req, res) => {
    let user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).json({message: 'No such user exists'});

    if (user.authenticate(req.body.password)) {
        const token = jwt.sign({_id: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: '1d'});
        const { _id,firstName, lastName, email, role, fullName} = user;
        
        res.status(200).json({
            token,
            user: {
                fullName, firstName, lastName, email, role, _id
            }
        });
    }
    else return res.status(400).json({message: 'Incorrect password'});
}