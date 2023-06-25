import { Dates } from "@prisma/client";
import { prisma } from "../../../database/prismaClient";
import AppError from "../../../shared/errors/AppError";
import { startOfDay } from "date-fns";

interface IRequest {
    user_id: string;
    code: string;
};

class AgreedToTeachTheClass {
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

        if(user.level != "Professor") {
            throw new AppError("Você precisa ser um Professor para realizar esta ação.");
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
                teacher: {
                    id: user.id,
                },
                classroom: {
                    id: classroom.id,
                },
            },
        });

        if(!userInClassroom) {
            throw new AppError("Você não está na sala de aula.");
        }

        const currentDate = startOfDay(new Date());

        console.log(currentDate);

        const dates = await prisma.dates.findMany({
            where: {
                substituteTeacher: {
                    id: user.id,
                },
                classroom: {
                    id: classroom.id,
                },
                date: {
                    gte: currentDate,
                },
            },
        });

        return dates;
    }
}

export default AgreedToTeachTheClass;
