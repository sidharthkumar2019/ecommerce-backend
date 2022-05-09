const UserAddress = require('../models/address')

exports.addAddress = async (req, res) => {
    console.log(req.body);
    const { payload } = req.body;
    if (!payload) return res.status(400).json({message: 'payload not found'});

    if (payload.address) {
        let address;
        try {
            address = await UserAddress.findOneAndUpdate({ user: req.user._id }, {
                '$push': {
                    address: payload.address
                }
            }, { new: true, upsert: true });
        } catch (error) {
            return res.status(400).json({error})
        }
        if (address) 
            return res.status(201).json({address});
    }
    else 
        res.status(400).json({ error: 'Params address required.' })
};

exports.getAddress = async (req, res) => {
    let address;
    try {
        address = await UserAddress.findOne({user: req.user._id});
    } catch (error) {
        return res.status(400).json({error});
    }

    if (address)
        return res.status(200).json({address});
};