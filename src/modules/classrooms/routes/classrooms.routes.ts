import Router from "express";
import ClassroomsController from "../controllers/ClassroomsController";

const classroomsRouter = Router();
const classroomsController = new ClassroomsController

classroomsRouter.post("/create", classroomsController.create);
classroomsRouter.patch("/join/:code", classroomsController.addParticipantWithCode);

export default classroomsRouter;
