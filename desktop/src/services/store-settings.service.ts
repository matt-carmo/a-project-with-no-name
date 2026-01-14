import api from "@/api/axios";

export interface StoreSettings {
  id: string;
  storeId: string;
  isOpen: boolean;
  minOrderValue: number | null;
  deliveryFee: number | null;
  pickupEnabled: boolean;
  deliveryEnabled: boolean;
  openHours: string | null;
}

export async function getStoreSettings(storeId: string): Promise<StoreSettings> {
  const response = await api.get(`/stores/${storeId}/settings`);
  return response.data;
}

export async function updateStoreSettings(
  storeId: string,
  data: Partial<StoreSettings>
): Promise<StoreSettings> {
  const response = await api.patch(`/stores/${storeId}/settings`, data);
  return response.data;
}
