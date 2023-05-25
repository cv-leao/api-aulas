import { Request, Response } from "express";
import CreateSessionsService from "../services/CreateSessionsService";

export default class SessionsController {
    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { email, password } = request.body;

        const createSession = new CreateSessionsService();

        try {
            const user = await createSession.execute({
                email,
                password,
            });

            return response.json(user);
        } catch (error: any) {
            response.statusCode = 401;
            return response.json(error);
        }
    }
}
