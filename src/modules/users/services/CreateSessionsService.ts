import { sign } from "jsonwebtoken";
import { compare } from "bcryptjs";
import { prisma } from "../../../database/prismaClient";
import AppError from "../../../shared/errors/AppError";

interface ISessionToCreated {
    email: string;
    password: string;
}

interface ISessionToReturn {
    userReturn: {
        id: string;
        name: string;
        email: string;
        level: boolean;
    };
    token: string;
}

class CreateSessionsService {
    public async execute({
        email,
        password,
    }: ISessionToCreated): Promise<ISessionToReturn> {
        const user = await prisma.user.findFirst({
            where: {
                email,
                active: true,
            },
        });

        if (!user) {
            throw new AppError("Combinação incorreta de e-mail/senha.", 401);
        }

        const passwordConfirmed = await compare(password, user.password);

        if (!passwordConfirmed) {
            throw new AppError("Combinação incorreta de e-mail/senha.", 401);
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const token = sign({ sub: user.id }, process.env.JWT_SECRET as string, {
            // subject: user.id,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            expiresIn: process.env.TOKEN_EXPIREIN,
        });

        const userReturn = await prisma.user.findFirst({
            select: {
                id: true,
                name: true,
                email: true,
                level: true,
            },
            where: {
                email,
                active: true,
            },
        });

        return {
            userReturn,
            token,
        } as unknown as ISessionToReturn;
    }
}

export default CreateSessionsService;
