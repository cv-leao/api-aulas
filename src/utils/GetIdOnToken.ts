import { verify } from "jsonwebtoken";
import { prisma } from "../database/prismaClient";
import AppError from "../shared/errors/AppError";

export default async function getIdOnToken(token: string): Promise<string> {
    const decodedToken = verify(token, process.env.JWT_SECRET!);

    const { sub } = decodedToken;

    if(!sub) {
        throw new AppError("O id está ausente.");
    }

    const user = await prisma.user.findUnique({
        where: {
            id: sub as string,
        },
    });

    if(!user) {
        throw new AppError("Usuário não encontrado.");
    }

    return sub as string;
}
