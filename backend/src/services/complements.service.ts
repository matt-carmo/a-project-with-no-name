import { Complement, ComplementGroup, Prisma } from "@prisma/client";
import { ComplementsRepository } from "../repositorires/complements.repository";
import { CreateComplementGroupInput } from "../schemas/complement-group.schema";
import { ComplementCreateSchema } from "../schemas/complement.schema";

export class ComplementsService {
    private complementsRepository: ComplementsRepository;
    constructor(complementsRepository: ComplementsRepository) {
        this.complementsRepository = complementsRepository;
    }
    async createComplements(data: Array<Prisma.ComplementUncheckedCreateInput>) {
        return this.complementsRepository.createComplement(data);
    }
    async getComplementsByStoreId(data: Pick<ComplementGroup, "storeId">): Promise<ComplementGroup[]> {
        return this.complementsRepository.getComplementsByStoreId(data);
    }
    async updateComplement({id, data}: {id: string, data: Partial<Complement>} ): Promise<Complement> {

        return this.complementsRepository.updateComplement({id, data});
    }
    async deleteComplement({id}: {id: string}): Promise<Complement> {
        return this.complementsRepository.deleteComplement({id});
    }
}