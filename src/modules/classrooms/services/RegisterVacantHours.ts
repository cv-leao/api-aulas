import { prisma } from "../../../database/prismaClient";
import AppError from "../../../shared/errors/AppError";
import { Dates } from "@prisma/client";
import { isAfter, isValid, parse, startOfDay } from "date-fns";
import isValidDate from "../../../utils/IsValidDate";

interface IRequest {
    user_id: string,
    code: string,
    date: string,
    description: string,
};

class RegisterVacantHours {
    public async execute({ user_id, code, date, description }: IRequest): Promise<Dates> {
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

        if(classroom.active_room === false) {
            throw new AppError("A sala de aula está desativada.");
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

        const isValid = await isValidDate(year, month, day);

        if(!isValid) {
            throw new AppError("Data inválida.");
        }

        const convertedDate = new Date(year, month, day);

        const currentDate = startOfDay(new Date());

        const isDateValid = isAfter(convertedDate, currentDate) || convertedDate.getTime() === currentDate.getTime();

        if(!isDateValid) {
            throw new AppError("Data inválida!");
        }

        const dateCreated = await prisma.dates.create({
            data: {
                date: convertedDate,
                status: "Disponível",
                description: description,
                dateCreatedBy: {
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
