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

const getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await contactsService.getContactById(id);
        if (!result) {
            throw HttpError(404, "Not found");
        }
        res.json(result);
    } catch (error) {
        next(error);
    }
};

const add = async (req, res, next) => {
    try {
        const { error } = contactAddSchema.validate(req.body);
        if (error) {
            throw HttpError(400, error.message);
        }
        const result = await contactsService.addContact(req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

const updateById = async (req, res, next) => {
    try {
        const { error } = contactUpdateSchema.validate(req.body);
        if (error) {
            throw HttpError(400, error.message);
        }
        const { id } = req.params;
        const result = await contactsService.updateContact(id, req.body);
        if (!result) {
            throw HttpError(404, "Not found");
        }
        res.json(result);
    } catch (error) {
        next(error);
    }
};

const removeById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await contactsService.removeContact(id);
        if (!result) {
            throw HttpError(404, "Not found");
        }
        res.json({ message: "Contact deleted!" });
    } catch (error) {
        next(error);
    }
};
export default {
    getAll: ctrlWrapper(getAll),
    getById,
    add,
    updateById,
    removeById,
};
