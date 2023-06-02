import { Classroom } from "@prisma/client";
import { prisma } from "../../../database/prismaClient";
import AppError from "../../../shared/errors/AppError";

interface IUserId {
    user_id: string;
}

type Classrooms = Omit<Classroom, "id" | "code" | "active_room">;

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

        const userLevel = user.level;

        const classrooms = await prisma.classroom.findMany({
            select: {
                name: true,
            },
            where: {
                participants: {
                    some: { id: user_id },
                },
                administrators: {
                    some: { id: user_id }
                },
                teachers: {
                    some: { id: user_id }
                },
            },
        });

        return classrooms;
        
    }

}

export default ShowUserClassroomsService;
