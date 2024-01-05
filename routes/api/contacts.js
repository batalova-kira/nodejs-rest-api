import express from "express";
import contactsController from "../../controllers/contacts-controllers.js";
import {
    authenticate,
    isEmptyBody,
    isValidId,
} from "../../middlewares/index.js";
import { validateBody } from "../../decorators/index.js";
import {
    contactAddSchema,
    contactUpdateFavorite,
    contactUpdateSchema,
} from "../../models/Contact.js";

const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", contactsController.getAll);

contactsRouter.get("/:id", isValidId, contactsController.getById);

contactsRouter.post(
    "/",
    isEmptyBody,
    validateBody(contactAddSchema),
    contactsController.add
);

contactsRouter.put(
    "/:id",
    isValidId,
    isEmptyBody,
    validateBody(contactUpdateSchema),
    contactsController.updateById
);

contactsRouter.patch(
    "/:id/favorite",
    isValidId,
    validateBody(contactUpdateFavorite),
    contactsController.updateStatusContact
);

contactsRouter.delete("/:id", isValidId, contactsController.removeById);

export default contactsRouter;
