import path from "path";
import { prisma } from "../../../database/prismaClient";
import AppError from "../../../shared/errors/AppError";
import generateJWT from "../../../utils/GenerateToken";
import EtherealMail from "../../../config/mail/EtherealMail";

interface ISendToEmail {
    name: string;
    email: string;
    id: string;
}

class SendEmailForEmailConfirmation {
    public async execute({ name, email, id }: ISendToEmail): Promise<string> {
        const user = await prisma.user.findUnique({
            select: {
                email: true,
            },
            where: {
                id: id,
            }
        });

        if(!user){
            throw new AppError("Usuário não encontrado.");
        }

        const time = process.env.EXPIRATION_LINK_EMAIL!;

        const token = generateJWT({ EXPIRATION_LINK_EMAIL: time, id, email });

        const ConfirmEmailTemplate = path.resolve(
            __dirname,
            "..",
            "views",
            "confirm_email.hbs",
        );

        await EtherealMail.sendMail({
            to: {
                name: name,
                email: email,
            },
            subject: "[Aulas] Confirmação de email",
            templateData: {
                file: ConfirmEmailTemplate,
                variables: {
                    name: name,
                    link: `http://localhost:3000/confirm_email?token=${token}`,
                },
            },
        });

        return token;
    }
}

export default SendEmailForEmailConfirmation;
