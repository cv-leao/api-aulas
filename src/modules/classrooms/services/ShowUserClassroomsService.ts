import { Classroom } from "@prisma/client";
import { prisma } from "../../../database/prismaClient";
import AppError from "../../../shared/errors/AppError";

interface IUserId {
    user_id: string;
}

type Classrooms = Omit<Classroom, "active_room">;

class ShowUserClassroomsService {
    public async execute({ user_id }: IUserId): Promise<Classrooms[]> {
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

        const classroomsUser = await prisma.classroomUser.findMany({
            select: {
                classroomId: true,
            },
            where: {
                userId: user_id,
            }
        });

        if(!classroomsUser) {
            throw new AppError("Nenhuma sala encontrada.");
        }

        const classroomIds = classroomsUser.map((classroomUser) => classroomUser.classroomId);

        const classrooms = await prisma.classroom.findMany({
            select: {
                id: true,
                name: true,
                code: true,
            },
            where: {
              id: {
                in: classroomIds,
              },
            },
        });

        return classrooms;
        
    }

}

export default ShowUserClassroomsService;
