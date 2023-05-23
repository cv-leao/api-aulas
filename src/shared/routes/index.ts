import { Router } from "express";
import usersRouter from "../../modules/users/routes/users.routes";
import emailRouter from "../../modules/users/routes/email.routes";

const routes = Router();

routes.use("/users", usersRouter);

routes.use("/email", emailRouter);

export default routes;
