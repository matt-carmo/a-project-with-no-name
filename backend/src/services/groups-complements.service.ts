
import { CreateGroupComplementInput } from "../repositorires/groups-complements.repository";
import { CreateComplementGroupInput } from "../schemas/complement-group.schema";

export default class GroupsComplementsService {
    constructor(
        private repository: CreateComplementGroupInput,

    ) { }

    async create({ data, storeId }: {
        data: CreateGroupComplementInput;
        storeId: string;

    }) {
        const result = await this.repository.create(data, storeId);
        return result;
    }
}
