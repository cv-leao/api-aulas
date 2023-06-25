import Router from "express";
import ClassroomsController from "../controllers/ClassroomsController";

const classroomsRouter = Router();
const classroomsController = new ClassroomsController

classroomsRouter.post("/create", classroomsController.create);
classroomsRouter.patch("/join/:code", classroomsController.addParticipantWithCode);
classroomsRouter.patch("/promote_to_administrator", classroomsController.promoteAParticipantToAdmin);
classroomsRouter.get("/show_user_classrooms", classroomsController.showUserClassrooms);
classroomsRouter.get("/get_members", classroomsController.getMembers);
classroomsRouter.post("/add_with_email", classroomsController.addParticipantWithEmail);
classroomsRouter.delete("/remove_participant", classroomsController.removeParticipant);

classroomsRouter.post("/create_date", classroomsController.registerVacantHours);
classroomsRouter.get("/get_dates", classroomsController.getDates);
classroomsRouter.get("/my_dates", classroomsController.seeTheVacantClassesThatIRegisteredMyself);
classroomsRouter.get("/my_dates_substitute", classroomsController.agreedToTeachTheClass);
classroomsRouter.patch("/replace_teacher", classroomsController.takeTheClass);

export default classroomsRouter;
