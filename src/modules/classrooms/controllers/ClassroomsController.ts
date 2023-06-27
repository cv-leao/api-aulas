import { Request, Response } from "express";
import CreateClassroomService from "../services/CreateClassroomService";
import getIdOnToken from "../../../utils/GetIdOnToken";
import AddParticipantToClassroomService from "../services/AddParticipantToClassroomService";
import PromoteAParticipantToAdminService from "../services/PromoteAParticipantToAdminService";
import ShowUserClassroomsService from "../services/ShowUserClassroomsService";
import GetClassroomMembers from "../services/GetClassroomMembers";
import AddMembersByEmail from "../services/AddMembersByEmail";
import RemoveParticipant from "../services/RemoveParticipant";
import RegisterVacantHours from "../services/RegisterVacantHours";
import GetClassroomDates from "../services/GetClassroomDates";
import SeeTheVacantClassesThatIRegisteredMyself from "../services/SeeTheVacantClassesThatIRegisteredMyself";
import AgreedToTeachTheClass from "../services/AgreedToTeachTheClass";
import TakeTheClass from "../services/TakeTheClass";
import AppError from "../../../shared/errors/AppError";

export default class ClassroomsController {
    public async create(request: Request, response: Response): Promise<Response> {
        const { name } = await request.body;
        const token = request.headers.authorization;

        if(!token) {
            throw new AppError("Token ausente.");
        }

        const user_id = await getIdOnToken(token);

        const createClassroomService = new CreateClassroomService();

        const classroom = await createClassroomService.execute({ user_id, name }).catch(error => {
            response.statusCode = 400;
            return error;
        });

        return response.json(classroom);
    }

    public async addParticipantWithCode(request: Request, response: Response): Promise<Response> {
        const { code } = request.params;
        const token = request.headers.authorization;

        if(!token) {
            throw new AppError("Token ausente.");
        }

        const user_id = await getIdOnToken(token);

        const addParticipantToClassroomService = new AddParticipantToClassroomService();

        const classroom = await addParticipantToClassroomService.execute({ user_id, code }).catch(error => {
            response.statusCode = 400;
            return error;
        });

        return response.json(classroom);
    }

    public async addParticipantWithEmail(request: Request, response: Response): Promise<Response> {
        const { code, participant_email } = await request.body;
        const token = request.headers.authorization;

        if(!token) {
            throw new AppError("Token ausente.");
        }

        const user_id = await getIdOnToken(token);

        const addMembersByEmail = new AddMembersByEmail();

        const members = await addMembersByEmail.execute({ user_id, code, participant_email }).catch(error => {
            response.statusCode = 400;
            return error;
        });

        return response.json(members);
    }

    public async promoteAParticipantToAdmin(request: Request, response: Response): Promise<Response> {
        const { participant_id, classroom_code } = await request.body;
        const token = request.headers.authorization;

        if(!token) {
            throw new AppError("Token ausente.");
        }

        const user_id = await getIdOnToken(token);

        const promoteAParticipantToAdmin = new PromoteAParticipantToAdminService();

        const classroom = await promoteAParticipantToAdmin.execute({ user_id, participant_id, classroom_code }).catch(error => {
            response.statusCode = 400;
            return error;
        });

        return response.json(classroom);
    }

    public async showUserClassrooms(request: Request, response: Response): Promise<Response> {
        const token = request.headers.authorization;

        if (!token) {
            throw new AppError("Token ausente.");
        }

        const user_id = await getIdOnToken(token);

        const showUserClassrooms = new ShowUserClassroomsService();

        const classrooms = await showUserClassrooms.execute({ user_id }).catch(error => {
            response.statusCode = 400;
            return error;
        });

        return response.json(classrooms);
    }

    public async getMembers(request: Request, response: Response): Promise<Response> {
        const { code } = request.params;
        const token = request.headers.authorization;

        if(!token) {
            throw new AppError("Token ausente.");
        }

        const user_id = await getIdOnToken(token);

        const getClassroomMembers = new GetClassroomMembers();

        const members = await getClassroomMembers.execute({ user_id, code }).catch(error => {
            response.statusCode = 400;
            return error;
        });

        return response.json(members);
    }

    public async removeParticipant(request: Request, response: Response): Promise<Response> {
        const { code, participant_id } = await request.body;
        const token = request.headers.authorization;

        if(!token) {
            throw new AppError("Token ausente.");
        }

        const user_id = await getIdOnToken(token);

        const removeParticipant = new RemoveParticipant();

        const members = await removeParticipant.execute({ user_id, code, participant_id }).catch(error => {
            response.statusCode = 400;
            return error;
        });

        return response.json(members);
    }

    public async registerVacantHours(request: Request, response: Response): Promise<Response> {
        const { code, date, description } = await request.body;
        const token = request.headers.authorization;

        if(!token) {
            throw new AppError("Token ausente.");
        }

        const user_id = await getIdOnToken(token);

        const registerVacantHours = new RegisterVacantHours();

        const dateCreated = await registerVacantHours.execute({ user_id, code, date, description }).catch(error => {
            response.statusCode = 400;
            return error;
        });

        return response.json(dateCreated);
    }

    public async getDates(request: Request, response: Response): Promise<Response> {
        const { code } = request.params;
        const token = request.headers.authorization;
        
        if(!token) {
            throw new AppError("Token ausente.");
        }
        
        const user_id = await getIdOnToken(token);

        const getClassroomDates = new GetClassroomDates();

        const dates = await getClassroomDates.execute({ user_id, code }).catch(error => {
            response.statusCode = 400;
            return error;
        });

        return response.json(dates);
    }

    public async seeTheVacantClassesThatIRegisteredMyself(request: Request, response: Response): Promise<Response> {
        const { code } = request.params;
        const token = request.headers.authorization;

        if(!token) {
            throw new AppError("Token ausente.");
        }

        const user_id = await getIdOnToken(token);

        const seeTheVacantClassesThatIRegisteredMyself = new SeeTheVacantClassesThatIRegisteredMyself();

        const dates = await seeTheVacantClassesThatIRegisteredMyself.execute({ user_id, code }).catch(error => {
            response.statusCode = 400;
            return error;
        });

        return response.json(dates);
    }

    public async agreedToTeachTheClass(request: Request, response: Response): Promise<Response> {
        const { code } = request.params;
        const token = request.headers.authorization;

        if(!token) {
            throw new AppError("Token ausente.");
        }

        const user_id = await getIdOnToken(token);

        const agreedToTeachTheClass = new AgreedToTeachTheClass();

        const dates = await agreedToTeachTheClass.execute({ user_id, code }).catch(error => {
            response.statusCode = 400;
            return error;
        });

        return response.json(dates);
    }

    public async takeTheClass(request: Request, response: Response): Promise<Response> {
        const { code, date_id } = await request.body;
        const token = request.headers.authorization;

        if(!token) {
            throw new AppError("Token ausente.");
        }

        const user_id = await getIdOnToken(token);

        const takeTheClass = new TakeTheClass();

        const date = await takeTheClass.execute({ user_id, code, date_id }).catch(error => {
            response.statusCode = 400;
            return error;
        });

        return response.json(date);
    }
}
