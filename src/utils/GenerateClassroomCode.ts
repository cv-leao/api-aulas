import { Classroom } from "@prisma/client";
import { prisma } from "../database/prismaClient";

export default async function generateClassroomCode(): Promise<string> {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let classroom: Classroom | null;
  let code: string;
  
  do {
    code = '';
  
    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }

    classroom = await prisma.classroom.findUnique({
      where: {
        code: code,
      },
    });

  } while (classroom !== null);
  
  return code;
}
