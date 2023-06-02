import { Request, Response } from "express";
import CreateClassroomService from "../services/CreateClassroomService";
import getIdOnToken from "../../../utils/GetIdOnToken";
import AddParticipantToClassroomService from "../services/AddParticipantToClassroomService";
import PromoteAParticipantToAdminService from "../services/PromoteAParticipantToAdminService";
import ShowUserClassroomsService from "../services/ShowUserClassroomsService";

export default class ClassroomsController {
    public async create(request: Request, response: Response): Promise<Response> {
        const { token, name } = await request.body;

        const user_id = await getIdOnToken(token);

        const createClassroomService = new CreateClassroomService();

        const classroom = await createClassroomService.execute({ user_id, name }).catch(error => {
            response.statusCode = 400;
            return error;
        });

        return response.json(classroom);
    }

    public async addParticipantWithCode(request: Request, response: Response): Promise<Response> {
        const { code } = request.params;
        const { token } = await request.body;

        const user_id = await getIdOnToken(token);

        const addParticipantToClassroomService = new AddParticipantToClassroomService();

        const classroom = await addParticipantToClassroomService.execute({ user_id, code }).catch(error => {
            response.statusCode = 400;
            return error;
        });

        return response.json(classroom);
    }

    public async promoteAParticipantToAdmin(request: Request, response: Response): Promise<Response> {
        const { participant_id, classroom_code, token } = await request.body;

        const user_id = await getIdOnToken(token);

        const promoteAParticipantToAdmin = new PromoteAParticipantToAdminService();

        const classroom = await promoteAParticipantToAdmin.execute({ user_id, participant_id, classroom_code }).catch(error => {
            response.statusCode = 400;
            return error;
        });

        return response.json(classroom);
    }

    public async showUserClassrooms(request: Request, response: Response): Promise<Response> {
        const {  token } = await request.body;

        const user_id = await getIdOnToken(token);

        const showUserClassrooms = new ShowUserClassroomsService();

        const classrooms = await showUserClassrooms.execute({ user_id }).catch(error => {
            response.statusCode = 400;
            return error;
        });

        return response.json(classrooms);
    }
}
