import { Router } from "express";
import usersRouter from "../../../modules/users/routes/users.routes";
import emailRouter from "../../../modules/users/routes/email.routes";
import sessionsRouter from "../../../modules/users/routes/sessions.routes";
import classroomsRouter from "../../../modules/classrooms/routes/classrooms.routes";

const routes = Router();

//Users
routes.use("/users", usersRouter);
routes.use("/user/session", sessionsRouter);

routes.use("/email", emailRouter);

//Classrooms
routes.use("/classroom", classroomsRouter);

export default routes;
