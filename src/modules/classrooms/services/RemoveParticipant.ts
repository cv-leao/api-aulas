import { prisma } from "../../../database/prismaClient";
import AppError from "../../../shared/errors/AppError";
import getClassroomMembers from "../../../utils/GetClassroomMembers";

interface IRequest {
    user_id: string;
    code: string;
    participant_id: string;
};

class RemoveParticipant {
    public async execute({ user_id, code, participant_id }: IRequest): Promise<any> {
        const user = await prisma.user.findFirst({
            where: {
                id: user_id,
                active: true,
            },
        });

        if(!user) {
            throw new AppError("Usuário não encontrado.");
        }

        const classroom = await prisma.classroom.findFirst({
            where: {
                code: code,
                active_room: true,
            },
        });

        if(!classroom) {
            throw new AppError("Sala de aula não encontrada.");
        }

        const participantInClassroom = await prisma.classroomUser.findFirst({
            where: {
                user: {
                    id: participant_id,
                },
                classroom: {
                    id: classroom.id,
                },
            },
        });

        if(!participantInClassroom) {
            throw new AppError("O participante informado precisa estar na sala de aula para ser removido.");
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

        await prisma.classroomUser.delete({
            where: {
                id: participantInClassroom.id,
            },
        });

        let classroomToReturn = [];

        classroomToReturn.push(classroom);
        const members = await getClassroomMembers(classroom.id);
        classroomToReturn.push(members);

        return classroomToReturn;
    }
}

export default RemoveParticipant;