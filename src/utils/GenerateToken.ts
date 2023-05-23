import jwt from "jsonwebtoken";

interface IRequest {
    EXPIRATION_LINK_EMAIL: string;
    id: string;
    email: string;
}

export default function generateJWT({ EXPIRATION_LINK_EMAIL, id, email }: IRequest): string {

    const payload = {
        sub: id,
        email: email,
    };

    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET!, {expiresIn: EXPIRATION_LINK_EMAIL});

    return jwtToken;
}
