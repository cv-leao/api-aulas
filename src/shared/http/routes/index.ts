import { Router } from "express";
import usersRouter from "../../../modules/users/routes/users.routes";
import emailRouter from "../../../modules/users/routes/email.routes";
import sessionsRouter from "../../../modules/users/routes/sessions.routes";

const routes = Router();

routes.use("/users", usersRouter);
routes.use("/user/session", sessionsRouter);

routes.use("/email", emailRouter);

export default routes;
