import { Schema, model } from "mongoose";
import { addUpdateById, handleSaveError } from "./hooks.js";
import Joi from "joi";

const contactSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Set name for contact"],
        },
        email: {
            type: String,
        },
        phone: {
            type: String,
        },
        favorite: {
            type: Boolean,
            default: false,
        },
    },
    { versionKey: false, timestamps: true }
);

contactSchema.post("save", handleSaveError);

contactSchema.pre("findOneAndUpdate", addUpdateById);

contactSchema.post("findOneAndUpdate", handleSaveError);

const message = (field) => `missing required ${field} field`;

export const contactAddSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .required()
        .messages({
            "any.required": message("name"),
        }),
    email: Joi.string()
        .required()
        .messages({
            "any.required": message("email"),
        }),
    phone: Joi.any()
        .required()
        .messages({
            "any.required": message("number"),
        }),
    favorite: Joi.boolean(),
});

export const contactUpdateSchema = Joi.object({
    name: Joi.string().min(3),
    email: Joi.string(),
    phone: Joi.any(),
    favorite: Joi.boolean(),
});

export const contactUpdateFavorite = Joi.object({
    favorite: Joi.boolean(),
    // .required()
    // .messages({ "any.required": "missing field favorite" }),
});

const Contact = model("contact", contactSchema);

export default Contact;
