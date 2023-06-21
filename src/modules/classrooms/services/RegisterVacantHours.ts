import { utcToZonedTime } from "date-fns-tz";
import { prisma } from "../../../database/prismaClient";
import AppError from "../../../shared/errors/AppError";
import { Dates } from "@prisma/client";

interface IRequest {
    user_id: string,
    code: string,
    date: string,
    description: string,
};

class RegisterVacantHours {
    public async execute({ user_id, code, date, description }: IRequest): Promise<Dates> {
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

        if(!classroom) {
            throw new AppError("Sala de aula não encontrada.");
        }

        const userInClassroom = await prisma.classroomUser.findFirst({
            where: {
                classroom: {
                    id: classroom.id,
                },
                user: {
                    id: user.id,
                },
            },
        });

        if(!userInClassroom) {
            throw new AppError("Você precisa estar na sala de aula para cadastrar horário vago.");
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
            throw new AppError("Você precisa ser administrador ou professor da turma para remover participantes.");
        }

        const dateParts = date.split('/');
        const year = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]) - 1;
        const day = parseInt(dateParts[2]);
        const convertedDate = new Date(year, month, day);

        const dateCreated = await prisma.dates.create({
            data: {
                date: convertedDate,
                status: "Disponível",
                description: description,
                absentTeacher: {
                    connect: { id: user.id },
                },
                classroom: {
                    connect: { id: classroom.id },
                },
            },
        });
        
        return dateCreated;
    }
}

export default RegisterVacantHours;
