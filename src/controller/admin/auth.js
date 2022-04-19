const User = require('../../models/user');
const jwt = require('jsonwebtoken');

exports.signup = async(req, res) => {
    let user = await User.findOne({email: req.body.email});
    if (user)  {
        if (user.role==='admin')
            return res.status(400).json({message: 'An admin with the same email already exists.'});
        if (user.role === 'user') 
            return res.status(400).json({message: 'A user with the same email already exists.'});
    }

    const {firstName, lastName, email, password} = req.body;
    user = new User({
        firstName,
        lastName,
        email,
        password,
        username: Math.random().toString(),
        role: 'admin'
    });
    user = await user.save();

    if (!user) return res.status(400).json({message: 'Something went wrong.'});
    // else
    res.status(201).json({
        message: 'Admin created successfully'
    });
};

exports.signin = async(req, res) => {
    let user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).json({message: 'No such user exists'});

    if (user.authenticate(req.body.password) && user.role === 'admin') {
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