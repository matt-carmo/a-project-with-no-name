// services/complements/updateComplement.service.ts
import api from "@/api/axios";

interface UpdateComplementParams {
  complementId: string;
  storeId: string;
  groupId: string;
  data: Record<string, any>;
}

export async function updateComplement({
  complementId,
  storeId,
  groupId,
  data,
}: UpdateComplementParams) {
  return api.patch(
    `/${storeId}/complement-groups/${groupId}/complements/${complementId}`,
    data
  );
}
