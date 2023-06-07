import { prisma } from "../../../database/prismaClient";
import AppError from "../../../shared/errors/AppError";
import getClassroomMembers from "../../../utils/GetClassroomMembers";

interface IRequest {
    user_id: string;
    code: string;
}

interface IResponse {
    id: string;
    name: string;
    code: string;
    active_room: string;
    teachers: {
        name: string;
        email: string;
        level: string;
    };
    administrators: {
        name: string;
        email: string;
        level: string;
    };
    participants: {
        name: string;
        email: string;
        level: string;
    };
}

class AddParticipantToClassroomService {
    public async execute({ user_id, code }: IRequest): Promise<any> {

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
            select: {
                id: true,
                name: true,
                code: true,
                active_room: true,
            },
            where: {
                code: code,
            },
        });

        if (!classroom) {
            throw new AppError("Sala de aula não encontrada.");
        }

        if(classroom.active_room === false) {
            throw new AppError("Sala de aula não encontrada.");
        }

        const classroomUserMember = await prisma.classroomUser.findFirst({
            where: {
                user: {
                    id: user_id,
                },
                classroom: {
                    id: classroom.id,
                },
            }
        });

        if(classroomUserMember) {
            throw new AppError("Você já está nessa sala de aula.");
        }

        const userlevel = user.level;

        const userInData = {
            ...(userlevel === "Aluno" ? ({
                participant: {
                    connect: { id: user_id },
                },
            }) : ({
                teacher: {
                    connect: { id: user_id },
                },
            }))
        };

        await prisma.classroomUser.create({
            data: {
                ...userInData,
                user: {
                    connect: { id: user_id },
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

export default AddParticipantToClassroomService;
