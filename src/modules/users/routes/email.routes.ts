import Router from "express";
import EmailController from "../controllers/EmailController";

const emailRouter = Router();
const emailController = new EmailController();

emailRouter.patch("/confirm_email", emailController.update);

export default emailRouter;
