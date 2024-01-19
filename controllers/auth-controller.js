import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import fs from "fs/promises";
import path from "path";
import gravatar from "gravatar";
import Jimp from "jimp";
import { nanoid } from "nanoid";
import { HttpError, sendEmail } from "../helpers/index.js";

import { ctrlWrapper } from "../decorators/index.js";

const { JWT_SECRET, BASE_URL } = process.env;

const avatarsPath = path.resolve("public", "avatars");

//Реєстрація користувача
const register = async (req, res) => {
    const { email, password } = req.body;

    const gravatarUrl = gravatar.url(email);
    const verificationToken = nanoid();
    const user = await User.findOne({ email });

    if (user) {
        throw HttpError(409, "Email in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
        ...req.body,
        avatarURL: gravatarUrl,
        password: hashPassword,
        verificationToken,
    });

    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target=_blank href="${BASE_URL}/api/users/verify/${verificationToken}">Click verify email</a>`,
    };

    await sendEmail(verifyEmail);

    res.json({
        user: {
            email: newUser.email,
            subscription: newUser.subscription,
        },
    });
};

//Додавання відправки email користувачу з посиланням для верифікації
const verifyEmail = async (req, res) => {
    const { verificationToken } = req.params;
    const user = User.findOne({ verificationToken });
    if (!user) {
        throw HttpError(404, "User not found");
    }

    await User.findByIdAndUpdate(user._id, {
        verify: true,
        verificationToken: "", //питання
    });

    res.json({ message: "Verification successful" });
};

//Додавання повторної відправки email користувачу з посиланням для верифікації
const resendVerifyEmail = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(404, "User not found");
    }
    if (user.verify) {
        throw HttpError(400, "Verification has already been passed");
    }

    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target=_blank href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click verify email</a>`,
    };

    await sendEmail(verifyEmail);

    res.json({
        message: "Verification email sent",
    });
};

//Логін користувача
const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        throw HttpError(401, "Email or password is wrong");
    }

    if (!user.verify) {
        throw HttpError(401, "Email not verify");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);

    if (!passwordCompare) {
        throw HttpError(401, "Email or password is wrong");
    }

    const payload = { id: user._id };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, { token });
    res.json({
        token,
        user: {
            email: user.email,
            subscription: user.subscription,
        },
    });
};

//Діючий користувач
const getCurrent = async (req, res) => {
    const { email, subscription } = req.user;

    res.json({ email, subscription });
};

// Розлогін користувача
const logout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });
    res.json({ message: "Status: 204 No Content" });
};

//Зміна статусу підписки
const subscription = async (req, res) => {
    const { _id } = req.user;

    const result = await User.findOneAndUpdate(_id, req.body, {
        new: true,
        runValidators: true,
    });
    res.json(result);
};

//Оновлення аватару
const updateAvatar = async (req, res) => {
    const { _id } = req.user;
    const { path: oldPath, filename } = req.file;
    // Створюємо новий шлях до файлу
    const newPath = path.join(avatarsPath, filename);

    await fs.rename(oldPath, newPath);
    // Оброби аватарку пакетом jimp і постав для неї розміри 250 на 250
    await Jimp.read(newPath)
        .then((image) => {
            image.quality(70).resize(250, 250).writeAsync(newPath);
        })
        .catch((error) => {
            console.log(error.message);
        });
    // Шлях де лишається файл
    const avatar = path.join("avatars", filename);
    // Перезаписуємо на user avatarURL
    await User.findByIdAndUpdate(_id, { avatarURL: avatar });

    res.json({ avatarURL: avatar });
};

export default {
    register: ctrlWrapper(register),
    verifyEmail: ctrlWrapper(verifyEmail),
    resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    subscription: ctrlWrapper(subscription),
    updateAvatar: ctrlWrapper(updateAvatar),
};
