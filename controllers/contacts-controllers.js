import Contact from "../models/Contact.js";
import { HttpError } from "../helpers/index.js";

import { ctrlWrapper } from "../decorators/index.js";

const getAll = async (req, res) => {
    const result = await Contact.find({});

    res.json(result);
};

const getById = async (req, res) => {
    const { id } = req.params;
    // const result = await Contact.findOne({ _id: id });
    const result = await Contact.findById(id);
    if (!result) {
        throw HttpError(404, "Not found");
    }

    res.json(result);
};

const add = async (req, res) => {
    const result = await Contact.create(req.body);

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
    const { id } = req.params;
    if (!req.body.hasOwnProperty("favorite")) {
        throw HttpError(400, "missing field favorite");
    }
    const result = await Contact.findByIdAndUpdate(id, req.body);
    res.json(result);
};

const removeById = async (req, res) => {
    const { id } = req.params;
    const result = await Contact.findByIdAndDelete(id);
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
