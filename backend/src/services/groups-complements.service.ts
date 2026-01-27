
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
    async update({ data, storeId, groupId }: {
        data: CreateComplementGroupInput;
        storeId: string;
        groupId: string;
    }) {
        const result = await this.repository.update({ ...data, storeId, groupId });
        return result;
    }
    async createWithConnectProduct({
        data,
        storeId,
        productId,
    }: {
        data: CreateGroupComplementInput[];
        storeId: string;
        productId: string;
    }) {

        return this.repository.createWithConnectProduct({
            data, storeId, productId
        });
    }

    async deleteProductConnection({ groupId, productId }: { groupId: string, productId: string }) {
        return this.repository.deleteProductConnection({ groupId, productId });
    }

    async connectProduct({ groupId, productId }: { groupId: string, productId: string }) {
        return this.repository.connectProduct({ groupId, productId });
    }
}
