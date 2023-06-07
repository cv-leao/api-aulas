import { Classroom } from "@prisma/client";
import { prisma } from "../../../database/prismaClient";
import AppError from "../../../shared/errors/AppError";
import generateClassroomCode from "../../../utils/GenerateClassroomCode";

interface IClassroomToCreate {
    user_id: string;
    name: string;
}

class CreateClassroomService {
    public async execute({user_id, name}: IClassroomToCreate): Promise<Classroom> {
        const user = await prisma.user.findUnique({
            where: {
                id: user_id
            },
        });

        if(!user) {
            throw new AppError("Usuário não encontrado.");
        }

        if(user.active === false) {
            throw new AppError("Usuário não encontrado.");
        }

        const code = await generateClassroomCode();

        if(!code) {
            throw new AppError("Erro ao gerar código da sala.");
        }

        if(user.level != "Aluno" && user.level != "Professor") {
            throw new AppError("O level do usuário está incorreto.");
        }

        const userlevel = user.level;

        const classroom = await prisma.classroom.create({
            data: {
                name: name,
                code: code,
                active_room: true,
            }
        });

        const userInData = {
            ...(userlevel === "Aluno" ? ({
                administrator: {
                    connect: { id: user_id },
                }
            }) : ({
                teacher: {
                    connect: { id: user_id }
                }
            }))
        };

        await prisma.classroomUser.create({
            data: {
                ...userInData,
                user: {
                    connect: { id: user_id },
                },
                classroom: {
                    connect: { id: classroom.id },
                },
            },
        });

        return classroom;
    }
}

export default CreateClassroomService;
