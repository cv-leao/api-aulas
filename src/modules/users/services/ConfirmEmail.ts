import jwt from 'jsonwebtoken';
import AppError from '../../../shared/errors/AppError';
import { prisma } from '../../../database/prismaClient';

interface IConfirmEmail {
    token: string;
}

interface IReturn {
    message: string;
}

class ConfirmEmail {
    public async execute({ token }: IConfirmEmail): Promise<IReturn> {

        try {

            jwt.verify(token, process.env.JWT_SECRET!);

            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { sub: string, email: string };

            const id = decoded.sub;

            const user = await prisma.user.findUnique({
                where: {
                    id: id,
                }
            });

            if(!user){
                throw new AppError("Usuário não encontrado.");
            }

            await prisma.user.update({
                where: {
                    id: id,
                },
                data: {
                    active: true,
                }
            });

            const email = decoded.email;

            await prisma.user.deleteMany({
                where: {
                    email: email,
                    active: false,
                }
            });

        } catch (error) {
            throw new AppError("Erro ao verificar o token JWT. O token pode ter expirado.");
        }

        const toReturn = {
            message: "Token válido, email confirmado!"
        }

        return toReturn;

    }
}

export default ConfirmEmail;
