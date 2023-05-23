import nodemailer from "nodemailer";
import HandlebarsMailTemplate from "./HandlebarsMailTemplate";

interface IMailContact {
    name: string;
    email: string;
}

interface ITemplateVariable {
    [key: string]: string | number;
}

interface IParseMailTemplate {
    file: string;
    variables: ITemplateVariable;
}

interface ISendMail {
    to: IMailContact;
    from?: IMailContact;
    subject: string;
    templateData: IParseMailTemplate;
}

export default class EtherealMail {
    static async sendMail({
        to,
        from,
        subject,
        templateData,
    }: ISendMail): Promise<void> {

        const mailTemplate = new HandlebarsMailTemplate();

        const transporter = nodemailer.createTransport({
            host: "smtp.hotmail.com",
            port: 587,
            secure: false,
            auth: {
                type: "login",
                user: "sjkkjbd@hotmail.com",
                pass: "A12345678test",
            },
        });

        const message = await transporter.sendMail({
            from: {
                name: from?.name || "Equipe Aulas",
                address: from?.email || process.env.HOTMAIL!,
            },
            to: {
                name: to.name,
                address: to.email,
            },
            subject,
            html: await mailTemplate.parse(templateData),
        });

        console.log("Message sent: %s", message.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(message));
    }
}
