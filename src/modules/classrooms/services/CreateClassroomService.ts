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

        const classroom = await prisma.classroom.create({
            data: {
                name: name,
                code: code,
                active_room: true,
                administrators: {
                    connect: { id: user_id },
                }
            },
            include: {
                administrators: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        level: true,
                    },
                }
            },
        });

        return classroom;
    }
}

export default CreateClassroomService;