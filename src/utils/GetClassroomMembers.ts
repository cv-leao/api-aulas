import { prisma } from "../database/prismaClient";
import AppError from "../shared/errors/AppError";

interface IMembers {
    teachers?: {
        id: string;
        name: string;
        email: string;
        level: string;
    }[];
    administrators?: {
        id: string;
        name: string;
        email: string;
        level: string;
    }[];
    participants?: {
        id: string;
        name: string;
        email: string;
        level: string;
    }[];
}

export default async function getClassroomMembers(id: string): Promise<IMembers> {
    const classroom = await prisma.classroom.findUnique({
        where: {
            id: id,
        },
    });

    if(!classroom) {
        throw new AppError("Sala de aula não encontrada.");
    }

    const classroomUsers = await prisma.classroomUser.findMany({
        select: {
            participant: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  level: true,
                },
            },
            administrator: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  level: true,
                },
            },
            teacher: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  level: true,
                },
            },
        },
        where: {
            classroom: {
                id: id,
            },
        },
    });

    const members: IMembers = {
        teachers: [],
        administrators: [],
        participants: [],
    };

    classroomUsers.forEach((classroomUser) => {
        if (classroomUser.teacher) {
          if (!members.teachers) {
            members.teachers = [];
          }
          members.teachers.push(classroomUser.teacher);
        }
      
        if (classroomUser.administrator) {
          if (!members.administrators) {
            members.administrators = [];
          }
          members.administrators.push(classroomUser.administrator);
        }
      
        if (classroomUser.participant) {
          if (!members.participants) {
            members.participants = [];
          }
          members.participants.push(classroomUser.participant);
        }
    });
    
    return members;
}
