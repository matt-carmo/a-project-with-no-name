// services/products/updateProductField.service.ts
import api from "@/api/axios";

export async function updateProduct(
  storeId: string,
  productId: string,
  data: Record<string, any>
) {
  return api.patch(
    `stores/${storeId}/products/${productId}`,
    data
  );
}
