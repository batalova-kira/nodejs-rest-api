import express from "express";
import contactsController from "../../controllers/contacts-controllers.js";
import { isEmptyBody } from "../../middlewares/index.js";

const contactsRouter = express.Router();

contactsRouter.get("/", contactsController.getAll);

contactsRouter.get("/:id", contactsController.getById);

contactsRouter.post("/", isEmptyBody, contactsController.add);

contactsRouter.put("/:id", isEmptyBody, contactsController.updateById);

contactsRouter.delete("/:id", contactsController.removeById);
// contactsRouter.get("/:contactId", async (req, res, next) => {
//     res.json({ message: "template message" });
// });

// contactsRouter.post("/", async (req, res, next) => {
//     res.json({ message: "template message" });
// });

// contactsRouter.delete("/:contactId", async (req, res, next) => {
//     res.json({ message: "template message" });
// });

// contactsRouter.put("/:contactId", async (req, res, next) => {
//     res.json({ message: "template message" });
// });

export default contactsRouter;
