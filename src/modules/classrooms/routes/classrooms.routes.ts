import Router from "express";
import ClassroomsController from "../controllers/ClassroomsController";

const classroomsRouter = Router();
const classroomsController = new ClassroomsController

classroomsRouter.post("/create", classroomsController.create);
classroomsRouter.patch("/join/:code", classroomsController.addParticipantWithCode);
classroomsRouter.patch("/promote_to_administrator", classroomsController.promoteAParticipantToAdmin);
classroomsRouter.get("/show_user_classrooms", classroomsController.showUserClassrooms);

export default classroomsRouter;
