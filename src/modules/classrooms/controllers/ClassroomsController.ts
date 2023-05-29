import { Request, Response } from "express";
import CreateClassroomService from "../services/CreateClassroomService";
import getIdOnToken from "../../../utils/GetIdOnToken";

export default class ClassroomsController {
    public async create(request: Request, response: Response) {
        const { token, name } = await request.body;

        const user_id = await getIdOnToken(token);

        const createClassroomService = new CreateClassroomService();

        const classroom = await createClassroomService.execute({ user_id, name }).catch(error => {
            response.statusCode = 400;
            return error;
        });

        return response.json(classroom);
    }
}