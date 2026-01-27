
import api from "@/api/axios";
import { Category } from "@/interfaces/menu.interface";

export const menuService = {
    getMenu: async (storeId: string) => {
        const { data } = await api.get<Category[]>(`stores/${storeId}/menu`);
        return data;
    },

    deleteCategory: async (categoryId: string) => {
        return api.delete(`categories/${categoryId}`);
    },

    updateGroupAvailability: async (storeId: string, groupId: string, isAvailable: boolean) => {
        return api.put(`/${storeId}/groups-complements/${groupId}`, {
            isAvailable,
        });
    },

    createCategory: async (storeId: string, name: string) => {
        return api.post(`${storeId}/categories`, { name });
    },

    updateCategory: async (categoryId: string, name: string) => {
        return api.patch(`categories/${categoryId}`, { name });
    },

    getComplementGroups: async (storeId: string) => {
        const { data } = await api.get<any[]>(`${storeId}/groups-complements`);
        return data;
    },

    connectGroupToProduct: async (storeId: string, productId: string, groupId: string) => {
        return api.post(`${storeId}/products/${productId}/groups-complements/${groupId}/connect`, {});
    }
};
