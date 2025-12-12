
import { CreateGroupComplementInput, GroupsComplementsRepository } from "../repositorires/groups-complements.repository";
import { CreateComplementGroupInput } from "../schemas/complement-group.schema";

export default class GroupsComplementsService {
    constructor(
        private repository: GroupsComplementsRepository,

    ) { }

    async findAll({ storeId, productId }: { storeId: string, productId?: string }) {
        
        const result = await this.repository.findAll({ storeId, productId });
        return result;
    }
    async create({ data, storeId }: {
        data: CreateGroupComplementInput;
        storeId: string;

    }) {
        const result = await this.repository.create({ ...data, storeId });
        return result;
    }
}
