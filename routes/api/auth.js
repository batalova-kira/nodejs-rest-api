import express from "express";
import { isEmptyBody, authenticate, upload } from "../../middlewares/index.js";
import { validateBody } from "../../decorators/index.js";
import {
    emailSchema,
    userSignupSchema,
    userUpdateSubscription,
} from "../../models/User.js";
import authController from "../../controllers/auth-controller.js";

const authRouter = express.Router();

authRouter.post(
    "/register",
    upload.single("avatarURL"),
    isEmptyBody,
    validateBody(userSignupSchema),
    authController.register
);

authRouter.get("/verify/:verificationToken", authController.verifyEmail);

authRouter.post(
    "/verify",
    validateBody(emailSchema),
    authController.resendVerifyEmail
);

authRouter.post(
    "/login",
    isEmptyBody,
    validateBody(userSignupSchema),
    authController.login
);

authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.post("/logout", authenticate, authController.logout);

authRouter.patch(
    "/subscription",
    authenticate,
    validateBody(userUpdateSubscription),
    authController.subscription
);

authRouter.patch(
    "/avatars",
    authenticate,
    upload.single("avatarURL"),
    authController.updateAvatar
);

export default authRouter;
