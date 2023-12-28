import User from "../models/User.js";

import { HttpError } from "../helpers/index.js";

import { ctrlWrapper } from "../decorators/index.js";

const register = async (req, res) => {
    const newUser = await User.create(req.body);
    res.json({
        user: {
            email: `${User.email}`,
            subscription: `${User.subscription}`,
        },
    });
};

export default {
    register: ctrlWrapper(register),
};
