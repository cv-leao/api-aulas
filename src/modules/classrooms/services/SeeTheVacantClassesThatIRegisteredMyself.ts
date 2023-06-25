import { Dates } from "@prisma/client";
import { prisma } from "../../../database/prismaClient";
import AppError from "../../../shared/errors/AppError";
import { getDate } from "date-fns";

interface IRequest {
    user_id: string;
    code: string;
};

class SeeTheVacantClassesThatIRegisteredMyself {
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
            throw new AppError("Você não é um participante da sala de aula.");
        }

        const userIsAdministrator = await prisma.classroomUser.findFirst({
            where: {
                classroom: {
                    id: classroom.id,
                },
                administrator: {
                    id: user.id
                },
            },
        });

        const userIsTeacher = await prisma.classroomUser.findFirst({
            where: {
                classroom: {
                    id: classroom.id,
                },
                teacher: {
                    id: user.id,
                },
            },
        });

        let userIsAdministratorOrTeacher = true;

        if(!userIsAdministrator) {
            userIsAdministratorOrTeacher = false;
        }

        if(!userIsTeacher) {
            userIsAdministratorOrTeacher = false;
        }

        if(userIsAdministratorOrTeacher) {
            throw new AppError("Você precisa ser administrador ou professor da turma para realizar essa ação.");
        }

        const currentDate = new Date();
        currentDate.setDate(getDate(new Date()));

        const dates = await prisma.dates.findMany({
            where: {
                dateCreatedBy: {
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

export default SeeTheVacantClassesThatIRegisteredMyself;
