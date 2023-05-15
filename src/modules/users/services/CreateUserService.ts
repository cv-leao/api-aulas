import AppError from "../../../shared/errors/AppError";
import { hash } from "bcryptjs";
import { User } from "@prisma/client";
import { prisma } from "../../../database/prismaClient";

interface IUserToCreate {
    name: string;
    email: string;
    level: string;
    password: string;
    samePasswords: string;
}

type UserCreated = Omit<User, "password">;

class CreateUserService {
    public async execute({
        name,
        email,
        level,
        password,
        samePasswords,
    }: IUserToCreate): Promise<UserCreated> {
        /*********Conferindo se o email inserido pelo usuário está "padronizado"*********/
        const standardizedEmail = /\S+@\S+\.\S+/;

        if (!standardizedEmail.test(email)) {
            throw new AppError("Endereço de e-mail inválido.");
        }
        /********************************************************************************/

        /***Conferindo se o email inserido pelo usuário já está sendo utilizado por outro usuário***/
        const userResponse = await prisma.user.findUnique({
            select: {
                email: true,
            },
            where: {
                email: email,
            },
        });

        const emailExists = !!userResponse;

        if (emailExists) {
            throw new AppError("Endereço de e-mail já usado.");
        }
        /******************************************************************************************/

        /*********Conferindo a confirmação de senha do usuário na hora do cadastro*********/
        if (!(password.length >= 8)) {
            throw new AppError("A senha deve conter no mínimo 8 caracteres.");
        }

        if (!(password === samePasswords)) {
            throw new AppError("As senhas devem ser iguais.");
        }
        /**********************************************************************************/

        if(level != "Aluno" && level != "Professor") {
            throw new AppError("'level' incorreto informado.");
        }

        const hashedPassword = await hash(password, 8);

        const user = await prisma.user.create({
            select: {
                id: true,
                name: true,
                level: true,
                email: true,
            },
            data: {
                name,
                email,
                level,
                password: hashedPassword,
            },
        });

        return user;
    }
}

export default CreateUserService;
