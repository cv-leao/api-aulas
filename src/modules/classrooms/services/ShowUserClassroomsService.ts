import { Classroom } from "@prisma/client";
import { prisma } from "../../../database/prismaClient";
import AppError from "../../../shared/errors/AppError";

interface IUserId {
    user_id: string;
}

class ShowUserClassroomsService {
    public async execute({ user_id }: IUserId): Promise<Classroom[]> {
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

        
    }

}

export default ShowUserClassroomsService;