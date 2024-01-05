import express from "express";
import { isEmptyBody, authenticate } from "../../middlewares/index.js";
import { validateBody } from "../../decorators/index.js";
import { userSignupSchema, userUpdateSubscription } from "../../models/User.js";
import authController from "../../controllers/auth-controller.js";

const authRouter = express.Router();

authRouter.post(
    "/register",
    isEmptyBody,
    validateBody(userSignupSchema),
    authController.register
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

export default authRouter;
