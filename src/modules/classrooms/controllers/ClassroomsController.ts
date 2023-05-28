import { Request, Response } from "express";
import CreateClassroomService from "../services/CreateClassroomService";

export default class ClassroomsController {
    public async create(request: Request, response: Response) {
        const { user_id, name } = await request.body;

        const createClassroomService = new CreateClassroomService();

        const classroom = await createClassroomService.execute({ user_id, name }).catch(error => {
            response.statusCode = 400;
            return error;
        });

        return response.json(classroom);
    }
}