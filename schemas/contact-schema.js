import Joi from "joi";

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
});

export const contactUpdateSchema = Joi.object({
    name: Joi.string().min(3),
    email: Joi.string(),
    phone: Joi.any(),
});
