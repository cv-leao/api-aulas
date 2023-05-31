import AppError from "../../../shared/errors/AppError";
import { hash } from "bcryptjs";
import { User } from "@prisma/client";
import { prisma } from "../../../database/prismaClient";
import SendEmailForEmailConfirmation from "./SendEmailForEmailConfirmation";

interface IUserToCreate {
    name: string;
    email: string;
    level: string;
    password: string;
    samePasswords: string;
}

type UserCreated = Omit<User, "password" | "token" | "classroomIdParticipants" | "classroomIdTeachers" | "mattersId" | "classroomIdAdministrators">;

class CreateUserService {
    public async execute({
        name,
        email,
        level,
        password,
        samePasswords,
    }: IUserToCreate): Promise<UserCreated> {
        /*********Conferindo se o email inserido pelo usuário está "padronizado"*********/
        const standardizedEmail = /^[a-z-z0-9._%+-]+@[a-za-z0-9.-]+\.[a-za-z]{2,}$/;

        if (!standardizedEmail.test(email)) {
            throw new AppError("Endereço de e-mail inválido.");
        }
        /********************************************************************************/

        /***Conferindo se o email inserido pelo usuário já está sendo utilizado por outro usuário***/
        const userResponse = await prisma.user.findFirst({
            select: {
                email: true,
            },
            where: {
                email: email,
                active: true,
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
                active: true,
            },
            data: {
                name,
                email,
                level,
                password: hashedPassword,
                active: true,
            },
        });

        //const id = user.id;

        //const confirmationEmail = new SendEmailForEmailConfirmation();

        //const token = await confirmationEmail.execute({ name, email, id });

        // await prisma.user.update({
        //     where: {
        //         id: id,
        //     },
        //     data: {
        //         token: token,
        //     }
        // });

        return user;
    }
}

export default CreateUserService;
