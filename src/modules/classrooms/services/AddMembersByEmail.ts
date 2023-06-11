import { prisma } from "../../../database/prismaClient";
import AppError from "../../../shared/errors/AppError";
import getClassroomMembers from "../../../utils/GetClassroomMembers";

interface IRequest {
    user_id: string;
    code: string;
    participant_email: string;
};

class AddMembersByEmail {
    public async execute({ user_id, code, participant_email }: IRequest): Promise<any> {
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

        const participant = await prisma.user.findFirst({
            where: {
                email: participant_email,
                active: true,
            },
        });

        if(!participant) {
            throw new AppError("O usuário à ser adicionado não foi encontrado.");
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
            throw new AppError("Você precisa ser administrador ou professor da turma para adicionar participantes.");
        }

        const participantInClassroom = await prisma.classroomUser.findFirst({
            where: {
                classroom: {
                    id: classroom.id,
                },
                user: {
                    id: participant.id,
                },
            },
        });

        if(participantInClassroom) {
            throw new AppError("O usuário já está na turma.");
        }

        const participantLevel = participant.level;

        const userInData = {
            ...(participantLevel === "Aluno" ? ({
                participant: {
                    connect: { id: participant.id },
                },
            }) : ({
                teacher: {
                    connect: { id: participant.id },
                },
            }))
        };

        await prisma.classroomUser.create({
            data: {
                ...userInData,
                user: {
                    connect: { id: participant.id },
                },
                classroom: {
                    connect: { id: classroom.id },
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

export default AddMembersByEmail;