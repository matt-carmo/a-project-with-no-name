import { StoreMenuRepository } from "../repositorires/store-menu.repository";

export class StoreMenuService {
    constructor(private repository: StoreMenuRepository) {}
    getMenuByStoreId(storeId: string) {
        return this.repository.findByStoreId(storeId);
    }
}