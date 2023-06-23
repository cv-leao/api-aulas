import { Dates } from "@prisma/client";
import { prisma } from "../../../database/prismaClient";
import AppError from "../../../shared/errors/AppError";

interface IRequest {
    user_id: string;
    code: string;
};

class GetClassroomDates {
    public async execute({ user_id, code }: IRequest): Promise<Dates[]> {
        const user = await prisma.user.findFirst({
            where: {
                id: user_id,
                active: true,
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

        if(!classroom) {
            throw new AppError("Sala de aula não encontrada.");
        }

        const userInClassroom = await prisma.classroomUser.findFirst({
            where: {
                user: {
                    id: user.id,
                },
                classroom: {
                    id: classroom.id,
                },
            },
        });

        if(!userInClassroom) {
            throw new AppError("Você precisa fazer parte da sala de aula para ver as datas.");
        }

        const dates = await prisma.dates.findMany({
            where: {
                classroom: {
                    id: classroom.id,
                },
            },
        });

        return dates;
    }
};

export default GetClassroomDates;