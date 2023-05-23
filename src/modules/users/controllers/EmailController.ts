import { Request, Response } from "express";
import ConfirmEmail from "../services/ConfirmEmail";

export default class EmailController {
    public async update(request: Request, response: Response) {
        const { token } = await request.body;

        const confirmEmail = new ConfirmEmail();

        const toReturn = await confirmEmail.execute({token: token}).catch(error => {
            response.statusCode = 400;
            return error;
        });

        return response.json(toReturn);
    }

}
