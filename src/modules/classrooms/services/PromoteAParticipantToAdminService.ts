import { Classroom } from "@prisma/client";
import { prisma } from "../../../database/prismaClient";
import AppError from "../../../shared/errors/AppError";

interface IRequest {
    user_id: string;
    participant_id: string;
    classroom_code: string;
}

class PromoteAParticipantToAdminService {
    public async execute({ user_id, participant_id, classroom_code }: IRequest): Promise<Classroom> {
        const classroom = await prisma.classroom.findUnique({
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
                code: classroom_code,
            }
        });

        if(!classroom) {
            throw new AppError("Sala de aula não encontrada.");
        }

        if(classroom?.active_room === false) {
            throw new AppError("Sala de aula não encontrada.");
        }

        const userIsAdministratorOrTeacher = classroom.administrators.some(
            (administrator) => administrator.id === user_id
          ) || classroom.teachers.some(
            (teacher) => teacher.id === user_id
          );
        
        if(!userIsAdministratorOrTeacher) {
            throw new AppError("Usuário não encontrado.");
        }

        const participantIsAdministrator = classroom.administrators.some((administrator) =>
        administrator.id === participant_id);

        if(participantIsAdministrator) {
            throw new AppError("O participante já é um administrador.");
        }

        const participantIsTeacher = classroom.teachers.some((teacher) =>
        teacher.id === participant_id);

        if(participantIsTeacher) {
            throw new AppError("O usuário selecionado é um professor.");
        }

        const userIsParticipant = classroom.participants.some((participant) =>
        participant.id === user_id);

        if(userIsParticipant) {
            throw new AppError("Participante não encontrado.");
        }

        await prisma.classroom.update({
            where: {
                code: classroom_code,
            },
            data: {
                administrators: {
                    connect: { id: participant_id }
                }
            }
        });

        const classroomToreturn = await prisma.classroom.update({
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
                code: classroom_code,
            },
            data: {
                participants: {
                    disconnect: { id: participant_id }
                }
            }
        });

        return classroomToreturn;
    }
}

export default PromoteAParticipantToAdminService;
