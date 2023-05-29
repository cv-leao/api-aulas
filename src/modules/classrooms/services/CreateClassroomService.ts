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

        const code = generateClassroomCode();

        if(!code) {
            throw new AppError("Erro ao gerar código da sala.");
        }

        if(user.level != "Aluno" && user.level != "Professor") {
            throw new AppError("O level do usuário está incorreto.");
        }

        const userlevel = user.level;

        const userInData = {
            name: name,
            code: code,
            active_room: true,
            ...(userlevel === "Aluno" ? ({
                administrators: {
                    connect: { id: user_id },
                }
            }) : ({
                teachers: {
                    connect: { id: user_id }
                }
            }))
        };

        const userInInclude = {
            ...(userlevel === "Aluno" ? ({
                administrators: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        level: true,
                    },
                }
            }) : ({
                teachers: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        level: true,
                    }
                }
            }))
        }

        const classroom = await prisma.classroom.create({
            data: {
                ...userInData,
            },
            include: {
                ...userInInclude,
            },
        });

        return classroom;
    }
}

export default CreateClassroomService;
