import { ClassroomUser } from "@prisma/client";
import { prisma } from "../../../database/prismaClient";
import AppError from "../../../shared/errors/AppError";

interface IRequest {
    user_id: string;
    code: string;
}

class GetClassroomMembers {
    public async execute({ user_id, code }: IRequest): Promise<ClassroomUser[]> {
        const user = await prisma.user.findUnique({
            where: {
                id: user_id,
            },
        });

        if(!user) {
            throw new AppError("Usuário não encontrado.");
        }

        const classroom = await prisma.classroom.findUnique({
            where: {
                code: code,
            },
        });

        if(!classroom || classroom.active_room === false) {
            throw new AppError("Sala de aula não encontrada.");
        }

        const userInClassroom = await prisma.classroomUser.findFirst({
            where: {
                user: {
                    id: user_id,
                },
                classroom: {
                    id: classroom.id,
                },
            },
        });

        if(!userInClassroom) {
            throw new AppError("Você precisa estar na sala de aula para ver os membros dela.");
        }

        const members = await prisma.classroomUser.findMany({
            where: {
                classroom: {
                    id: classroom.id,
                },
            },
        });

        return members;
    }
}

export default GetClassroomMembers;