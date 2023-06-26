import { startOfDay } from "date-fns";
import { prisma } from "../../../database/prismaClient";
import AppError from "../../../shared/errors/AppError";
import { Dates } from "@prisma/client";

interface IRequest {
    user_id: string;
    code: string;
    date_id: string;
};

class TakeTheClass {
    public async execute({ user_id, code, date_id }: IRequest): Promise<Dates> {
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

        const currentDate = startOfDay(new Date());

        const dateExists = await prisma.dates.findFirst({
            where: {
                id: date_id,
                date: {
                    gte: currentDate,
                },
            },
        });

        if(!dateExists) {
            throw new AppError("A data informada é inválida/inexistente.");
        }

        if(dateExists.substituteTeacherId != null) {
            throw new AppError("Já tem um professor substituto para a data selecionada.");
        }

        if(dateExists.dateCreatedById === user.id) {
            throw new AppError("Você não pode substituir sua própria aula.");
        }

        const date = await prisma.dates.update({
            where: {
                id: date_id,
            },
            data: {
                substituteTeacher: {
                    connect: { id: user.id },
                },
            },
        });

        return date;
    }
}

export default TakeTheClass;