// services/complements/updateComplement.service.ts
import api from "@/api/axios";

export async function updateComplement(
  complementId: string,
  data: Record<string, any>
) {
  return api.patch(
    `complements/${complementId}`,
    data
  );
}
