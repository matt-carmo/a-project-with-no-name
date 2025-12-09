// dto/create-product.dto.ts
export type ProductComplementGroupDTO = {
  groupId: string;
  id?: string;
  minSelected?: number;
  maxSelected?: number;
};

export type CreateProductDTO = {
  name: string;
  description?: string | null;
  price: number ;
  photoUrl?: string;
  isAvailable?: boolean;
  stock?: number;
  storeId: string;
  categoryId?: string;
  productComplementGroups?: ProductComplementGroupDTO[];
  image:{
    url: string;
    id: string;
  }

};
export type UpdateProductDTO = CreateProductDTO & { storeId: string; categoryId: string };