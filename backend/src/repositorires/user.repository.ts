import { server } from "../server";

export class UserRepository {
  async create(userData: { email: string; password: string; name: string }) {
    return await server.prisma.user.create({ data: userData });
  }
  async findUnique(email: string) {
    return await server.prisma.user.findUnique({
      where: { email },
      select:{
        name: true,
        id: true,
        password: true,
        email: true,
        stores: {
          select:{
             role: true,
             store: {
               select:{
                 id: true,
                 name: true,
                 slug: true,
                 phoneNumber: true,
                //  settings: true,
               }
             }

          }
          
        },
      },
      
    });
  }
}
