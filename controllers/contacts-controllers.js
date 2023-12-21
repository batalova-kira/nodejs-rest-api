import * as contactsService from "../models/contacts.js";
import { HttpError } from "../helpers/index.js";
import {
    contactAddSchema,
    contactUpdateSchema,
} from "../schemas/contact-schema.js";
import { ctrlWrapper } from "../decorators/index.js";

const getAll = async (req, res) => {
    const result = await contactsService.listContacts();

    res.json(result);
};

const getById = async (req, res) => {
    const { id } = req.params;
    const result = await contactsService.getContactById(id);
    if (!result) {
        throw HttpError(404, "Not found");
    }

    res.json(result);
};

const add = async (req, res) => {
    const result = await contactsService.addContact(req.body);

    res.status(201).json(result);
};

const updateById = async (req, res) => {
    const { id } = req.params;
    const result = await contactsService.updateContact(id, req.body);
    if (!result) {
        throw HttpError(404, "Not found");
    }

    res.json(result);
};

const removeById = async (req, res) => {
    const { id } = req.params;
    const result = await contactsService.removeContact(id);
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
    removeById: ctrlWrapper(removeById),
};
