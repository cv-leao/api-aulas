import { Classroom } from "@prisma/client";
import { prisma } from "../../../database/prismaClient";
import AppError from "../../../shared/errors/AppError";

interface IRequest {
    user_id: string;
    code: string;
}

class AddParticipantToClassroomService {
    public async execute({ user_id, code }: IRequest): Promise<Classroom> {

        const user = await prisma.user.findUnique({
            where: {
                id: user_id,
            },
        });

        if(!user) {
            throw new AppError("Usuário não encontrado.");
        }

        if(user.active === false) {
            throw new AppError("Usuário não encontrado.");
        }

        const classroom = await prisma.classroom.findUnique({
            where: {
                code: code,
            },
            include: {
                participants: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        level: true,
                    },
                },
                administrators: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        level: true,
                    },
                },
                teachers: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        level: true,
                    },
                }
            }
        });

        if (!classroom) {
            throw new AppError("Sala de aula não encontrada.");
        }

        const userIsAdministrator = classroom.administrators.some((administrator) =>
        administrator.id === user_id);

        const userIsTeacher = classroom.teachers.some((teacher) =>
        teacher.id === user_id);

        const userIsParticipant = classroom.participants.some((participant) =>
        participant.id === user_id);

        if(userIsAdministrator || userIsTeacher || userIsParticipant) {
            throw new AppError("Você já está nesta sala de aula.");
        }

        if(user.level != "Aluno" && user.level != "Professor") {
            throw new AppError("O level do usuário está incorreto.");
        }

        const userlevel = user.level;

        const userInData = {
            ...(userlevel === "Aluno" ? ({
                participants: {
                    connect: { id: user_id },
                }
            }) : ({
                teachers: {
                    connect: { id: user_id }
                }
            }))
        };

        const AddingParticipantInTheClassroom = await prisma.classroom.update({
            select: {
                id: true,
                name: true,
                code: true,
                active_room: true,
                participants: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        level: true,
                    },
                },
                administrators: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        level: true,
                    },
                },
                teachers: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        level: true,
                    },
                }
            },
            where: {
                code: code,
            },
            data: {
                ...userInData,
            }
        });

        return AddingParticipantInTheClassroom;
    }
}

export default AddParticipantToClassroomService;