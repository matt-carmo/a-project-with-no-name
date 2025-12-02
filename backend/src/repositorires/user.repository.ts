import { server } from "../server";

export class UserRepository {

    
    async create(userData: { email: string; password: string; name: string }) {
        return await server.prisma.user.create({ data: userData });
    }
    async findUnique(email: string) {
        return await server.prisma.user.findUnique({ where: { email } });
    }
 }