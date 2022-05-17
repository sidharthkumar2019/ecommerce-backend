const UserAddress = require('../models/address')

exports.addAddress = async (req, res) => {
    const { payload } = req.body;
    if (!payload) return res.status(400).json({ message: 'payload not found' });

    if (payload.address) {
        if (payload.address._id) {
            let address;
            try {
                address = await UserAddress.findOneAndUpdate(
                    { user: req.user._id, 'address._id': payload.address._id },
                    {
                        '$set': {
                            'address.$': payload.address,
                        }
                    }, { new: true, upsert: true });
            } catch (error) {
                return res.status(400).json({ error })
            }
            if (address)
                return res.status(201).json({ address });
        }
        else {
            let address;
            try {
                address = await UserAddress.findOneAndUpdate(
                    { user: req.user._id },
                    {
                        '$push': {
                            address: payload.address
                        }
                    }, { new: true, upsert: true });
            } catch (error) {
                return res.status(400).json({ error })
            }
            if (address)
                return res.status(201).json({ address });
        }
    }
    else
        res.status(400).json({ error: 'Params address required.' })
};

exports.getAddress = async (req, res) => {
    let address;
    try {
        address = await UserAddress.findOne({ user: req.user._id });
    } catch (error) {
        return res.status(400).json({ error });
    }

    if (address)
        return res.status(200).json({ address });
};