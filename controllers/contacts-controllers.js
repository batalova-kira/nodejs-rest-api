import Contact from "../models/Contact.js";
import { HttpError } from "../helpers/index.js";

import { ctrlWrapper } from "../decorators/index.js";

const getAll = async (req, res) => {
    const { _id: owner } = req.user;

    const { page = 1, limit = 20, favorite, name } = req.query;
    const skip = (page - 1) * limit;

    const result = await Contact.find(
        name && favorite ? { owner, name: "Chaim Lewis", favorite } : { owner },
        "-createdAt -updatedAt",
        {
            skip,
            limit,
        }
    ).populate("owner", "email");

    res.json(result);
};

const getById = async (req, res) => {
    const { id: _id } = req.params;
    const { _id: owner } = req.user;
    const result = await Contact.findOne({ _id, owner });
    if (!result) {
        throw HttpError(404, "Not found");
    }

    res.json(result);
};

const add = async (req, res) => {
    const { _id: owner } = req.user;
    const result = await Contact.create({ ...req.body, owner });

    res.status(201).json(result);
};

const updateById = async (req, res) => {
    const { id } = req.params;

    const result = await Contact.findByIdAndUpdate(id, req.body);
    if (!result) {
        throw HttpError(404, "Not found");
    }

    res.json(result);
};

const updateStatusContact = async (req, res) => {
    const { id: _id } = req.params;
    const { _id: owner } = req.user;
    // if (!req.body.hasOwnProperty("favorite")) {
    //     throw HttpError(400, "missing field favorite");
    // }
    const result = await Contact.findOneAndUpdate({ _id, owner }, req.body, {
        new: true,
        runValidators: true,
    });
    res.json(result);
};

const removeById = async (req, res) => {
    const { id: _id } = req.params;
    const { _id: owner } = req.user;
    const result = await Contact.findOneAndDelete({ _id, owner });
    if (!result) {
        throw HttpError(404, "Not found");
    }

    res.json({ message: "Contact deleted!" });
};

export default {
    getAll: ctrlWrapper(getAll),
    getById: ctrlWrapper(getById),
    add: ctrlWrapper(add),
    updateById: ctrlWrapper(updateById),
    updateStatusContact: ctrlWrapper(updateStatusContact),
    removeById: ctrlWrapper(removeById),
};
