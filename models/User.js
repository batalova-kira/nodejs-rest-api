import { Schema, model } from "mongoose";
import { addUpdateById, handleSaveError } from "./hooks.js";
import Joi from "joi";

const emailRegexp =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const _enum = ["starter", "pro", "business"];

const userSchema = new Schema(
    {
        password: {
            type: String,
            required: [true, "Set password for user"],
            minlength: 6,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            match: emailRegexp,
        },
        subscription: {
            type: String,
            enum: _enum,
            default: "starter",
        },
        avatarURL: {
            type: String,
            required: [true, "avatarURL is required"],
        },
        verify: {
            type: Boolean,
            default: false,
        },
        verificationToken: {
            type: String,
        },
        token: String,
    },
    { versionKey: false, timeseries: true }
);

userSchema.post("save", handleSaveError);

userSchema.pre("findOneAndUpdate", addUpdateById);

userSchema.post("findOneAndUpdate", handleSaveError);

export const userSignupSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
});

export const userUpdateSubscription = Joi.object({
    subscription: Joi.string()
        .valid(..._enum)
        .required()
        .messages({ "any.required": "missing field subscription" }),
});

export const emailSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
});
const User = model("user", userSchema);

export default User;
