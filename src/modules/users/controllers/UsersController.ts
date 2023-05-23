import { Request, Response } from "express";
import CreateUserService from "../services/CreateUserService";

export default class UsersController {
    public async create(request: Request, response: Response) {
        const { name, email, level , password, samePasswords } =
            request.body;

        const createUser = new CreateUserService();

        const user = await createUser
            .execute({
                name,
                email,
                level,
                password,
                samePasswords,
            })
            .catch(error => {
                response.statusCode = 400;
                return error;
            });

/*
        if (user.id) {
            const session = new SessionsController();
            session.create(request, response);
        } else {
            return response.json(user);
        }
*/
        return response.json(user);
    }

}
