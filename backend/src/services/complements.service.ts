import { ComplementGroup } from "@prisma/client";
import { ComplementsRepository } from "../repositorires/complements.repository";

export class ComplementsService {
    private complementsRepository: ComplementsRepository;
    constructor(complementsRepository: ComplementsRepository) {
        this.complementsRepository = complementsRepository;
    }
    async getComplementsByStoreId(data: Pick<ComplementGroup, "storeId">): Promise<ComplementGroup[]> {
        return this.complementsRepository.getComplementsByStoreId(data);
    }
}