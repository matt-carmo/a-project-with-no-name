import { CreateProductDTO } from "../schemas/create-product.dto";

// utils/parse-multipart-product.ts
export async function parseMultipartProduct(
  data: Record<string, any>,
  storeId: string
): Promise<CreateProductDTO> {
  const form: Record<string, any> = {};
  let imageBuffer: Buffer | null = null;

  for (const key in data) {
    const field = data[key];

    if (field?.type === "field") {
      form[key] = field.value;
      continue;
    }

    if (field?.type === "file" && field.file) {
      imageBuffer = await field.toBuffer();
      continue;
    }
  }

  return {
    name: form.name,
    description: form.description ?? null,
    price: (form.price ? Number(form.price) : undefined) as number,
    isAvailable: form.isAvailable === "true",
    stock: form.stock ? Number(form.stock) : undefined,
    categoryId: form.categoryId || undefined,
    storeId,
    imageBuffer,
    image: {
      url: form.imageUrl,
      id: form.imageId,
    },

    productComplementGroups: form.productComplementGroups
      ? JSON.parse(form.productComplementGroups)
      : [],
  };
}
