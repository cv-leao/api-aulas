import { prisma } from "../../../database/prismaClient";
import AppError from "../../../shared/errors/AppError";
import getClassroomMembers from "../../../utils/GetClassroomMembers";

interface IRequest {
    user_id: string;
    participant_id: string;
    classroom_code: string;
}

class PromoteAParticipantToAdminService {
    public async execute({ user_id, participant_id, classroom_code }: IRequest): Promise<any> {
        const classroom = await prisma.classroom.findUnique({
            select: {
                id: true,
                name: true,
                code: true,
                active_room: true,
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

        const userInClassroom = await prisma.classroomUser.findFirst({
            where: {
                classroom: {
                    id: classroom.id,
                },
                user: {
                    id: user_id,
                },
            },
        });

        if(!userInClassroom) {
            throw new AppError("Você não está nesta sala de aula.");
        }

        const userIsParticipant = await prisma.classroomUser.findFirst({
            where: {
                classroom: {
                    id: classroom.id,
                },
                participant: {
                    id: user_id,
                },
            },
        });

        if(userIsParticipant) {
            throw new AppError("Você precisa ser um administrador ou professor para realizar esta função.");
        }

        const participantInClassroom = await prisma.classroomUser.findFirst({
            where: {
                classroom: {
                    id: classroom.id,
                },
                participant: {
                    id: participant_id,
                },
            },
        });

        if(!participantInClassroom) {
            throw new AppError("O usuário à ser promovido não foi encontrado.");
        }

        const participantIsAdministrator = await prisma.classroomUser.findFirst({
            where: {
                classroom: {
                    id: classroom.id,
                },
                administrator: {
                    id: participant_id,
                },
            },
        });

        if(participantIsAdministrator) {
            throw new AppError("O usuário já é um administrador.");
        }

        const participantIsTeacher = await prisma.classroomUser.findFirst({
            where: {
                classroom: {
                    id: classroom.id,
                },
                teacher: {
                    id: participant_id,
                },
            },
        });

        if(participantIsTeacher) {
            throw new AppError("O usuário é um professor.");
        }

        await prisma.classroomUser.update({
            where: {
                id: participantInClassroom.id,
            },
            data: {
                administrator: {
                    connect: { id: participant_id },
                },
                participant: {
                    disconnect: true,
                },
            },
        });

        let classroomToReturn = [];

        classroomToReturn.push(classroom);
        const members = await getClassroomMembers(classroom.id);
        classroomToReturn.push(members);

        return classroomToReturn;
    }
}

export default PromoteAParticipantToAdminService;
